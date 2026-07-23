<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;

use App\Models\Registration;
use App\Models\Workshop;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Return dashboard statistics and recent registrations.
     */
    public function index(): JsonResponse
    {
        $totalRegistrations =
            Registration::query()
                ->count();

        $todayRegistrations =
            Registration::query()
                ->whereDate(
                    'created_at',
                    today(),
                )
                ->count();

        $confirmedRegistrations =
            Registration::query()
                ->where(
                    'status',
                    'confirmed',
                )
                ->count();

        $waitlistRegistrations =
            Registration::query()
                ->where(
                    'status',
                    'waitlist',
                )
                ->count();

        $upcomingWorkshops =
            Workshop::query()
                ->whereDate(
                    'workshop_date',
                    '>=',
                    today(),
                )
                ->count();

        // $presentParticipants =
        //     Attendance::query()
        //         ->whereIn(
        //             'status',
        //             [
        //                 'present',
        //                 'late',
        //             ],
        //         )
        //         ->count();

        // $attendanceRate =
        //     $confirmedRegistrations > 0
        //         ? round(
        //             (
        //                 $presentParticipants /
        //                 $confirmedRegistrations
        //             ) * 100,
        //             1,
        //         )
        //         : 0;

        $recentRegistrations =
            Registration::query()
                ->with([
                    'workshop:id,title,workshop_date',

                    'workshopLocation:id,workshop_id,district,city,venue',
                ])
                ->latest()
                ->limit(10)
                ->get()
                ->map(
                    fn (
                        Registration $registration,
                    ): array => [
                        'id' =>
                            $registration->id,

                        'reference_number' =>
                            $registration
                                ->reference_number,

                        'full_name' =>
                            $registration
                                ->full_name,

                        'mobile_number' =>
                            $registration
                                ->mobile_number,

                        'workshop_title' =>
                            $registration
                                ->workshop
                                ?->title,

                        'location' =>
                            $registration
                                ->workshopLocation
                                ? [
                                    'district' =>
                                        $registration
                                            ->workshopLocation
                                            ->district,

                                    'city' =>
                                        $registration
                                            ->workshopLocation
                                            ->city,

                                    'venue' =>
                                        $registration
                                            ->workshopLocation
                                            ->venue,
                                ]
                                : null,

                        'status' =>
                            $registration->status,

                       

                        'registered_at' =>
                            $registration
                                ->created_at
                                ?->toIso8601String(),
                    ],
                )
                ->values();

        return response()->json([
            'stats' => [
                'total_registrations' =>
                    $totalRegistrations,

                'today_registrations' =>
                    $todayRegistrations,

                'confirmed' =>
                    $confirmedRegistrations,

                'waitlist' =>
                    $waitlistRegistrations,

                'upcoming_workshops' =>
                    $upcomingWorkshops,

                
            ],

            'recent_registrations' =>
                $recentRegistrations,
        ]);
    }

    /**
     * Return full details for one registration.
     */
    public function show(
        Registration $registration,
    ): JsonResponse {
        $registration->load([
            'workshop:id,title,slug,workshop_date,start_time,end_time,presenter,status',

            'workshopLocation:id,workshop_id,district,city,venue,map_url,capacity',

           
        ]);

        return response()->json([
            'data' => [
                'id' =>
                    $registration->id,

                'reference_number' =>
                    $registration
                        ->reference_number,

                'full_name' =>
                    $registration
                        ->full_name,

                'mobile_number' =>
                    $registration
                        ->mobile_number,

                'whatsapp_number' =>
                    $registration
                        ->whatsapp_number,

                'email' =>
                    $registration->email,

                'district' =>
                    $registration
                        ->district,

                'age' =>
                    $registration->age,

                'occupation' =>
                    $registration
                        ->occupation,

                'trading_experience' =>
                    (bool) $registration
                        ->trading_experience,

                'binance_account' =>
                    (bool) $registration
                        ->binance_account,

                'lead_source' =>
                    $registration
                        ->lead_source,

                'status' =>
                    $registration->status,

                'registered_at' =>
                    $registration
                        ->created_at
                        ?->toIso8601String(),

                'workshop' =>
                    $registration
                        ->workshop
                        ? [
                            'id' =>
                                $registration
                                    ->workshop
                                    ->id,

                            'title' =>
                                $registration
                                    ->workshop
                                    ->title,

                            'presenter' =>
                                $registration
                                    ->workshop
                                    ->presenter,

                            'date' =>
                                optional(
                                    $registration
                                        ->workshop
                                        ->workshop_date,
                                )->format(
                                    'Y-m-d',
                                ),

                            'start_time' =>
                                $registration
                                    ->workshop
                                    ->start_time,

                            'end_time' =>
                                $registration
                                    ->workshop
                                    ->end_time,

                            'status' =>
                                $registration
                                    ->workshop
                                    ->status,
                        ]
                        : null,

                'location' =>
                    $registration
                        ->workshopLocation
                        ? [
                            'id' =>
                                $registration
                                    ->workshopLocation
                                    ->id,

                            'district' =>
                                $registration
                                    ->workshopLocation
                                    ->district,

                            'city' =>
                                $registration
                                    ->workshopLocation
                                    ->city,

                            'venue' =>
                                $registration
                                    ->workshopLocation
                                    ->venue,

                            'map_url' =>
                                $registration
                                    ->workshopLocation
                                    ->map_url,

                            'capacity' =>
                                $registration
                                    ->workshopLocation
                                    ->capacity,
                        ]
                        : null,

               
            ],
        ]);
    }
}