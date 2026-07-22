<?php

use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\RegistrationController as AdminRegistrationController;
use App\Http\Controllers\Api\Admin\WorkshopController;
use App\Http\Controllers\Api\Website\FeaturedWorkshopController;
use App\Http\Controllers\Api\Website\RegistrationController as WebsiteRegistrationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\TrainerController as AdminTrainerController;
use App\Http\Controllers\Api\Website\TrainerController as WebsiteTrainerController;
use App\Http\Controllers\Api\Website\TrainerPhotoController;

Route::get(
    '/featured-workshop',
    FeaturedWorkshopController::class,
);
Route::get(
    '/workshops/featured',
    FeaturedWorkshopController::class,
);


Route::post(
    '/registrations',
    [
        WebsiteRegistrationController::class,
        'store',
    ],
)->middleware('throttle:10,1');

Route::get(
    '/trainers',
    WebsiteTrainerController::class,
);


Route::get(
    '/trainers/{trainer}/photo',
    TrainerPhotoController::class,
)
    ->whereNumber('trainer')
    ->name(
        'website.trainers.photo',
    );

Route::prefix('admin')->group(
    function (): void {
        Route::post(
            '/login',
            [
                AdminAuthController::class,
                'login',
            ],
        )->middleware('throttle:5,1');

        Route::middleware([
            'auth:api',
            'admin',
        ])->group(function (): void {
            Route::get(
                '/me',
                [
                    AdminAuthController::class,
                    'me',
                ],
            );

            Route::post(
                '/logout',
                [
                    AdminAuthController::class,
                    'logout',
                ],
            );

            Route::get(
                '/dashboard',
                [
                    DashboardController::class,
                    'index',
                ],
            );

            Route::post(
                '/workshops/{workshop}/duplicate',
                [
                    WorkshopController::class,
                    'duplicate',
                ],
            );

            Route::post(
                '/workshops/{workshop}/archive',
                [
                    WorkshopController::class,
                    'archive',
                ],
            );

            Route::apiResource(
                'workshops',
                WorkshopController::class,
            );

            Route::get(
                '/registrations',
                [
                    AdminRegistrationController::class,
                    'index',
                ],
            );

            Route::patch(
                '/registrations/{registration}/status',
                [
                    AdminRegistrationController::class,
                    'updateStatus',
                ],
            );
              /*
         * Trainer management
         */
        Route::apiResource(
            'trainers',
            AdminTrainerController::class,
        );

        Route::apiResource(
    'workshops',
    WorkshopController::class,
);
        });
    },
);