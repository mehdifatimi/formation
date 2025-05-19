<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserSeeder extends Seeder
{
    public function run()
    {
        try {
            // Récupérer les rôles existants
            $adminRole = Role::where('slug', 'admin')->firstOrFail();
            $formateurRole = Role::where('slug', 'formateur_animateur')->firstOrFail();
            $participantRole = Role::where('slug', 'formateur_participant')->firstOrFail();

            // Vérifier si la table est vide
            if (User::count() === 0) {
                // Create admin user
                $admin = User::create([
                    'name' => 'Admin',
                    'email' => 'admin@test.com',
                    'password' => Hash::make('admin123'),
                    'role' => 'admin'
                ]);
                $admin->syncRoles([$adminRole]);
                Log::info('Admin user created', ['email' => $admin->email]);

                // Create additional admin user
                $admin2 = User::create([
                    'name' => 'Admin Exemple',
                    'email' => 'admin@exemple.com',
                    'password' => Hash::make('admin123'),
                    'role' => 'admin'
                ]);
                $admin2->syncRoles([$adminRole]);
                Log::info('Additional admin user created', ['email' => $admin2->email]);

                // Create Mehdi's admin account
                $mehdi = User::create([
                    'name' => 'Mehdi Fatimi',
                    'email' => 'mehdifatimi84@gmail.com',
                    'password' => Hash::make('mehdi123'),
                    'role' => 'admin'
                ]);
                $mehdi->syncRoles([$adminRole]);
                Log::info('Mehdi admin user created', ['email' => $mehdi->email]);

                // Create formateurs
                $formateurs = [
                    [
                        'name' => 'Formateur Test',
                        'email' => 'formateur@test.com',
                        'password' => Hash::make('formateur123'),
                        'role' => 'formateur',
                        'specialite' => 'Développement Web',
                    ],
                    [
                        'name' => 'Formateur Test 2',
                        'email' => 'formateur2@test.com',
                        'password' => Hash::make('formateur123'),
                        'role' => 'formateur',
                        'specialite' => 'Design UI/UX',
                    ],
                ];

                foreach ($formateurs as $formateurData) {
                    $formateur = User::create($formateurData);
                    $formateur->syncRoles([$formateurRole]);
                }

                // Create participants
                $participants = [
                    [
                        'name' => 'Participant Test',
                        'email' => 'participant@test.com',
                        'password' => Hash::make('participant123'),
                        'role' => 'participant',
                    ],
                    [
                        'name' => 'Participant Test 2',
                        'email' => 'participant2@test.com',
                        'password' => Hash::make('participant123'),
                        'role' => 'participant',
                    ],
                ];

                foreach ($participants as $participantData) {
                    $participant = User::create($participantData);
                    $participant->syncRoles([$participantRole]);
                }
            }
        } catch (\Exception $e) {
            Log::error('Error in UserSeeder: ' . $e->getMessage());
            throw $e;
        }
    }
} 