<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use App\Models\Workshop;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RegistrationController extends Controller
{
    private const STATUSES = [
        'confirmed',
        'waitlist',
        'cancelled',
        'rejected',
    ];

    /**
     * Display registrations.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'nullable',
                Rule::in(self::STATUSES),
            ],

            'workshop_id' => [
                'nullable',
                'integer',
                'exists:workshops,id',
            ],

            'page' => [
                'nullable',
                'integer',
                'min:1',
            ],
        ]);

        $query = Registration::query()
            ->with([
                'workshop' => function ($query): void {
                    $query->select([
                        'id',
                        'title',
                        'workshop_date',
                        'venue',
                        'city',
                        'capacity',
                        'status',
                    ]);
                },
            ])
            ->latest('id');

        $this->applyFilters($query, $filters);

        $paginator = $query
            ->paginate(15)
            ->withQueryString();

        $summaryQuery = Registration::query();

        if (! empty($filters['workshop_id'])) {
            $summaryQuery->where(
                'workshop_id',
                $filters['workshop_id'],
            );
        }

        $summary = [
            'total' => (clone $summaryQuery)->count(),

            'confirmed' => (clone $summaryQuery)
                ->where('status', 'confirmed')
                ->count(),

            'waitlist' => (clone $summaryQuery)
                ->where('status', 'waitlist')
                ->count(),

            'cancelled' => (clone $summaryQuery)
                ->where('status', 'cancelled')
                ->count(),

            'rejected' => (clone $summaryQuery)
                ->where('status', 'rejected')
                ->count(),
        ];

        $workshops = Workshop::withTrashed()
            ->orderByDesc('workshop_date')
            ->get([
                'id',
                'title',
                'workshop_date',
                'status',
                'deleted_at',
            ])
            ->map(function (Workshop $workshop): array {
                return [
                    'id' => $workshop->id,

                    'title' => $workshop->title,

                    'date' => $workshop
                        ->workshop_date
                        ?->format('Y-m-d'),

                    'status' => $workshop->status,

                    'trashed' => $workshop->trashed(),
                ];
            })
            ->values();

        return response()->json([
            'data' => collect($paginator->items())
                ->map(
                    fn (Registration $registration): array =>
                        $this->transform($registration),
                )
                ->values(),

            'summary' => $summary,

            'workshops' => $workshops,

            'statuses' => self::STATUSES,

            'meta' => [
                'current_page' =>
                    $paginator->currentPage(),

                'last_page' =>
                    $paginator->lastPage(),

                'per_page' =>
                    $paginator->perPage(),

                'total' =>
                    $paginator->total(),

                'from' =>
                    $paginator->firstItem(),

                'to' =>
                    $paginator->lastItem(),
            ],
        ]);
    }

    /**
     * Display one registration.
     */
    public function show(
        Registration $registration,
    ): JsonResponse {
        $registration->load('workshop');

        return response()->json([
            'data' =>
                $this->transform($registration),
        ]);
    }

    /**
     * Change registration status.
     */
    public function updateStatus(
        Request $request,
        Registration $registration,
    ): JsonResponse {
        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in(self::STATUSES),
            ],
        ]);

        $updatedRegistration = DB::transaction(
            function () use (
                $registration,
                $validated,
            ): Registration {
                $lockedRegistration =
                    Registration::query()
                        ->lockForUpdate()
                        ->findOrFail(
                            $registration->id,
                        );

                $workshop = Workshop::withTrashed()
                    ->lockForUpdate()
                    ->findOrFail(
                        $lockedRegistration
                            ->workshop_id,
                    );

                $newStatus =
                    $validated['status'];

                /*
                 * Before confirming a waitlisted or
                 * cancelled registration, check capacity.
                 */
                if (
                    $newStatus === 'confirmed'
                    && $lockedRegistration->status
                        !== 'confirmed'
                ) {
                    $confirmedCount =
                        Registration::query()
                            ->where(
                                'workshop_id',
                                $workshop->id,
                            )
                            ->where(
                                'status',
                                'confirmed',
                            )
                            ->count();

                    if (
                        $confirmedCount
                        >= $workshop->capacity
                    ) {
                        throw ValidationException::
                            withMessages([
                                'status' => [
                                    'This workshop is full. Remove or cancel another confirmed registration before confirming this participant.',
                                ],
                            ]);
                    }
                }

                $lockedRegistration->update([
                    'status' => $newStatus,
                ]);

                /*
                 * Recalculate available seats.
                 */
                $confirmedCount =
                    Registration::query()
                        ->where(
                            'workshop_id',
                            $workshop->id,
                        )
                        ->where(
                            'status',
                            'confirmed',
                        )
                        ->count();

                if (
                    ! $workshop->trashed()
                    && in_array(
                        $workshop->status,
                        [
                            'registration_open',
                            'full',
                        ],
                        true,
                    )
                ) {
                    if (
                        $confirmedCount
                        >= $workshop->capacity
                    ) {
                        $workshop->update([
                            'status' => 'full',
                        ]);
                    } elseif (
                        $workshop->status === 'full'
                    ) {
                        $workshop->update([
                            'status' =>
                                'registration_open',
                        ]);
                    }
                }

                return $lockedRegistration
                    ->fresh('workshop');
            },
            3,
        );

        return response()->json([
            'message' =>
                'Registration status updated successfully.',

            'data' =>
                $this->transform(
                    $updatedRegistration,
                ),
        ]);
    }

    /**
     * Export registrations as CSV.
     */
    public function export(
        Request $request,
    ): StreamedResponse {
        $filters = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'nullable',
                Rule::in(self::STATUSES),
            ],

            'workshop_id' => [
                'nullable',
                'integer',
                'exists:workshops,id',
            ],
        ]);

        $query = Registration::query()
            ->with('workshop');

        $this->applyFilters($query, $filters);

        $filename = 'registrations-'
            .now()->format('Y-m-d-His')
            .'.csv';

        return response()->streamDownload(
            function () use ($query): void {
                $handle = fopen(
                    'php://output',
                    'w',
                );

                /*
                 * UTF-8 BOM for Excel.
                 */
                fwrite(
                    $handle,
                    "\xEF\xBB\xBF",
                );

                fputcsv($handle, [
                    'Reference',
                    'Full Name',
                    'Mobile Number',
                    'WhatsApp Number',
                    'Email',
                    'District',
                    'Age',
                    'Occupation',
                    'Trading Experience',
                    'Binance Account',
                    'Lead Source',
                    'Status',
                    'Workshop',
                    'Workshop Date',
                    'Registered At',
                ]);

                $query
                    ->orderBy('id')
                    ->chunkById(
                        500,
                        function (
                            $registrations,
                        ) use ($handle): void {
                            foreach (
                                $registrations
                                as $registration
                            ) {
                                fputcsv($handle, [
                                    $registration
                                        ->reference_number,

                                    $registration
                                        ->full_name,

                                    $registration
                                        ->mobile_number,

                                    $registration
                                        ->whatsapp_number,

                                    $registration
                                        ->email,

                                    $registration
                                        ->district,

                                    $registration
                                        ->age,

                                    $registration
                                        ->occupation,

                                    $registration
                                        ->trading_experience
                                        ? 'Yes'
                                        : 'No',

                                    $registration
                                        ->binance_account
                                        ? 'Yes'
                                        : 'No',

                                    $registration
                                        ->lead_source,

                                    $registration
                                        ->status,

                                    $registration
                                        ->workshop
                                        ?->title,

                                    $registration
                                        ->workshop
                                        ?->workshop_date
                                        ?->format(
                                            'Y-m-d',
                                        ),

                                    $registration
                                        ->created_at
                                        ?->format(
                                            'Y-m-d H:i:s',
                                        ),
                                ]);
                            }
                        },
                    );

                fclose($handle);
            },
            $filename,
            [
                'Content-Type' =>
                    'text/csv; charset=UTF-8',
            ],
        );
    }

    /**
     * Apply search and filters.
     */
    private function applyFilters(
        Builder $query,
        array $filters,
    ): void {
        if (! empty($filters['search'])) {
            $search = trim(
                $filters['search'],
            );

            $query->where(
                function (
                    Builder $builder,
                ) use ($search): void {
                    $builder
                        ->where(
                            'full_name',
                            'like',
                            "%{$search}%",
                        )
                        ->orWhere(
                            'reference_number',
                            'like',
                            "%{$search}%",
                        )
                        ->orWhere(
                            'mobile_number',
                            'like',
                            "%{$search}%",
                        )
                        ->orWhere(
                            'whatsapp_number',
                            'like',
                            "%{$search}%",
                        )
                        ->orWhere(
                            'email',
                            'like',
                            "%{$search}%",
                        )
                        ->orWhere(
                            'district',
                            'like',
                            "%{$search}%",
                        );
                },
            );
        }

        if (! empty($filters['status'])) {
            $query->where(
                'status',
                $filters['status'],
            );
        }

        if (! empty($filters['workshop_id'])) {
            $query->where(
                'workshop_id',
                $filters['workshop_id'],
            );
        }
    }

    /**
     * Format registration API data.
     */
    private function transform(
        Registration $registration,
    ): array {
        return [
            'id' =>
                $registration->id,

            'reference_number' =>
                $registration->reference_number,

            'full_name' =>
                $registration->full_name,

            'mobile_number' =>
                $registration->mobile_number,

            'whatsapp_number' =>
                $registration->whatsapp_number,

            'email' =>
                $registration->email,

            'district' =>
                $registration->district,

            'age' =>
                $registration->age,

            'occupation' =>
                $registration->occupation,

            'trading_experience' =>
                $registration
                    ->trading_experience,

            'binance_account' =>
                $registration
                    ->binance_account,

            'lead_source' =>
                $registration->lead_source,

            'status' =>
                $registration->status,

            'consent_at' =>
                $registration
                    ->consent_at
                    ?->toIso8601String(),

            'utm_source' =>
                $registration->utm_source,

            'utm_medium' =>
                $registration->utm_medium,

            'utm_campaign' =>
                $registration->utm_campaign,

            'created_at' =>
                $registration
                    ->created_at
                    ?->toIso8601String(),

            'updated_at' =>
                $registration
                    ->updated_at
                    ?->toIso8601String(),

            'workshop' =>
                $registration->workshop
                    ? [
                        'id' =>
                            $registration
                                ->workshop
                                ->id,

                        'title' =>
                            $registration
                                ->workshop
                                ->title,

                        'date' =>
                            $registration
                                ->workshop
                                ->workshop_date
                                ?->format(
                                    'Y-m-d',
                                ),

                        'venue' =>
                            $registration
                                ->workshop
                                ->venue,

                        'city' =>
                            $registration
                                ->workshop
                                ->city,

                        'capacity' =>
                            $registration
                                ->workshop
                                ->capacity,

                        'status' =>
                            $registration
                                ->workshop
                                ->status,
                    ]
                    : null,
        ];
    }
}