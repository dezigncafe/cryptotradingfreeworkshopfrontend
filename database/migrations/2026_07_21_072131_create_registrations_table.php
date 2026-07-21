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
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workshop_id')->constrained()->cascadeOnDelete();
            $table->string('reference_number', 40)->unique();
            $table->string('full_name');
            $table->string('mobile_number',20);
            $table->string('whatsapp_number',20)->nullable();
            $table->string('email')->nullable();
            $table->string('district', 100);
            $table->unsignedTinyInteger('age');
            $table->string('occupation')->nullable();
            $table->boolean('trading_experience',)->default(false);
            $table->boolean('binance_account')->default(false);
            $table->string('lead_source', 50)->nullable();
            $table->string('status', 30)->default('confirmed')->index();
            $table->timestamp('consent_at');
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->timestamps();
            $table->index([
                    'workshop_id',
                    'mobile_number',
                ]);
           
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};
