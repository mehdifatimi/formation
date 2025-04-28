<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lieu extends Model
{
    protected $table = 'lieux';

    protected $fillable = [
        'nom',
        'type',
        'capacite',
        'description',
        'actif'
    ];

    public function formations()
    {
        return $this->hasMany(Formation::class);
    }
}
