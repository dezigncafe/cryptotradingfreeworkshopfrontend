<?php

namespace Database\Factories;

use App\Models\Workshop;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class WorkshopFactory extends Factory
{
    protected $model =
        Workshop::class;

    public function definition(): array
    {
        $title =
            'Crypto Trading FREE Workshop '.
            fake()
                ->unique()
                ->numberBetween(
                    1000,
                    999999,
                );

        return [
            'title' =>
                $title,

            'slug' =>
                Str::slug(
                    $title,
                ),

            'description' =>
                'Free crypto trading workshop.',

            'presenter' =>
                'Dinisu Indrachapa',

            /*
             * Legacy workshop location fields.
             * New structure uses workshop_locations,
             * but these database fields are still required.
             */
            'district' =>
                'Galle',

            'city' =>
                'Yakkalamulla',

            'venue' =>
                'Town Hall',

            'map_url' =>
                'https://maps.example.com/test',

            'capacity' =>
                100,

            'whatsapp_group_url' =>
                'https://chat.whatsapp.com/test',

            'workshop_date' =>
                now()
                    ->addDays(10)
                    ->toDateString(),

            'start_time' =>
                '10:00:00',

            'end_time' =>
                '12:00:00',

            'status' =>
                'registration_open',

            'registration_open_at' =>
                now()
                    ->subDay(),

            'registration_close_at' =>
                now()
                    ->addDays(9),
        ];
    }
}