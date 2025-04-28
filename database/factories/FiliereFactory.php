<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CDC;

class FiliereFactory extends Factory
{
    public function definition(): array
    {
        $filieres = [
            'Développement Web',
            'Intelligence Artificielle',
            'Cybersécurité',
            'Cloud Computing',
            'DevOps',
            'Data Science',
            'Réseaux',
            'Systèmes Embarqués',
            'Design UX/UI',
            'Marketing Digital',
        ];

        return [
            'nom' => fake()->randomElement($filieres),
            'description' => fake()->paragraph(),
            'cdc_id' => CDC::factory(),
        ];
    }
} 