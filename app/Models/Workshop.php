<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Workshop extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'presenter',
        'description',
        'district',
        'city',
        'venue',
        'map_url',
        'workshop_date',
        'start_time',
        'end_time',
        'arrival_time',
        'capacity',
        'registration_open_at',
        'registration_close_at',
        'status',
        'banner_path',
        'whatsapp_group_url',
        'is_featured',
    ];

     protected function casts(): array
    {
        return [
            'workshop_date' => 'date',
            'registration_open_at' => 'datetime',
            'registration_close_at' => 'datetime',
            'capacity' => 'integer',
            'is_featured' => 'boolean',
        ];
    }

        public function registrations(): HasMany
    {
    return $this->hasMany(
        Registration::class,
    );
    }
}
