<?php

namespace App\Http\Controllers\Api\Website;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use App\Models\Workshop;
use App\Models\WorkshopLocation;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FeaturedWorkshopController extends Controller
{
    /**
     * Return all active workshops.
     *
     * The first workshop is also copied to the root of the
     * response for compatibility with existing homepage sections.
     * RegistrationSection.jsx uses data.workshops for its title tabs.
     */
    public function __invoke(): JsonResponse
    {
        $workshops = Workshop::query()
            ->whereNotIn('status', [
                'draft',
                'archived',
                'cancelled',
                'completed',
            ])
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
                                    ->orderBy('name');
                            },
                        ])
                        ->withCount([
                            'registrations as confirmed_registrations_count' =>
                                function (
                                    $registrationQuery,
                                ): void {
                                    $registrationQuery
                                        ->where(
                                            'status',
                                            'confirmed',
                                        );
                                },
                        ])
                        ->orderBy(
                            'display_order',
                        )
                        ->orderBy('id');
                },
            ])
            ->orderByDesc('is_featured')
            ->orderBy('workshop_date')
            ->orderBy('start_time')
            ->orderBy('id')
            ->get();

        if ($workshops->isEmpty()) {
            return response()->json([
                'message' =>
                    'No workshop is currently available.',

                'data' => null,
            ], 404);
        }

        $workshopItems = $workshops
            ->map(
                fn (
                    Workshop $workshop,
                ): array =>
                    $this->transformWorkshop(
                        $workshop,
                    ),
            )
            ->values();

        /*
         * Keep old homepage components working by exposing the
         * first workshop fields at data.title, data.date, etc.
         *
         * The new registration component reads data.workshops.
         */
        $primaryWorkshop =
            $workshopItems->first();

        return response()->json([
            'data' => array_merge(
                $primaryWorkshop,
                [
                    'workshopCount' =>
                        $workshopItems
                            ->count(),

                    'workshop_count' =>
                        $workshopItems
                            ->count(),

                    'workshops' =>
                        $workshopItems
                            ->all(),
                ],
            ),
        ]);
    }

    /**
     * Convert one workshop and all of its locations
     * into the public API response format.
     */
    private function transformWorkshop(
        Workshop $workshop,
    ): array {
        $locations = $workshop
            ->locations
            ->map(
                function (
                    WorkshopLocation $location,
                ): array {
                    $capacity =
                        (int) $location
                            ->capacity;

                    $confirmedCount =
                        (int) (
                            $location
                                ->confirmed_registrations_count ??
                            0
                        );

                    $availableSeats =
                        max(
                            0,
                            $capacity -
                                $confirmedCount,
                        );

                    return [
                        'id' =>
                            $location->id,

                        'workshop_id' =>
                            $location
                                ->workshop_id,

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

                        'mapUrl' =>
                            $location
                                ->map_url,

                        'capacity' =>
                            $capacity,

                        'registered' =>
                            $confirmedCount,

                        'registered_count' =>
                            $confirmedCount,

                        'occupied_seats' =>
                            $confirmedCount,

                        'available_seats' =>
                            $availableSeats,

                        'availableSeats' =>
                            $availableSeats,

                        'seatsRemaining' =>
                            $availableSeats,

                        'whatsapp_group_url' =>
                            $location
                                ->whatsapp_group_url,

                        'whatsappGroupUrl' =>
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
                                        $photoUrl =
                                            $this
                                                ->publicStorageUrl(
                                                    $trainer
                                                        ->photo_path,
                                                );

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
                                                $photoUrl,

                                            'photoUrl' =>
                                                $photoUrl,
                                        ];
                                    },
                                )
                                ->values()
                                ->all(),
                    ];
                },
            )
            ->values();

        $allTrainers = $locations
            ->flatMap(
                fn (
                    array $location,
                ): array =>
                    $location[
                        'trainers'
                    ],
            )
            ->unique('id')
            ->values();

        $totalCapacity =
            (int) $locations->sum(
                'capacity',
            );

        $totalRegistered =
            (int) $locations->sum(
                'registered',
            );

        $totalSeatsRemaining =
            (int) $locations->sum(
                'available_seats',
            );

        $registrationHasOpened =
            ! $workshop
                ->registration_open_at ||
            now()->greaterThanOrEqualTo(
                $workshop
                    ->registration_open_at,
            );

        $registrationHasNotClosed =
            ! $workshop
                ->registration_close_at ||
            now()->lessThanOrEqualTo(
                $workshop
                    ->registration_close_at,
            );

        $acceptsRegistration =
            in_array(
                $workshop->status,
                [
                    'registration_open',
                    'full',
                ],
                true,
            );

        $canRegister =
            $acceptsRegistration &&
            $registrationHasOpened &&
            $registrationHasNotClosed &&
            $locations->isNotEmpty();

        $ctaLabel =
            $totalSeatsRemaining > 0 &&
            $workshop->status ===
                'registration_open'
                ? 'Reserve Your Seat'
                : 'Join Waitlist';

        if (! $canRegister) {
            $ctaLabel =
                'Registration Closed';
        }

        $firstLocation =
            $locations->first();

        $bannerUrl =
            $workshop->banner_path
                ? $this->publicStorageUrl(
                    $workshop
                        ->banner_path,
                )
                : url(
                    '/images/workshop-hero.jpg',
                );

        return [
            'id' =>
                $workshop->id,

            'title' =>
                $workshop->title,

            'slug' =>
                $workshop->slug,

            'presenter' =>
                $allTrainers
                    ->isNotEmpty()
                    ? $allTrainers
                        ->pluck('name')
                        ->join(', ')
                    : $workshop
                        ->presenter,

            'description' =>
                $workshop
                    ->description,

            'date' =>
                $workshop
                    ->workshop_date
                    ?->format(
                        'F j, Y',
                    ),

            'dateValue' =>
                $workshop
                    ->workshop_date
                    ?->format(
                        'Y-m-d',
                    ),

            'workshop_date' =>
                $workshop
                    ->workshop_date
                    ?->format(
                        'Y-m-d',
                    ),

            'day' =>
                $workshop
                    ->workshop_date
                    ?->format('l'),

            'startTime' =>
                $this->formatTime(
                    $workshop
                        ->start_time,
                ),

            'endTime' =>
                $this->formatTime(
                    $workshop
                        ->end_time,
                ),

            'arrivalTime' =>
                $this->formatTime(
                    $workshop
                        ->arrival_time,
                ),

            'start_time' =>
                $this->formatDatabaseTime(
                    $workshop
                        ->start_time,
                ),

            'end_time' =>
                $this->formatDatabaseTime(
                    $workshop
                        ->end_time,
                ),

            'arrival_time' =>
                $this->formatDatabaseTime(
                    $workshop
                        ->arrival_time,
                ),

            /*
             * Legacy first-location values.
             */
            'venue' =>
                data_get(
                    $firstLocation,
                    'venue',
                    $workshop->venue,
                ),

            'city' =>
                data_get(
                    $firstLocation,
                    'city',
                    $workshop->city,
                ),

            'district' =>
                data_get(
                    $firstLocation,
                    'district',
                    $workshop
                        ->district,
                ),

            'mapUrl' =>
                data_get(
                    $firstLocation,
                    'mapUrl',
                    $workshop
                        ->map_url,
                ),

            'map_url' =>
                data_get(
                    $firstLocation,
                    'map_url',
                    $workshop
                        ->map_url,
                ),

            'capacity' =>
                $totalCapacity > 0
                    ? $totalCapacity
                    : (int) $workshop
                        ->capacity,

            'registered' =>
                $totalRegistered,

            'seatsRemaining' =>
                $totalSeatsRemaining,

            'locationCount' =>
                $locations->count(),

            'location_count' =>
                $locations->count(),

            'totalCapacity' =>
                $totalCapacity,

            'total_capacity' =>
                $totalCapacity,

            'totalAvailableSeats' =>
                $totalSeatsRemaining,

            'total_available_seats' =>
                $totalSeatsRemaining,

            'trainerCount' =>
                $allTrainers->count(),

            'statusCode' =>
                $workshop->status,

            'status_code' =>
                $workshop->status,

            'status' =>
                Str::of(
                    $workshop
                        ->status,
                )
                    ->replace(
                        '_',
                        ' ',
                    )
                    ->title()
                    ->toString(),

            'is_featured' =>
                (bool) $workshop
                    ->is_featured,

            'canRegister' =>
                $canRegister,

            'can_register' =>
                $canRegister,

            'ctaLabel' =>
                $ctaLabel,

            'whatsappGroupUrl' =>
                data_get(
                    $firstLocation,
                    'whatsappGroupUrl',
                    $workshop
                        ->whatsapp_group_url,
                ),

            'whatsapp_group_url' =>
                data_get(
                    $firstLocation,
                    'whatsapp_group_url',
                    $workshop
                        ->whatsapp_group_url,
                ),

            'bannerUrl' =>
                $bannerUrl,

            'banner_url' =>
                $bannerUrl,

            'locations' =>
                $locations->all(),
        ];
    }

    private function formatTime(
        ?string $time,
    ): ?string {
        if (! $time) {
            return null;
        }

        return Carbon::parse(
            $time,
        )->format('g:i A');
    }

    private function formatDatabaseTime(
        ?string $time,
    ): ?string {
        if (! $time) {
            return null;
        }

        return Carbon::parse(
            $time,
        )->format('H:i');
    }

   private function publicStorageUrl(
    ?string $path,
): ?string {
    if (! $path) {
        return null;
    }

    /*
     * Keep valid complete URLs.
     */
    if (
        Str::startsWith(
            $path,
            [
                'http://',
                'https://',
            ],
        )
    ) {
        return $path;
    }

    /*
     * Convert all possible stored path
     * formats to: trainers/file.jpg
     */
    $cleanPath = preg_replace(
        '#^(storage/|public/)#',
        '',
        ltrim(
            trim($path),
            '/',
        ),
    );

    if (
        ! Storage::disk('public')
            ->exists($cleanPath)
    ) {
        return null;
    }

    return asset(
        'storage/'.$cleanPath,
    );
}
}