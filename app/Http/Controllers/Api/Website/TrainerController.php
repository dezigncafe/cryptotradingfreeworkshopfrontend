<?php

namespace App\Http\Controllers\Api\Website;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use Illuminate\Http\JsonResponse;

class TrainerController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $trainers = Trainer::query()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('name')
            ->get()
            ->map(
                function (Trainer $trainer): array {
                    return [
                        'id' => $trainer->id,

                        'name' => $trainer->name,

                        'slug' => $trainer->slug,

                        'role' => $trainer->role,

                        'bio' => $trainer->bio,

                        'linkedin_url' =>
                            $trainer->linkedin_url,

                            'youtube_url' =>
                            $trainer->youtube_url,

                        'facebook_url' =>
                            $trainer->facebook_url,

                        'display_order' =>
                            $trainer->display_order,

                        'photo_path' =>
                            $trainer->photo_path,

                        'photo_url' =>
                            $trainer->photo_path
                                ? asset(
                                    'storage/'.
                                    ltrim(
                                        $trainer->photo_path,
                                        '/',
                                    ),
                                )
                                : null,
                    ];
                },
            )
            ->values();

        return response()->json([
            'data' => $trainers,
        ]);
    }
}