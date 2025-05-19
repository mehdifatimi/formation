<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Filiere extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'cdc_id',
        'nom',
        'description',
        'created_at',
        'updated_at'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the CDC that owns the filiere.
     */
    public function cdc(): BelongsTo
    {
        return $this->belongsTo(CDC::class);
    }

    /**
     * Get the formations for the filiere.
     */
    public function formations(): HasMany
    {
        return $this->hasMany(Formation::class);
    }
}
