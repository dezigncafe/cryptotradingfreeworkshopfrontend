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

    protected function casts(): array
    {
        return [
            'age' => 'integer',
            'trading_experience' => 'boolean',
            'binance_account' => 'boolean',
            'consent_at' => 'datetime',
        ];
    }

    public function workshop(): BelongsTo
    {
        return $this->belongsTo(
            Workshop::class,
        );
    }
}