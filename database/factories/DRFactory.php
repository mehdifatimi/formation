<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DRFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => fake()->company(),
        ];
    }
} 