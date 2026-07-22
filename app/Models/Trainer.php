<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Trainer extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'role',
        'bio',
        'photo_path',

        'linkedin_url',
        'youtube_url',
        'facebook_url',

        'display_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'display_order' =>
                'integer',

            'is_active' =>
                'boolean',
        ];
    }

    public function workshopLocations(): BelongsToMany
    {
        return $this
            ->belongsToMany(
                WorkshopLocation::class,
                'trainer_workshop_location',
                'trainer_id',
                'workshop_location_id',
            )
            ->withTimestamps();
    }
}