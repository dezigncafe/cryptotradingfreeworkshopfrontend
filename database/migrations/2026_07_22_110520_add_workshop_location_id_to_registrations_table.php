<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'registrations',
            function (
                Blueprint $table,
            ): void {
                $table
                    ->foreignId(
                        'workshop_location_id',
                    )
                    ->nullable()
                    ->after(
                        'workshop_id',
                    )
                    ->constrained(
                        'workshop_locations',
                    )
                    ->nullOnDelete();

                $table->index([
                    'workshop_location_id',
                    'status',
                ]);
            },
        );
    }

    public function down(): void
    {
        Schema::table(
            'registrations',
            function (
                Blueprint $table,
            ): void {
                $table->dropIndex([
                    'workshop_location_id',
                    'status',
                ]);

                $table->dropConstrainedForeignId(
                    'workshop_location_id',
                );
            },
        );
    }
};