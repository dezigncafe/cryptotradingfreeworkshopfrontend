<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'workshops',
            function (Blueprint $table): void {
                $table
                    ->string('district')
                    ->nullable()
                    ->change();

                $table
                    ->string('city')
                    ->nullable()
                    ->change();

                $table
                    ->string('venue')
                    ->nullable()
                    ->change();

                $table
                    ->text('map_url')
                    ->nullable()
                    ->change();

                $table
                    ->unsignedInteger('capacity')
                    ->nullable()
                    ->change();

                $table
                    ->text('whatsapp_group_url')
                    ->nullable()
                    ->change();
            },
        );
    }

    public function down(): void
    {
        Schema::table(
            'workshops',
            function (Blueprint $table): void {
                $table
                    ->string('district')
                    ->nullable(false)
                    ->change();

                $table
                    ->string('city')
                    ->nullable(false)
                    ->change();

                $table
                    ->string('venue')
                    ->nullable(false)
                    ->change();

                $table
                    ->text('map_url')
                    ->nullable(false)
                    ->change();

                $table
                    ->unsignedInteger('capacity')
                    ->nullable(false)
                    ->change();

                $table
                    ->text('whatsapp_group_url')
                    ->nullable(false)
                    ->change();
            },
        );
    }
};