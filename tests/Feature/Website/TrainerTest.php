<?php

namespace Tests\Feature\Website;

use App\Models\Trainer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrainerTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_trainers_are_returned(): void
    {
        Trainer::query()->create([
            'name' =>
                'Dinisu Indrachapa',

            'slug' =>
                'dinisu-indrachapa',

            'role' =>
                'Lead Trainer',

            'bio' =>
                'Crypto trading trainer.',

            'is_active' =>
                true,

            'display_order' =>
                1,
        ]);

        Trainer::query()->create([
            'name' =>
                'Inactive Trainer',

            'slug' =>
                'inactive-trainer',

            'role' =>
                'Trainer',

            'is_active' =>
                false,

            'display_order' =>
                2,
        ]);

        $response =
            $this->getJson(
                '/api/trainers',
            );

        $response
            ->assertOk()
            ->assertJsonCount(
                1,
                'data',
            )
            ->assertJsonPath(
                'data.0.name',
                'Dinisu Indrachapa',
            );
    }
}