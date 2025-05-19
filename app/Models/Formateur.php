<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formateur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'specialites',
        'bio',
        'photo',
        'linkedin',
        'disponible'
    ];

    protected $casts = [
        'disponible' => 'boolean',
        'specialites' => 'array'
    ];

    /**
     * Définir un mutateur pour s'assurer que specialites est toujours un tableau
     */
    public function setSpecialitesAttribute($value)
    {
        if (is_string($value)) {
            try {
                $this->attributes['specialites'] = json_encode(json_decode($value, true));
            } catch (\Exception $e) {
                $this->attributes['specialites'] = json_encode([$value]);
            }
        } else {
            $this->attributes['specialites'] = json_encode($value);
        }
    }

    /**
     * Définir un accesseur pour s'assurer que specialites est toujours un tableau
     */
    public function getSpecialitesAttribute($value)
    {
        if (is_string($value)) {
            try {
                return json_decode($value, true);
            } catch (\Exception $e) {
                return [$value];
            }
        }
        return $value;
    }

    public function formations()
    {
        return $this->hasMany(Formation::class);
    }

    public function getFullNameAttribute()
    {
        return "{$this->prenom} {$this->nom}";
    }
}
