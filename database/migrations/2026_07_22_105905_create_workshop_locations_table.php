<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'trainer_workshop_location',
            function (
                Blueprint $table,
            ): void {
                $table->id();

                $table
                    ->foreignId(
                        'trainer_id',
                    )
                    ->constrained(
                        'trainers',
                    )
                    ->cascadeOnDelete();

                $table
                    ->foreignId(
                        'workshop_location_id',
                    )
                    ->constrained(
                        'workshop_locations',
                    )
                    ->cascadeOnDelete();

                $table->timestamps();

                $table->unique([
                    'trainer_id',
                    'workshop_location_id',
                ]);
            },
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'trainer_workshop_location',
        );
    }
};