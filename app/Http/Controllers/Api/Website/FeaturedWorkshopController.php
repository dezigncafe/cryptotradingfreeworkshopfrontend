<?php

namespace App\Http\Controllers\Api\Website;

use App\Http\Controllers\Controller;
use App\Models\Workshop;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FeaturedWorkshopController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $workshop = Workshop::query()
            ->where('is_featured', true)
            ->whereNotIn('status', [
                'draft',
                'archived',
            ])
            ->latest('workshop_date')
            ->first();

        if (! $workshop) {
            return response()->json([
                'message' => 'No featured workshop is available.',
                'data' => null,
            ], 404);
        }

        $confirmedCount = $workshop
            ->registrations()
            ->where('status', 'confirmed')
            ->count();

        $seatsRemaining = max(
            $workshop->capacity - $confirmedCount,
            0,
        );

        $acceptsRegistration = in_array(
            $workshop->status,
            [
                'registration_open',
                'full',
            ],
            true,
        );

        $ctaLabel = $seatsRemaining > 0
            && $workshop->status === 'registration_open'
                ? 'Reserve Your Seat'
                : 'Join Waitlist';

        if (! $acceptsRegistration) {
            $ctaLabel = 'Registration Closed';
        }

        return response()->json([
            'data' => [
                'id' => $workshop->id,

                'title' => $workshop->title,

                'presenter' =>
                    $workshop->presenter,

                'description' =>
                    $workshop->description,

                'date' => $workshop
                    ->workshop_date
                    ->format('F j, Y'),

                'dateValue' => $workshop
                    ->workshop_date
                    ->format('Y-m-d'),

                'day' => $workshop
                    ->workshop_date
                    ->format('l'),

                'startTime' => $this->formatTime(
                    $workshop->start_time,
                ),

                'endTime' => $this->formatTime(
                    $workshop->end_time,
                ),

                'arrivalTime' =>
                    $this->formatTime(
                        $workshop->arrival_time,
                    ),

                'venue' => $workshop->venue,
                'city' => $workshop->city,
                'district' => $workshop->district,

                'mapUrl' => $workshop->map_url,

                'capacity' => $workshop->capacity,

                'registered' => $confirmedCount,

                'seatsRemaining' =>
                    $seatsRemaining,

                'statusCode' =>
                    $workshop->status,

                'status' => Str::of(
                    $workshop->status,
                )
                    ->replace('_', ' ')
                    ->title()
                    ->toString(),

                'canRegister' =>
                    $acceptsRegistration,

                'ctaLabel' => $ctaLabel,

                'whatsappGroupUrl' =>
                    $workshop
                        ->whatsapp_group_url,

                'bannerUrl' =>
                    $workshop->banner_path
                        ? url(
                            Storage::disk('public')
                                ->url(
                                    $workshop
                                        ->banner_path,
                                ),
                        )
                        : url(
                            '/images/workshop-hero.jpg',
                        ),
            ],
        ]);
    }

    private function formatTime(
        ?string $time,
    ): ?string {
        if (! $time) {
            return null;
        }

        return Carbon::parse($time)
            ->format('g:i A');
    }
}