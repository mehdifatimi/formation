<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Formation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'titre',
        'description',
        'date_debut',
        'date_fin',
        'formateur_id',
        'places_disponibles',
        'hotel_id',
        'lieu_id',
        'statut',
        'created_by'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'places_disponibles' => 'integer'
    ];

    /**
     * Get the formateur that owns the formation.
     */
    public function formateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'formateur_id')->select(['id', 'name as nom', 'email']);
    }

    /**
     * Get the ville that owns the formation.
     */
    public function ville(): BelongsTo
    {
        return $this->belongsTo(Ville::class);
    }

    /**
     * Get the filiere that owns the formation.
     */
    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class);
    }

    /**
     * Get the validator that owns the formation.
     */
    public function validator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    /**
     * Get the participants for the formation.
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(Participant::class, 'formation_participant', 'formation_id', 'participant_id')
            ->withPivot('statut')
            ->withTimestamps();
    }

    /**
     * Get the absences for the formation.
     */
    public function absences(): HasMany
    {
        return $this->hasMany(Absence::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopePendingValidation($query)
    {
        return $query->where('statut', 'en_attente');
    }

    public function scopeValidated($query)
    {
        return $query->where('statut', 'validee');
    }

    public function scopeRejected($query)
    {
        return $query->where('statut', 'rejetee');
    }

    public function validate(User $validator)
    {
        if ($validator->role !== 'admin') {
            throw new \Exception('Seuls les administrateurs peuvent valider les formations');
        }

        $this->update([
            'statut' => 'validee',
            'validated_by' => $validator->id,
            'validated_at' => now()
        ]);
    }

    public function reject(User $validator, string $reason = null)
    {
        if ($validator->role !== 'admin') {
            throw new \Exception('Seuls les administrateurs peuvent rejeter les formations');
        }

        $this->update([
            'statut' => 'rejetee',
            'validated_by' => $validator->id,
            'validated_at' => now(),
            'rejection_reason' => $reason
        ]);
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function lieu()
    {
        return $this->belongsTo(Lieu::class);
    }
}
