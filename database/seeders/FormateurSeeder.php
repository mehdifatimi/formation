<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Formateur;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class FormateurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $formateurs = [
            [
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'email' => 'jean.dupont@example.com',
                'telephone' => '0612345678',
                'specialites' => ['Développement Web', 'DevOps'],
                'bio' => 'Formateur expérimenté en développement web avec plus de 10 ans d\'expérience.',
                'linkedin' => 'https://www.linkedin.com/in/jean-dupont',
                'disponible' => true,
            ],
            [
                'nom' => 'Martin',
                'prenom' => 'Sophie',
                'email' => 'sophie.martin@example.com',
                'telephone' => '0623456789',
                'specialites' => ['Design UX/UI', 'Marketing Digital'],
                'bio' => 'Designer UX/UI passionnée par l\'expérience utilisateur et le design d\'interface.',
                'linkedin' => 'https://www.linkedin.com/in/sophie-martin',
                'disponible' => true,
            ],
            [
                'nom' => 'Bernard',
                'prenom' => 'Pierre',
                'email' => 'pierre.bernard@example.com',
                'telephone' => '0634567890',
                'specialites' => ['Data Science', 'Intelligence Artificielle'],
                'bio' => 'Expert en science des données et intelligence artificielle avec une solide expérience en analyse prédictive.',
                'linkedin' => 'https://www.linkedin.com/in/pierre-bernard',
                'disponible' => true,
            ],
            [
                'nom' => 'Petit',
                'prenom' => 'Marie',
                'email' => 'marie.petit@example.com',
                'telephone' => '0645678901',
                'specialites' => ['Gestion de Projet', 'Agile'],
                'bio' => 'Chef de projet certifiée PMP avec une expertise en méthodologies agiles.',
                'linkedin' => 'https://www.linkedin.com/in/marie-petit',
                'disponible' => true,
            ],
            [
                'nom' => 'Robert',
                'prenom' => 'Thomas',
                'email' => 'thomas.robert@example.com',
                'telephone' => '0656789012',
                'specialites' => ['Cybersécurité', 'Réseaux'],
                'bio' => 'Expert en cybersécurité avec une certification CISSP et plus de 8 ans d\'expérience.',
                'linkedin' => 'https://www.linkedin.com/in/thomas-robert',
                'disponible' => true,
            ],
            [
                'nom' => 'Leroy',
                'prenom' => 'Isabelle',
                'email' => 'isabelle.leroy@example.com',
                'telephone' => '0667890123',
                'specialites' => ['Cloud Computing', 'DevOps'],
                'bio' => 'Architecte cloud certifiée AWS et Azure avec une expertise en DevOps.',
                'linkedin' => 'https://www.linkedin.com/in/isabelle-leroy',
                'disponible' => true,
            ],
            [
                'nom' => 'Moreau',
                'prenom' => 'David',
                'email' => 'david.moreau@example.com',
                'telephone' => '0678901234',
                'specialites' => ['Mobile Development', 'React Native'],
                'bio' => 'Développeur mobile senior spécialisé en React Native et développement cross-platform.',
                'linkedin' => 'https://www.linkedin.com/in/david-moreau',
                'disponible' => true,
            ],
        ];

        foreach ($formateurs as $formateur) {
            try {
                Formateur::create($formateur);
                Log::info('Formateur créé avec succès: ' . $formateur['prenom'] . ' ' . $formateur['nom']);
            } catch (\Exception $e) {
                Log::error('Erreur lors de la création du formateur: ' . $e->getMessage(), [
                    'formateur' => $formateur,
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }

        $user = User::where('email', 'admin@example.com')->first();
        if ($user) {
            echo "Utilisateur existant:\n";
            echo "ID: " . $user->id . "\n";
            echo "Email: " . $user->email . "\n";
            echo "Role: " . $user->role . "\n";
        } else {
            echo "Création d'un nouvel utilisateur...\n";
            $user = new User;
            $user->name = 'Admin';
            $user->email = 'admin@example.com';
            $user->password = Hash::make('password123');
            $user->role = 'admin';
            $user->save();
            echo "Utilisateur créé avec succès!\n";
        }

        // Création du deuxième utilisateur admin
        $user2 = User::where('email', 'admin@exemple.com')->first();
        if ($user2) {
            echo "Deuxième utilisateur existant:\n";
            echo "ID: " . $user2->id . "\n";
            echo "Email: " . $user2->email . "\n";
            echo "Role: " . $user2->role . "\n";
        } else {
            echo "Création du deuxième utilisateur...\n";
            $user2 = new User;
            $user2->name = 'Admin';
            $user2->email = 'admin@exemple.com';
            $user2->password = Hash::make('password123');
            $user2->role = 'admin';
            $user2->save();
            echo "Deuxième utilisateur créé avec succès!\n";
        }
    }
} 