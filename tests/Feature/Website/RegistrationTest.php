<?php

namespace Tests\Feature\Website;

use App\Models\Workshop;
use App\Models\WorkshopLocation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_for_a_location(): void
    {
        $workshop =
            Workshop::factory()
                ->create([
                    'status' =>
                        'registration_open',

                    'workshop_date' =>
                        now()
                            ->addDays(5)
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
                            ->addDays(4),
                ]);

        $location =
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
                ]);

        $response =
            $this->postJson(
                '/api/registrations',
                [
                    'workshop_id' =>
                        $workshop->id,

                    'workshop_location_id' =>
                        $location->id,

                    'full_name' =>
                        'Nimal Perera',

                    'mobile_number' =>
                        '0771234567',

                    'whatsapp_number' =>
                        '0771234567',

                    'email' =>
                        'nimal@example.com',

                    'district' =>
                        'Galle',

                    'age' =>
                        30,

                    'occupation' =>
                        'Designer',

                    'trading_experience' =>
                        false,

                    'binance_account' =>
                        false,

                    'lead_source' =>
                        'Facebook',

                    'consent' =>
                        true,
                ],
            );

        $response
            ->assertCreated()
            ->assertJsonPath(
                'data.status',
                'confirmed',
            )
            ->assertJsonPath(
                'data.locationId',
                $location->id,
            )
            ->assertJsonStructure([
                'message',

                'data' => [
                    'id',
                    'referenceNumber',
                    'status',
                    'workshopTitle',
                    'workshopDate',
                    'workshopStartTime',
                    'venue',
                ],
            ]);

        $this->assertDatabaseHas(
            'registrations',
            [
                'full_name' =>
                    'Nimal Perera',

                'mobile_number' =>
                    '94771234567',

                'workshop_location_id' =>
                    $location->id,

                'status' =>
                    'confirmed',
            ],
        );
    }
}