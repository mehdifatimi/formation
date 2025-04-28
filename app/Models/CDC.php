<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CDC extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'cdcs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'drif_id',
        'nom',
        'prenom',
        'email',
        'telephone',
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
     * Get the DRIF that owns the CDC.
     */
    public function drif(): BelongsTo
    {
        return $this->belongsTo(DRIF::class);
    }

    /**
     * Get the filieres for the CDC.
     */
    public function filieres(): HasMany
    {
        return $this->hasMany(Filiere::class);
    }
}
