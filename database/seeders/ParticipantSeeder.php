<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profil;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use App\Models\Participant;

class ParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $participants = [
            [
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'email' => 'jean.dupont@example.com',
                'telephone' => '0612345678',
                'adresse' => '15 rue de Paris',
                'ville' => 'Paris',
                'code_postal' => '75001',
                'date_naissance' => '1990-05-15',
                'niveau_etude' => 'Bac+3',
                'statut' => 'actif'
            ],
            [
                'nom' => 'Martin',
                'prenom' => 'Sophie',
                'email' => 'sophie.martin@example.com',
                'telephone' => '0623456789',
                'adresse' => '25 avenue des Champs',
                'ville' => 'Lyon',
                'code_postal' => '69001',
                'date_naissance' => '1992-08-20',
                'niveau_etude' => 'Bac+5',
                'statut' => 'actif'
            ],
            [
                'nom' => 'Bernard',
                'prenom' => 'Pierre',
                'email' => 'pierre.bernard@example.com',
                'telephone' => '0634567890',
                'adresse' => '8 rue du Commerce',
                'ville' => 'Marseille',
                'code_postal' => '13001',
                'date_naissance' => '1988-12-10',
                'niveau_etude' => 'Bac+2',
                'statut' => 'actif'
            ],
            [
                'nom' => 'Petit',
                'prenom' => 'Marie',
                'email' => 'marie.petit@example.com',
                'telephone' => '0645678901',
                'adresse' => '12 boulevard Victor Hugo',
                'ville' => 'Nice',
                'code_postal' => '06000',
                'date_naissance' => '1995-03-25',
                'niveau_etude' => 'Bac+4',
                'statut' => 'actif'
            ],
            [
                'nom' => 'Robert',
                'prenom' => 'Lucas',
                'email' => 'lucas.robert@example.com',
                'telephone' => '0656789012',
                'adresse' => '5 rue de la République',
                'ville' => 'Toulouse',
                'code_postal' => '31000',
                'date_naissance' => '1993-07-30',
                'niveau_etude' => 'Bac+3',
                'statut' => 'actif'
            ],
            [
                'nom' => 'Richard',
                'prenom' => 'Emma',
                'email' => 'emma.richard@example.com',
                'telephone' => '0667890123',
                'adresse' => '18 rue des Fleurs',
                'ville' => 'Bordeaux',
                'code_postal' => '33000',
                'date_naissance' => '1991-11-05',
                'niveau_etude' => 'Bac+5',
                'statut' => 'actif'
            ],
            [
                'nom' => 'Moreau',
                'prenom' => 'Thomas',
                'email' => 'thomas.moreau@example.com',
                'telephone' => '0678901234',
                'adresse' => '30 avenue Jean Jaurès',
                'ville' => 'Lille',
                'code_postal' => '59000',
                'date_naissance' => '1994-09-15',
                'niveau_etude' => 'Bac+4',
                'statut' => 'actif'
            ],
            [
                'nom' => 'Simon',
                'prenom' => 'Laura',
                'email' => 'laura.simon@example.com',
                'telephone' => '0689012345',
                'adresse' => '22 rue Pasteur',
                'ville' => 'Nantes',
                'code_postal' => '44000',
                'date_naissance' => '1996-02-20',
                'niveau_etude' => 'Bac+3',
                'statut' => 'actif'
            ]
        ];

        foreach ($participants as $participant) {
            try {
                // Créer l'utilisateur
                $user = User::create([
                    'name' => $participant['prenom'] . ' ' . $participant['nom'],
                    'email' => $participant['email'],
                    'password' => Hash::make('password123'),
                ]);

                // Créer le profil
                Profil::create([
                    'user_id' => $user->id,
                    'nom' => $participant['nom'],
                    'prenom' => $participant['prenom'],
                    'telephone' => $participant['telephone'],
                ]);

                Participant::create($participant);

                Log::info('Participant créé avec succès: ' . $participant['prenom'] . ' ' . $participant['nom']);
            } catch (\Exception $e) {
                Log::error('Erreur lors de la création du participant: ' . $e->getMessage(), [
                    'participant' => $participant,
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }
    }
} 