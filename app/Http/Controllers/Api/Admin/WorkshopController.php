<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use App\Models\Workshop;
use App\Models\WorkshopLocation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Throwable;


class WorkshopController extends Controller
{
    private const STATUSES = [
        'draft',
        'registration_open',
        'full',
        'registration_closed',
        'completed',
        'cancelled',
        'archived',
    ];

 public function index(
    Request $request,
): JsonResponse {
    $query = Workshop::query()
        ->with([
            'locations' => function (
                $locationQuery,
            ): void {
                $locationQuery
                    ->with([
                        'trainers' => function (
                            $trainerQuery,
                        ): void {
                            $trainerQuery
                                ->orderBy(
                                    'display_order',
                                )
                                ->orderBy(
                                    'name',
                                );
                        },
                    ])
                    ->orderBy(
                        'display_order',
                    );
            },
        ]);

    if ($request->filled('search')) {
        $search = trim(
            $request
                ->string('search')
                ->toString(),
        );

        $query->where(
            function (
                Builder $builder,
            ) use (
                $search,
            ): void {
                $builder
                    ->where(
                        'title',
                        'like',
                        "%{$search}%",
                    )
                    ->orWhereHas(
                        'locations',
                        function (
                            Builder $locationQuery,
                        ) use (
                            $search,
                        ): void {
                            $locationQuery
                                ->where(
                                    'city',
                                    'like',
                                    "%{$search}%",
                                )
                                ->orWhere(
                                    'district',
                                    'like',
                                    "%{$search}%",
                                )
                                ->orWhere(
                                    'venue',
                                    'like',
                                    "%{$search}%",
                                );
                        },
                    )
                    ->orWhereHas(
                        'locations.trainers',
                        function (
                            Builder $trainerQuery,
                        ) use (
                            $search,
                        ): void {
                            $trainerQuery
                                ->where(
                                    'name',
                                    'like',
                                    "%{$search}%",
                                );
                        },
                    );
            },
        );
    }

    if ($request->filled('status')) {
        $query->where(
            'status',
            $request
                ->string('status')
                ->toString(),
        );
    }

    $paginator = $query
        ->orderByDesc(
            'workshop_date',
        )
        ->orderByDesc('id')
        ->paginate(10);

    return response()->json([
        'data' => collect(
            $paginator->items(),
        )
            ->map(
                fn (
                    Workshop $workshop,
                ): array =>
                    $this->transform(
                        $workshop,
                    ),
            )
            ->values(),

        'meta' => [
            'current_page' =>
                $paginator
                    ->currentPage(),

            'last_page' =>
                $paginator
                    ->lastPage(),

            'per_page' =>
                $paginator
                    ->perPage(),

            'total' =>
                $paginator->total(),

            'from' =>
                $paginator
                    ->firstItem(),

            'to' =>
                $paginator
                    ->lastItem(),
        ],
    ]);
}

    public function store(
        Request $request,
    ): JsonResponse {
        $validated =
            $this->validateWorkshop(
                $request,
            );

        $locations =
            $validated['locations'];

        $data =
            $this->buildWorkshopData(
                $validated,
                $locations,
                $request,
            );

        $data['slug'] =
            $this->generateUniqueSlug(
                $validated['title'],
            );

        $newBannerPath = null;

        if ($request->hasFile('banner')) {
            $newBannerPath = $request
                ->file('banner')
                ->store(
                    'workshops',
                    'public',
                );

            $data['banner_path'] =
                $newBannerPath;
        }

        $workshop = null;

        try {
            DB::transaction(
                function () use (
                    &$workshop,
                    $data,
                    $locations,
                ): void {
                    if (
                        $data['is_featured']
                    ) {
                        Workshop::query()
                            ->update([
                                'is_featured' =>
                                    false,
                            ]);
                    }

                    $workshop =
                        Workshop::create(
                            $data,
                        );

                    $this->saveLocations(
                        $workshop,
                        $locations,
                    );
                },
            );
        } catch (Throwable $exception) {
            if ($newBannerPath) {
                Storage::disk('public')
                    ->delete(
                        $newBannerPath,
                    );
            }

            throw $exception;
        }

        $createdWorkshop =
            $this->loadWorkshopRelations(
                $workshop->fresh(),
            );

        return response()->json([
            'message' =>
                'Workshop created successfully.',

            'data' =>
                $this->transform(
                    $createdWorkshop,
                ),
        ], 201);
    }

    public function show(
    Workshop $workshop,
): JsonResponse {
    $workshop->load([
        'locations' => function (
            $locationQuery,
        ): void {
            $locationQuery
                ->with([
                    'trainers' => function (
                        $trainerQuery,
                    ): void {
                        $trainerQuery
                            ->orderBy(
                                'display_order',
                            )
                            ->orderBy(
                                'name',
                            );
                    },
                ])
                ->withCount(
                    'registrations',
                )
                ->orderBy(
                    'display_order',
                );
        },
    ]);

    return response()->json([
        'data' =>
            $this->transformWorkshopDetails(
                $workshop,
            ),
    ]);
}

    public function update(
        Request $request,
        Workshop $workshop,
    ): JsonResponse {
        $validated =
            $this->validateWorkshop(
                $request,
            );

        $locations =
            $validated['locations'];

        $this->validateLocationOwnership(
            $workshop,
            $locations,
        );

        $data =
            $this->buildWorkshopData(
                $validated,
                $locations,
                $request,
            );

        if (
            $workshop->title !==
            $validated['title']
        ) {
            $data['slug'] =
                $this->generateUniqueSlug(
                    $validated['title'],
                    $workshop->id,
                );
        }

        $oldBannerPath =
            $workshop->banner_path;

        $newBannerPath = null;

        if ($request->hasFile('banner')) {
            $newBannerPath = $request
                ->file('banner')
                ->store(
                    'workshops',
                    'public',
                );

            $data['banner_path'] =
                $newBannerPath;
        } elseif (
            $request->boolean(
                'remove_banner',
            )
        ) {
            $data['banner_path'] =
                null;
        }

        try {
            DB::transaction(
                function () use (
                    $workshop,
                    $data,
                    $locations,
                ): void {
                    if (
                        $data['is_featured']
                    ) {
                        Workshop::query()
                            ->where(
                                'id',
                                '!=',
                                $workshop->id,
                            )
                            ->update([
                                'is_featured' =>
                                    false,
                            ]);
                    }

                    $workshop->update(
                        $data,
                    );

                    $this->saveLocations(
                        $workshop,
                        $locations,
                        deleteMissing:
                            true,
                    );
                },
            );
        } catch (Throwable $exception) {
            if ($newBannerPath) {
                Storage::disk('public')
                    ->delete(
                        $newBannerPath,
                    );
            }

            throw $exception;
        }

        $updatedWorkshop =
            $workshop->fresh();

        if (
            $oldBannerPath &&
            $oldBannerPath !==
                $updatedWorkshop
                    ->banner_path
        ) {
            Storage::disk('public')
                ->delete(
                    $oldBannerPath,
                );
        }

        $updatedWorkshop =
            $this->loadWorkshopRelations(
                $updatedWorkshop,
            );

        return response()->json([
            'message' =>
                'Workshop updated successfully.',

            'data' =>
                $this->transform(
                    $updatedWorkshop,
                ),
        ]);
    }

    public function destroy(
        Workshop $workshop,
    ): JsonResponse {
        $workshop->delete();

        return response()->json([
            'message' =>
                'Workshop moved to trash successfully.',
        ]);
    }

    public function duplicate(
        Workshop $workshop,
    ): JsonResponse {
        $workshop =
            $this->loadWorkshopRelations(
                $workshop,
            );

        $copy =
            $workshop->replicate();

        $copy->title =
            "{$workshop->title} Copy";

        $copy->slug =
            $this->generateUniqueSlug(
                $copy->title,
            );

        $copy->status = 'draft';
        $copy->is_featured = false;
        $copy->banner_path = null;

        DB::transaction(
            function () use (
                $copy,
                $workshop,
            ): void {
                $copy->save();

                foreach (
                    $workshop->locations
                    as $location
                ) {
                    $locationCopy =
                        $location
                            ->replicate();

                    $locationCopy
                        ->workshop_id =
                        $copy->id;

                    $locationCopy->save();

                    $locationCopy
                        ->trainers()
                        ->sync(
                            $location
                                ->trainers
                                ->pluck('id')
                                ->all(),
                        );
                }
            },
        );

        $copy =
            $this->loadWorkshopRelations(
                $copy->fresh(),
            );

        return response()->json([
            'message' =>
                'Workshop duplicated successfully.',

            'data' =>
                $this->transform(
                    $copy,
                ),
        ], 201);
    }

    public function archive(
        Workshop $workshop,
    ): JsonResponse {
        $workshop->update([
            'status' => 'archived',
            'is_featured' => false,
        ]);

        $workshop =
            $this->loadWorkshopRelations(
                $workshop->fresh(),
            );

        return response()->json([
            'message' =>
                'Workshop archived successfully.',

            'data' =>
                $this->transform(
                    $workshop,
                ),
        ]);
    }

    private function validateWorkshop(
        Request $request,
    ): array {
        $validated =
            $request->validate([
                'title' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'description' => [
                    'nullable',
                    'string',
                ],

                'workshop_date' => [
                    'required',
                    'date',
                ],

                'start_time' => [
                    'required',
                    'date_format:H:i',
                ],

                'end_time' => [
                    'required',
                    'date_format:H:i',
                    'after:start_time',
                ],

                'arrival_time' => [
                    'nullable',
                    'date_format:H:i',
                ],

                'registration_open_at' => [
                    'nullable',
                    'date',
                ],

                'registration_close_at' => [
                    'nullable',
                    'date',
                    'after_or_equal:registration_open_at',
                ],

                'status' => [
                    'required',
                    Rule::in(
                        self::STATUSES,
                    ),
                ],

                'is_featured' => [
                    'nullable',
                    'boolean',
                ],

                'remove_banner' => [
                    'nullable',
                    'boolean',
                ],

                'banner' => [
                    'nullable',
                    'image',
                    'mimes:jpg,jpeg,png,webp',
                    'max:5120',
                ],

                'locations' => [
                    'required',
                    'array',
                    'min:1',
                ],

                'locations.*.id' => [
                    'nullable',
                    'integer',
                    'distinct',
                ],

                'locations.*.district' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'locations.*.city' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'locations.*.venue' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'locations.*.map_url' => [
                    'nullable',
                    'url',
                    'max:1000',
                ],

                'locations.*.capacity' => [
                    'required',
                    'integer',
                    'min:1',
                    'max:10000',
                ],

                'locations.*.whatsapp_group_url' => [
                    'nullable',
                    'url',
                    'max:1000',
                ],

                'locations.*.trainer_ids' => [
                    'required',
                    'array',
                    'min:1',
                ],

                'locations.*.trainer_ids.*' => [
                    'required',
                    'integer',
                    'distinct',

                    Rule::exists(
                        'trainers',
                        'id',
                    )->where(
                        fn ($query) =>
                            $query
                                ->whereNull(
                                    'deleted_at',
                                )
                                ->where(
                                    'is_active',
                                    true,
                                ),
                    ),
                ],
            ]);

        if (
            ! empty(
                $validated[
                    'arrival_time'
                ]
            ) &&
            $validated['arrival_time'] >
                $validated['start_time']
        ) {
            throw ValidationException::withMessages([
                'arrival_time' => [
                    'Arrival time must be before or equal to the workshop start time.',
                ],
            ]);
        }

        $trainerLocations = [];

        foreach (
            $validated['locations']
            as $locationIndex =>
                $location
        ) {
            $locationLabel =
                trim(
                    $location['city'],
                ) !== ''
                    ? $location['city']
                    : 'Location '.
                        ($locationIndex +
                            1);

            foreach (
                $location['trainer_ids']
                as $trainerId
            ) {
                $numericTrainerId =
                    (int) $trainerId;

                if (
                    isset(
                        $trainerLocations[
                            $numericTrainerId
                        ],
                    )
                ) {
                    throw ValidationException::withMessages([
                        "locations.{$locationIndex}.trainer_ids" => [
                            "The selected trainer is already assigned to {$trainerLocations[$numericTrainerId]}. Because every location runs at the same time, one trainer cannot be assigned to two locations.",
                        ],
                    ]);
                }

                $trainerLocations[
                    $numericTrainerId
                ] = $locationLabel;
            }
        }

        return $validated;
    }

    private function buildWorkshopData(
        array $validated,
        array $locations,
        Request $request,
    ): array {
        $firstLocation =
            $locations[0];

        $trainerIds =
            collect($locations)
                ->pluck('trainer_ids')
                ->flatten()
                ->map(
                    fn (
                        mixed $trainerId,
                    ): int =>
                        (int) $trainerId,
                )
                ->unique()
                ->values();

        $presenter =
            Trainer::query()
                ->whereIn(
                    'id',
                    $trainerIds,
                )
                ->orderBy('name')
                ->pluck('name')
                ->join(', ');

        return [
            'title' =>
                $validated['title'],

            'presenter' =>
                $presenter,

            'description' =>
                $validated[
                    'description'
                ] ?? null,

            'workshop_date' =>
                $validated[
                    'workshop_date'
                ],

            'start_time' =>
                $validated[
                    'start_time'
                ],

            'end_time' =>
                $validated[
                    'end_time'
                ],

            'arrival_time' =>
                $validated[
                    'arrival_time'
                ] ?? null,

            'registration_open_at' =>
                $validated[
                    'registration_open_at'
                ] ?? null,

            'registration_close_at' =>
                $validated[
                    'registration_close_at'
                ] ?? null,

            'status' =>
                $validated['status'],

            'is_featured' =>
                $request->boolean(
                    'is_featured',
                ),

            /*
             * Legacy values copied from
             * the first location.
             */
            'district' =>
                $firstLocation[
                    'district'
                ],

            'city' =>
                $firstLocation['city'],

            'venue' =>
                $firstLocation['venue'],

            'map_url' =>
                $firstLocation[
                    'map_url'
                ] ?? null,

            'capacity' =>
                collect($locations)
                    ->sum(
                        fn (
                            array $location,
                        ): int =>
                            (int) $location[
                                'capacity'
                            ],
                    ),

            'whatsapp_group_url' =>
                $firstLocation[
                    'whatsapp_group_url'
                ] ?? null,
        ];
    }

    private function saveLocations(
        Workshop $workshop,
        array $locations,
        bool $deleteMissing = false,
    ): void {
        $keptLocationIds = [];

        foreach (
            $locations
            as $index => $payload
        ) {
            $locationId =
                isset($payload['id'])
                    ? (int) $payload['id']
                    : null;

            $locationData = [
                'district' =>
                    $payload[
                        'district'
                    ],

                'city' =>
                    $payload['city'],

                'venue' =>
                    $payload['venue'],

                'map_url' =>
                    $payload[
                        'map_url'
                    ] ?? null,

                'capacity' =>
                    (int) $payload[
                        'capacity'
                    ],

                'whatsapp_group_url' =>
                    $payload[
                        'whatsapp_group_url'
                    ] ?? null,

                'display_order' =>
                    $index + 1,
            ];

            if ($locationId) {
                $location =
                    $workshop
                        ->locations()
                        ->whereKey(
                            $locationId,
                        )
                        ->firstOrFail();

                $location->update(
                    $locationData,
                );
            } else {
                $location =
                    $workshop
                        ->locations()
                        ->create(
                            $locationData,
                        );
            }

            $location
                ->trainers()
                ->sync(
                    collect(
                        $payload[
                            'trainer_ids'
                        ],
                    )
                        ->map(
                            fn (
                                mixed $trainerId,
                            ): int =>
                                (int) $trainerId,
                        )
                        ->unique()
                        ->values()
                        ->all(),
                );

            $keptLocationIds[] =
                $location->id;
        }

        if ($deleteMissing) {
            $workshop
                ->locations()
                ->whereNotIn(
                    'id',
                    $keptLocationIds,
                )
                ->get()
                ->each(
                    fn (
                        WorkshopLocation $location,
                    ) =>
                        $location->delete(),
                );
        }
    }

    private function validateLocationOwnership(
        Workshop $workshop,
        array $locations,
    ): void {
        $submittedIds =
            collect($locations)
                ->pluck('id')
                ->filter()
                ->map(
                    fn (
                        mixed $id,
                    ): int =>
                        (int) $id,
                )
                ->unique()
                ->values();

        if ($submittedIds->isEmpty()) {
            return;
        }

        $ownedIds =
            $workshop
                ->locations()
                ->whereIn(
                    'id',
                    $submittedIds,
                )
                ->pluck('id')
                ->map(
                    fn (
                        mixed $id,
                    ): int =>
                        (int) $id,
                )
                ->sort()
                ->values();

        if (
            $ownedIds->all() !==
            $submittedIds
                ->sort()
                ->values()
                ->all()
        ) {
            throw ValidationException::withMessages([
                'locations' => [
                    'One or more locations do not belong to this workshop.',
                ],
            ]);
        }
    }

 private function loadWorkshopRelations(
    Workshop $workshop,
): Workshop {
    $workshop->load([
        'locations' => function (
            $locationQuery,
        ): void {
            $locationQuery
                ->with([
                    'trainers' => function (
                        $trainerQuery,
                    ): void {
                        $trainerQuery
                            ->orderBy(
                                'display_order',
                            )
                            ->orderBy(
                                'name',
                            );
                    },
                ])
                ->withCount([
                    'registrations as occupied_seats' =>
                        function (
                            $registrationQuery,
                        ): void {
                            $registrationQuery
                                ->whereNotIn(
                                    'status',
                                    [
                                        'cancelled',
                                        'rejected',
                                    ],
                                );
                        },
                ])
                ->orderBy(
                    'display_order',
                );
        },
    ]);

    return $workshop;
}
    private function transform(
        Workshop $workshop,
    ): array {
        $locations =
            $workshop->locations
                ->sortBy(
                    'display_order',
                )
                ->values();

        return [
            'id' => $workshop->id,

            'title' =>
                $workshop->title,

            'slug' =>
                $workshop->slug,

            'presenter' =>
                $workshop->presenter,

            'description' =>
                $workshop->description,

            'workshop_date' =>
                $workshop
                    ->workshop_date
                    ?->format(
                        'Y-m-d',
                    ),

            'start_time' =>
                $this->formatTime(
                    $workshop
                        ->start_time,
                ),

            'end_time' =>
                $this->formatTime(
                    $workshop
                        ->end_time,
                ),

            'arrival_time' =>
                $this->formatTime(
                    $workshop
                        ->arrival_time,
                ),

            'registration_open_at' =>
                $workshop
                    ->registration_open_at
                    ?->format(
                        'Y-m-d\TH:i',
                    ),

            'registration_close_at' =>
                $workshop
                    ->registration_close_at
                    ?->format(
                        'Y-m-d\TH:i',
                    ),

            'status' =>
                $workshop->status,

            'is_featured' =>
                (bool) $workshop
                    ->is_featured,

            'banner_path' =>
                $workshop
                    ->banner_path,

            'banner_url' =>
                $workshop
                    ->banner_path
                    ? asset(
                        'storage/'.
                        ltrim(
                            $workshop
                                ->banner_path,
                            '/',
                        ),
                    )
                    : null,

            'location_count' =>
                $locations->count(),

            'total_capacity' =>
                $locations->sum(
                    fn (
                        WorkshopLocation $location,
                    ): int =>
                        (int) $location
                            ->capacity,
                ),

            /*
             * Legacy values for old UI.
             */
            'district' =>
                $locations
                    ->first()
                    ?->district,

            'city' =>
                $locations
                    ->first()
                    ?->city,

            'venue' =>
                $locations
                    ->first()
                    ?->venue,

            'capacity' =>
                $locations->sum(
                    fn (
                        WorkshopLocation $location,
                    ): int =>
                        (int) $location
                            ->capacity,
                ),

            'locations' =>
                $locations
                    ->map(
                        function (
                            WorkshopLocation $location,
                        ): array {
                            $occupiedSeats =
                                (int) (
                                    $location
                                        ->occupied_seats ??
                                    0
                                );

                            $availableSeats =
                                max(
                                    0,
                                    (int) $location
                                        ->capacity -
                                        $occupiedSeats,
                                );

                            return [
                                'id' =>
                                    $location
                                        ->id,

                                'district' =>
                                    $location
                                        ->district,

                                'city' =>
                                    $location
                                        ->city,

                                'venue' =>
                                    $location
                                        ->venue,

                                'map_url' =>
                                    $location
                                        ->map_url,

                                'capacity' =>
                                    (int) $location
                                        ->capacity,

                                'occupied_seats' =>
                                    $occupiedSeats,

                                'available_seats' =>
                                    $availableSeats,

                                'whatsapp_group_url' =>
                                    $location
                                        ->whatsapp_group_url,

                                'display_order' =>
                                    (int) $location
                                        ->display_order,

                                'trainer_ids' =>
                                    $location
                                        ->trainers
                                        ->pluck(
                                            'id',
                                        )
                                        ->map(
                                            fn (
                                                mixed $id,
                                            ): int =>
                                                (int) $id,
                                        )
                                        ->values()
                                        ->all(),

                                'trainers' =>
                                    $location
                                        ->trainers
                                        ->map(
                                            function (
                                                Trainer $trainer,
                                            ): array {
                                                return [
                                                    'id' =>
                                                        $trainer
                                                            ->id,

                                                    'name' =>
                                                        $trainer
                                                            ->name,

                                                    'role' =>
                                                        $trainer
                                                            ->role,

                                                    'photo_path' =>
                                                        $trainer
                                                            ->photo_path,

                                                    'photo_url' =>
                                                        $trainer
                                                            ->photo_path
                                                            ? asset(
                                                                'storage/'.
                                                                ltrim(
                                                                    $trainer
                                                                        ->photo_path,
                                                                    '/',
                                                                ),
                                                            )
                                                            : null,
                                                ];
                                            },
                                        )
                                        ->values()
                                        ->all(),
                            ];
                        },
                    )
                    ->values()
                    ->all(),

            'created_at' =>
                $workshop
                    ->created_at
                    ?->toIso8601String(),

            'updated_at' =>
                $workshop
                    ->updated_at
                    ?->toIso8601String(),
        ];
    }

    private function generateUniqueSlug(
        string $title,
        ?int $ignoreId = null,
    ): string {
        $baseSlug =
            Str::slug($title);

        if ($baseSlug === '') {
            $baseSlug = 'workshop';
        }

        $slug = $baseSlug;
        $counter = 2;

        while (true) {
            $query =
                Workshop::withTrashed()
                    ->where(
                        'slug',
                        $slug,
                    );

            if ($ignoreId !== null) {
                $query->where(
                    'id',
                    '!=',
                    $ignoreId,
                );
            }

            if (! $query->exists()) {
                return $slug;
            }

            $slug =
                "{$baseSlug}-{$counter}";

            $counter++;
        }
    }

    private function formatTime(
        ?string $time,
    ): ?string {
        if (! $time) {
            return null;
        }

        return substr(
            $time,
            0,
            5,
        );
    }

    private function transformWorkshopDetails(
    Workshop $workshop,
): array {
    $locations =
        $workshop->locations
            ->sortBy(
                'display_order',
            )
            ->values();

    $allTrainers =
        $locations
            ->flatMap(
                fn (
                    WorkshopLocation $location,
                ) =>
                    $location->trainers,
            )
            ->unique('id')
            ->values();

    return [
        'id' =>
            $workshop->id,

        'title' =>
            $workshop->title,

        'slug' =>
            $workshop->slug,

        'description' =>
            $workshop->description,

        'presenter' =>
            $workshop->presenter,

        'workshop_date' =>
            $workshop
                ->workshop_date
                ?->format('Y-m-d'),

        'start_time' =>
            $this->formatTime(
                $workshop->start_time,
            ),

        'end_time' =>
            $this->formatTime(
                $workshop->end_time,
            ),

        'arrival_time' =>
            $this->formatTime(
                $workshop->arrival_time,
            ),

        'registration_open_at' =>
            $workshop
                ->registration_open_at
                ?->format(
                    'Y-m-d\TH:i',
                ),

        'registration_close_at' =>
            $workshop
                ->registration_close_at
                ?->format(
                    'Y-m-d\TH:i',
                ),

        'status' =>
            $workshop->status,

        'is_featured' =>
            (bool) $workshop
                ->is_featured,

        'banner_path' =>
            $workshop->banner_path,

        'banner_url' =>
            $workshop->banner_path
                ? asset(
                    'storage/'.
                    ltrim(
                        $workshop
                            ->banner_path,
                        '/',
                    ),
                )
                : null,

        'location_count' =>
            $locations->count(),

        'total_capacity' =>
            $locations->sum(
                fn (
                    WorkshopLocation $location,
                ): int =>
                    (int) $location
                        ->capacity,
            ),

        'trainer_count' =>
            $allTrainers->count(),

        'trainers' =>
            $allTrainers
                ->map(
                    function (
                        Trainer $trainer,
                    ): array {
                        return [
                            'id' =>
                                $trainer->id,

                            'name' =>
                                $trainer->name,

                            'role' =>
                                $trainer->role,

                            'bio' =>
                                $trainer->bio,

                            'photo_path' =>
                                $trainer
                                    ->photo_path,

                            'photo_url' =>
                                $trainer
                                    ->photo_path
                                    ? asset(
                                        'storage/'.
                                        ltrim(
                                            $trainer
                                                ->photo_path,
                                            '/',
                                        ),
                                    )
                                    : null,
                        ];
                    },
                )
                ->all(),

        'locations' =>
            $locations
                ->map(
                    function (
                        WorkshopLocation $location,
                    ): array {
                        $registeredCount =
                            (int) (
                                $location
                                    ->registrations_count ??
                                0
                            );

                        $availableSeats =
                            max(
                                0,
                                (int) $location
                                    ->capacity -
                                    $registeredCount,
                            );

                        return [
                            'id' =>
                                $location->id,

                            'district' =>
                                $location
                                    ->district,

                            'city' =>
                                $location->city,

                            'venue' =>
                                $location
                                    ->venue,

                            'map_url' =>
                                $location
                                    ->map_url,

                            'capacity' =>
                                (int) $location
                                    ->capacity,

                            'registered_count' =>
                                $registeredCount,

                            'available_seats' =>
                                $availableSeats,

                            'whatsapp_group_url' =>
                                $location
                                    ->whatsapp_group_url,

                            'display_order' =>
                                (int) $location
                                    ->display_order,

                            'trainers' =>
                                $location
                                    ->trainers
                                    ->map(
                                        function (
                                            Trainer $trainer,
                                        ): array {
                                            return [
                                                'id' =>
                                                    $trainer
                                                        ->id,

                                                'name' =>
                                                    $trainer
                                                        ->name,

                                                'role' =>
                                                    $trainer
                                                        ->role,

                                                'bio' =>
                                                    $trainer
                                                        ->bio,

                                                'photo_path' =>
                                                    $trainer
                                                        ->photo_path,

                                                'photo_url' =>
                                                    $trainer
                                                        ->photo_path
                                                        ? asset(
                                                            'storage/'.
                                                            ltrim(
                                                                $trainer
                                                                    ->photo_path,
                                                                '/',
                                                            ),
                                                        )
                                                        : null,
                                            ];
                                        },
                                    )
                                    ->values()
                                    ->all(),
                        ];
                    },
                )
                ->all(),

        'created_at' =>
            $workshop
                ->created_at
                ?->toIso8601String(),

        'updated_at' =>
            $workshop
                ->updated_at
                ?->toIso8601String(),
    ];
}
}