<?php

namespace Tests\Feature\Website;

use App\Models\Workshop;
use App\Models\WorkshopLocation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkshopTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_workshops_include_locations(): void
    {
        $workshop =
            Workshop::factory()
                ->create([
                   'title' =>
                'Galle Workshop',

            'slug' =>
                'galle-workshop',

            'presenter' =>
                'Dinisu Indrachapa',

            'status' =>
                'registration_open',

                    'workshop_date' =>
                        now()
                            ->addDays(10)
                            ->toDateString(),

                    'start_time' =>
                        '10:00:00',

                    'end_time' =>
                        '12:00:00',

                    'registration_open_at' =>
                        now()
                            ->subDay(),

                    'registration_close_at' =>
                        now()
                            ->addDays(9),
                ]);

        WorkshopLocation::factory()
            ->create([
                'workshop_id' =>
                    $workshop->id,

                'district' =>
                    'Galle',

                'city' =>
                    'Yakkalamulla',

                'venue' =>
                    'Town Hall',

                'capacity' =>
                    100,

                'display_order' =>
                    1,
            ]);

        $response =
            $this->getJson(
                '/api/featured-workshop',
            );

        $response
            ->assertOk()
            ->assertJsonFragment([
                'title' =>
                    'Galle Workshop',
            ])
            ->assertJsonFragment([
                'city' =>
                    'Yakkalamulla',

                'venue' =>
                    'Town Hall',
            ]);
    }
}