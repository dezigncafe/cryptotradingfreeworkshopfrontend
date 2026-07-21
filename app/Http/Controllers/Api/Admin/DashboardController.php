<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'stats' => [
                'total_registrations' => 0,
                'today_registrations' => 0,
                'confirmed' => 0,
                'waitlist' => 0,
                'upcoming_workshops' => 0,
                'attendance_rate' => 0,
            ],

            'recent_registrations' => [],
        ]);
    }
}