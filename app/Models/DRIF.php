<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DRIF extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'drifs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'dr_id',
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
     * Get the DR that owns the DRIF.
     */
    public function dr(): BelongsTo
    {
        return $this->belongsTo(DR::class);
    }

    /**
     * Get the CDCs for the DRIF.
     */
    public function cdcs(): HasMany
    {
        return $this->hasMany(CDC::class);
    }
}
