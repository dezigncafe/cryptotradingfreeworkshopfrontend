<?php

namespace App\Http\Controllers\Api\Website;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TrainerController extends Controller
{
    /**
     * Return all active trainers.
     */
    public function __invoke(
        Request $request,
    ): JsonResponse {
        $trainers = Trainer::query()
            ->where(
                'is_active',
                true,
            )
            ->orderBy(
                'display_order',
            )
            ->orderBy('name')
            ->get()
            ->map(
                function (
                    Trainer $trainer,
                ): array {
                    $photoUrl =
                        $this->trainerPhotoUrl(
                            $trainer,
                        );

                    return [
                        'id' =>
                            $trainer->id,

                        'name' =>
                            $trainer->name,

                        'slug' =>
                            $trainer->slug,

                        'role' =>
                            $trainer->role,

                        'bio' =>
                            $trainer->bio,

                        'linkedin_url' =>
                            $trainer
                                ->linkedin_url,

                        'youtube_url' =>
                            $trainer
                                ->youtube_url,

                        'facebook_url' =>
                            $trainer
                                ->facebook_url,

                        'display_order' =>
                            (int) $trainer
                                ->display_order,

                        'photo_path' =>
                            $trainer
                                ->photo_path,

                        /*
                         * Both names are returned so
                         * old and new frontend code work.
                         */
                        'photo_url' =>
                            $photoUrl,

                        'photoUrl' =>
                            $photoUrl,
                    ];
                },
            )
            ->values();

        return response()->json([
            'data' => $trainers,
        ]);
    }

    /**
     * Build a stable public photo URL.
     *
     * Local trainer images are served through
     * TrainerPhotoController instead of public/storage.
     */
    private function trainerPhotoUrl(
        Trainer $trainer,
    ): ?string {
        $path = trim(
            (string) $trainer
                ->photo_path,
        );

        if ($path === '') {
            return null;
        }

        /*
         * Keep genuinely external image URLs.
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

        $version =
            $trainer->updated_at
                ?->timestamp ??
            time();

        return route(
            'website.trainers.photo',
            [
                'trainer' =>
                    $trainer->id,

                'v' =>
                    $version,
            ],
            false,
        );
    }
}