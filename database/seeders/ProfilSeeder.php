<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profil;

class ProfilSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer tous les utilisateurs qui n'ont pas encore de profil
        $users = User::doesntHave('profil')->get();

        foreach ($users as $user) {
            Profil::create([
                'user_id' => $user->id,
                'bio' => fake()->paragraph(),
                'telephone' => fake()->phoneNumber(),
                'adresse' => fake()->streetAddress(),
                'ville' => fake()->city(),
                'pays' => fake()->country(),
                'code_postal' => fake()->postcode(),
                'preferences' => json_encode([
                    'notifications' => true,
                    'theme' => 'light',
                    'langue' => 'fr',
                    'permissions' => []
                ]),
                'status' => 'actif'
            ]);
        }
    }
} 