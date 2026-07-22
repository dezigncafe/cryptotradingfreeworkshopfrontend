<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkshopLocation extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'workshop_id',
        'district',
        'city',
        'venue',
        'map_url',
        'capacity',
        'whatsapp_group_url',
        'display_order',
    ];

    protected function casts(): array
    {
        return [
            'capacity' => 'integer',

            'display_order' =>
                'integer',
        ];
    }

    public function workshop(): BelongsTo
    {
        return $this
            ->belongsTo(
                Workshop::class,
            )
            ->withTrashed();
    }

    public function trainers(): BelongsToMany
    {
        return $this
            ->belongsToMany(
                Trainer::class,
                'trainer_workshop_location',
                'workshop_location_id',
                'trainer_id',
            )
            ->withTimestamps();
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(
            Registration::class,
            'workshop_location_id',
        );
    }
}