<?php

namespace App\Http\Controllers\Api\Website;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TrainerPhotoController extends Controller
{
    /**
     * Stream one trainer image through Laravel.
     *
     * This does not require public/storage to be
     * directly used by the React application.
     */
    public function __invoke(
        Trainer $trainer,
    ): StreamedResponse {
        abort_unless(
            (bool) $trainer
                ->is_active,
            404,
        );

        $cleanPath =
            $this->normalizePath(
                $trainer->photo_path,
            );

        abort_if(
            ! $cleanPath,
            404,
            'Trainer image not found.',
        );

        /*
         * Prevent path traversal.
         */
        abort_if(
            str_contains(
                $cleanPath,
                '..',
            ),
            404,
            'Invalid trainer image path.',
        );

        $disk =
            Storage::disk('public');

        abort_unless(
            $disk->exists(
                $cleanPath,
            ),
            404,
            'Trainer image file not found.',
        );

        $mimeType =
            $disk->mimeType(
                $cleanPath,
            ) ?: 'image/jpeg';

        return $disk->response(
            $cleanPath,
            null,
            [
                'Content-Type' =>
                    $mimeType,

                'Cache-Control' =>
                    'public, max-age=86400',

                'X-Content-Type-Options' =>
                    'nosniff',
            ],
        );
    }

    /**
     * Convert stored path variations to:
     * trainers/file-name.jpg
     */
    private function normalizePath(
        ?string $path,
    ): ?string {
        if (! $path) {
            return null;
        }

        $cleanPath = trim(
            $path,
        );

        /*
         * This image endpoint is for local files.
         * External URLs are returned directly by
         * TrainerController and never reach here.
         */
        if (
            str_starts_with(
                $cleanPath,
                'http://',
            ) ||
            str_starts_with(
                $cleanPath,
                'https://',
            )
        ) {
            return null;
        }

        $cleanPath =
            ltrim(
                $cleanPath,
                '/',
            );

        $cleanPath =
            preg_replace(
                '#^(?:storage/app/public/|storage/|public/)+#',
                '',
                $cleanPath,
            );

        if (
            ! is_string(
                $cleanPath,
            )
        ) {
            return null;
        }

        $cleanPath = trim(
            $cleanPath,
            '/',
        );

        return $cleanPath !== ''
            ? $cleanPath
            : null;
    }
}