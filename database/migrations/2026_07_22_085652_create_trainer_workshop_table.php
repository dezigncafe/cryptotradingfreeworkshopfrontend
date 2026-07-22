<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'workshop_locations',
            function (
                Blueprint $table,
            ): void {
                $table->id();

                $table
                    ->foreignId(
                        'workshop_id',
                    )
                    ->constrained(
                        'workshops',
                    )
                    ->cascadeOnDelete();

                $table
                    ->string(
                        'district',
                        100,
                    );

                $table
                    ->string(
                        'city',
                        100,
                    );

                $table
                    ->string('venue');

                $table
                    ->string(
                        'map_url',
                        1000,
                    )
                    ->nullable();

                $table
                    ->unsignedInteger(
                        'capacity',
                    )
                    ->default(100);

                $table
                    ->string(
                        'whatsapp_group_url',
                        1000,
                    )
                    ->nullable();

                $table
                    ->unsignedSmallInteger(
                        'display_order',
                    )
                    ->default(0);

                $table->timestamps();
                $table->softDeletes();

                $table->index([
                    'workshop_id',
                    'display_order',
                ]);
            },
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'workshop_locations',
        );
    }
};