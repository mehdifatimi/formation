<?php

namespace Database\Factories;

use App\Models\Formateur;
use Illuminate\Database\Eloquent\Factories\Factory;

class FormateurFactory extends Factory
{
    protected $model = Formateur::class;

    public function definition(): array
    {
        return [
            'nom' => $this->faker->lastName(),
            'prenom' => $this->faker->firstName(),
            'email' => $this->faker->unique()->safeEmail(),
            'telephone' => $this->faker->phoneNumber(),
            'specialites' => json_encode($this->faker->randomElements([
                'Développement Web',
                'Design UX/UI',
                'Marketing Digital',
                'Gestion de Projet',
                'Data Science',
                'DevOps',
                'Cybersécurité',
                'Intelligence Artificielle'
            ], 3)),
            'bio' => $this->faker->paragraphs(3, true),
            'photo' => $this->faker->imageUrl(300, 300, 'people'),
            'linkedin' => $this->faker->url(),
            'disponible' => $this->faker->boolean(80),
        ];
    }
} 