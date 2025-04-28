<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Filiere;
use App\Models\Ville;
use App\Models\Animateur;

class FormationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titre' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'date_debut' => fake()->dateTimeBetween('now', '+1 month'),
            'date_fin' => fake()->dateTimeBetween('+1 month', '+2 months'),
            'duree' => fake()->numberBetween(1, 40),
            'niveau' => fake()->randomElement(['débutant', 'intermédiaire', 'avancé']),
            'prix' => fake()->randomFloat(2, 50, 1000),
            'places_disponibles' => fake()->numberBetween(5, 30),
            'statut' => fake()->randomElement(['à venir', 'en cours', 'terminé', 'annulé']),
            'formateur_id' => function () {
                return \App\Models\Formateur::inRandomOrder()->first()->id ?? \App\Models\Formateur::factory()->create()->id;
            },
            'ville_id' => function () {
                return \App\Models\Ville::inRandomOrder()->first()->id ?? \App\Models\Ville::factory()->create()->id;
            },
            'filiere_id' => function () {
                return \App\Models\Filiere::inRandomOrder()->first()->id ?? \App\Models\Filiere::factory()->create()->id;
            },
        ];
    }
} 