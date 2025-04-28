<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Formation;

class ParticipantFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'email' => fake()->unique()->safeEmail(),
            'telephone' => fake()->phoneNumber(),
            'date_naissance' => fake()->date(),
            'niveau_etude' => fake()->randomElement(['Bac', 'Bac+2', 'Bac+3', 'Bac+4', 'Bac+5']),
            'attentes' => fake()->paragraph(),
            'statut_paiement' => fake()->randomElement(['en attente', 'payé', 'annulé', 'remboursé'])
        ];
    }
} 