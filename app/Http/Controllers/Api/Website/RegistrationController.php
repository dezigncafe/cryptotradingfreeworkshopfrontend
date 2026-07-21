<?php

namespace App\Http\Controllers\Api\Website;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use App\Models\Workshop;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class RegistrationController extends Controller
{
    public function store(
        Request $request,
    ): JsonResponse {
        $validated = $request->validate([
            'workshop_id' => [
                'required',
                'integer',
                'exists:workshops,id',
            ],

            'full_name' => [
                'required',
                'string',
                'max:255',
            ],

            'mobile_number' => [
                'required',
                'string',
                'max:30',
            ],

            'whatsapp_number' => [
                'nullable',
                'string',
                'max:30',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'district' => [
                'required',
                'string',
                'max:100',
            ],

            'age' => [
                'required',
                'integer',
                'min:13',
                'max:100',
            ],

            'occupation' => [
                'nullable',
                'string',
                'max:255',
            ],

            'trading_experience' => [
                'required',
                'boolean',
            ],

            'binance_account' => [
                'required',
                'boolean',
            ],

            'lead_source' => [
                'required',
                Rule::in([
                    'TikTok',
                    'Facebook',
                    'Instagram',
                    'YouTube',
                    'WhatsApp',
                    'Friend',
                    'Other',
                ]),
            ],

            'consent' => [
                'accepted',
            ],

            'utm_source' => [
                'nullable',
                'string',
                'max:255',
            ],

            'utm_medium' => [
                'nullable',
                'string',
                'max:255',
            ],

            'utm_campaign' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $mobileNumber = $this->normalizeMobile(
    $validated['mobile_number'],
    'mobile_number',
);

$whatsappNumber = empty(
    $validated['whatsapp_number']
)
    ? null
    : $this->normalizeMobile(
        $validated['whatsapp_number'],
        'whatsapp_number',
    );
        return DB::transaction(
            function () use (
                $validated,
                $mobileNumber,
                $whatsappNumber,
            ): JsonResponse {
                $workshop = Workshop::query()
                    ->lockForUpdate()
                    ->findOrFail(
                        $validated['workshop_id'],
                    );

                if (
                    ! in_array(
                        $workshop->status,
                        [
                            'registration_open',
                            'full',
                        ],
                        true,
                    )
                ) {
                    throw ValidationException::withMessages([
                        'workshop_id' => [
                            'Registration is currently closed for this workshop.',
                        ],
                    ]);
                }

                if (
                    $workshop->registration_open_at
                    && now()->lt(
                        $workshop
                            ->registration_open_at,
                    )
                ) {
                    throw ValidationException::withMessages([
                        'workshop_id' => [
                            'Registration has not opened yet.',
                        ],
                    ]);
                }

                if (
                    $workshop->registration_close_at
                    && now()->gt(
                        $workshop
                            ->registration_close_at,
                    )
                ) {
                    throw ValidationException::withMessages([
                        'workshop_id' => [
                            'Registration has already closed.',
                        ],
                    ]);
                }

                $existingRegistration =
                    Registration::query()
                        ->where(
                            'workshop_id',
                            $workshop->id,
                        )
                        ->where(
                            'mobile_number',
                            $mobileNumber,
                        )
                        ->whereNotIn('status', [
                            'cancelled',
                            'rejected',
                        ])
                        ->first();

                if ($existingRegistration) {
                    throw ValidationException::withMessages([
                        'mobile_number' => [
                            'You are already registered. Reference: '
                            .$existingRegistration
                                ->reference_number,
                        ],
                    ]);
                }

                $confirmedCount = Registration::query()
                    ->where(
                        'workshop_id',
                        $workshop->id,
                    )
                    ->where(
                        'status',
                        'confirmed',
                    )
                    ->count();

                $hasAvailableSeat =
                    $workshop->status
                        === 'registration_open'
                    && $confirmedCount
                        < $workshop->capacity;

                $registrationStatus =
                    $hasAvailableSeat
                        ? 'confirmed'
                        : 'waitlist';

                $registration =
                    Registration::create([
                        'workshop_id' =>
                            $workshop->id,

                        'reference_number' =>
                            $this
                                ->generateReference(),

                        'full_name' =>
                            $validated['full_name'],

                        'mobile_number' =>
                            $mobileNumber,

                        'whatsapp_number' =>
                            $whatsappNumber,

                        'email' =>
                            $validated['email']
                            ?? null,

                        'district' =>
                            $validated['district'],

                        'age' =>
                            $validated['age'],

                        'occupation' =>
                            $validated['occupation']
                            ?? null,

                        'trading_experience' =>
                            $validated[
                                'trading_experience'
                            ],

                        'binance_account' =>
                            $validated[
                                'binance_account'
                            ],

                        'lead_source' =>
                            $validated[
                                'lead_source'
                            ],

                        'status' =>
                            $registrationStatus,

                        'consent_at' => now(),

                        'utm_source' =>
                            $validated['utm_source']
                            ?? null,

                        'utm_medium' =>
                            $validated['utm_medium']
                            ?? null,

                        'utm_campaign' =>
                            $validated[
                                'utm_campaign'
                            ]
                            ?? null,
                    ]);

                if (
                    $registrationStatus
                        === 'confirmed'
                    && $confirmedCount + 1
                        >= $workshop->capacity
                ) {
                    $workshop->update([
                        'status' => 'full',
                    ]);
                }

                return response()->json([
                    'message' =>
                        $registrationStatus
                            === 'confirmed'
                                ? 'Your seat has been reserved.'
                                : 'The workshop is full. You have been added to the waitlist.',

                    'data' => [
                        'id' =>
                            $registration->id,

                        'referenceNumber' =>
                            $registration
                                ->reference_number,

                        'status' =>
                            $registration->status,

                        'fullName' =>
                            $registration
                                ->full_name,

                        'workshopTitle' =>
                            $workshop->title,

                        'workshopDate' =>
                            $workshop
                                ->workshop_date
                                ->format(
                                    'F j, Y',
                                ),

                        'venue' =>
                            $workshop->venue,

                        'whatsappGroupUrl' =>
                            $workshop
                                ->whatsapp_group_url,
                    ],
                ], 201);
            },
            3,
        );
    }

    private function normalizeMobile(
        string $number,
        string $field,
    ): string {
        $digits = preg_replace(
            '/\D+/',
            '',
            $number,
        );

        if (
            strlen($digits) === 10
            && str_starts_with(
                $digits,
                '0',
            )
        ) {
            $digits = '94'.substr(
                $digits,
                1,
            );
        } elseif (
            strlen($digits) === 9
            && str_starts_with(
                $digits,
                '7',
            )
        ) {
            $digits = '94'.$digits;
        }

        if (
            ! preg_match(
                '/^947\d{8}$/',
                $digits,
            )
        ) {
            throw ValidationException::withMessages([
                $field => [
                    'Enter a valid Sri Lankan mobile number.',
                ],
            ]);
        }

        return $digits;
    }

    private function generateReference(): string
    {
        do {
            $reference = 'CTW-'
                .now()->format('ymd')
                .'-'
                .Str::upper(
                    Str::random(6),
                );
        } while (
            Registration::query()
                ->where(
                    'reference_number',
                    $reference,
                )
                ->exists()
        );

        return $reference;
    }
}