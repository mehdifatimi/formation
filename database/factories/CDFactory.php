<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Formation;

class CDFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => fake()->name(),
            'prenom' => fake()->firstName(),
            'email' => fake()->unique()->safeEmail(),
            'telephone' => fake()->phoneNumber(),
            'formation_id' => Formation::factory(),
        ];
    }
} 