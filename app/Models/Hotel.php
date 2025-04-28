<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    protected $fillable = [
        'nom',
        'adresse',
        'ville',
        'telephone',
        'description',
        'actif'
    ];

    public function formations()
    {
        return $this->hasMany(Formation::class);
    }
}
