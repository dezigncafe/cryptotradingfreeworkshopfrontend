<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'workshop_id',
        'workshop_location_id',

        'reference_number',
        'full_name',
        'mobile_number',
        'whatsapp_number',
        'email',

        'district',
        'age',
        'occupation',

        'trading_experience',
        'binance_account',
        'lead_source',

        'status',
        'consent_at',

        'utm_source',
        'utm_medium',
        'utm_campaign',
    ];

    /**
     * Attribute casts.
     */
    protected function casts(): array
    {
        return [
            'workshop_id' =>
                'integer',

            'workshop_location_id' =>
                'integer',

            'age' =>
                'integer',

            'trading_experience' =>
                'boolean',

            'binance_account' =>
                'boolean',

            /*
             * This fixes:
             * toIso8601String() on string
             */
            'consent_at' =>
                'datetime',
        ];
    }

    /**
     * Parent workshop.
     */
    public function workshop(): BelongsTo
    {
        return $this->belongsTo(
            Workshop::class,
            'workshop_id',
        );
    }

    /**
     * Selected workshop location.
     */
    public function workshopLocation(): BelongsTo
    {
        return $this->belongsTo(
            WorkshopLocation::class,
            'workshop_location_id',
        );
    }

   
}