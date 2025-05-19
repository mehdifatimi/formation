<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profil extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'avatar',
        'bio',
        'telephone',
        'adresse',
        'ville',
        'pays',
        'code_postal',
        'preferences'
    ];

    protected $casts = [
        'preferences' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFullAddressAttribute()
    {
        return "{$this->adresse}, {$this->code_postal} {$this->ville}, {$this->pays}";
    }
}
