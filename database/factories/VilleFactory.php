<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Region;

class VilleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => fake()->unique()->city(),
            'region_id' => Region::factory(),
        ];
    }
} 