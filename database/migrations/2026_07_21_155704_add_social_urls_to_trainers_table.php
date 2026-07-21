<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table(
            'trainers',
            function (Blueprint $table): void {
                $table
                    ->string('youtube_url', 1000)
                    ->nullable();

                $table
                    ->string('facebook_url', 1000)
                    ->nullable();
            },
        );
    }

    public function down(): void
    {
        Schema::table(
            'trainers',
            function (Blueprint $table): void {
                $table->dropColumn([
                    'youtube_url',
                    'facebook_url',
                ]);
            },
        );
    }
};