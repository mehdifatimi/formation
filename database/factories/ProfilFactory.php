<?php

namespace Database\Factories;

use App\Models\Profil;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfilFactory extends Factory
{
    protected $model = Profil::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'avatar' => $this->faker->imageUrl(200, 200, 'people'),
            'bio' => $this->faker->paragraph(),
            'telephone' => $this->faker->phoneNumber(),
            'adresse' => $this->faker->streetAddress(),
            'ville' => $this->faker->city(),
            'pays' => $this->faker->country(),
            'code_postal' => $this->faker->postcode(),
            'preferences' => json_encode([
                'notifications' => true,
                'theme' => 'light',
                'langue' => 'fr'
            ]),
        ];
    }
} 