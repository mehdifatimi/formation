<?php

namespace Database\Seeders;

use App\Models\Animateur;
use Illuminate\Database\Seeder;

class AnimateurSeeder extends Seeder
{
    public function run(): void
    {
        Animateur::factory()->count(15)->create();
    }
} 