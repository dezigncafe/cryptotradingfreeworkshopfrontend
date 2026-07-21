<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('workshops', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('presenter');
            $table->text('description')->nullable();
            $table->string('district');
            $table->string('city');
            $table->string('venue');
            $table->string('map_url')->nullable();
            $table->date('workshop_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->time('arrival_time')->nullable();
            $table->unsignedInteger('capacity')->default(100);
            $table->timestamp('registration_open_at')->nullable();
            $table->timestamp('registration_close_at')->nullable();
            $table->string('status')->default('draft')->index();
            $table->string('banner_path')->nullable();
            $table->string('whatsapp_group_url')->nullable();
            $table->boolean('is_featured')->default(false)->index();               
            $table->timestamps();
             $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workshops');
    }
};
