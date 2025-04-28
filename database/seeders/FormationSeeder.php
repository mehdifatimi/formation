<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Formation;
use App\Models\User;
use Carbon\Carbon;

class FormationSeeder extends Seeder
{
    public function run()
    {
        // Récupérer les formateurs
        $formateurs = User::where('role', 'formateur')->get();
        
        if ($formateurs->isEmpty()) {
            $this->command->info('Aucun formateur trouvé. Veuillez exécuter UserSeeder d\'abord.');
            return;
        }
        
        // Récupérer l'administrateur pour le champ created_by
        $admin = User::where('role', 'admin')->first();
        
        if (!$admin) {
            $this->command->info('Administrateur non trouvé. Veuillez exécuter UserSeeder d\'abord.');
            return;
        }
        
        // Créer des formations
        $formations = [
            [
                'titre' => 'Introduction au Développement Web',
                'description' => 'Apprenez les bases du HTML, CSS et JavaScript pour créer des sites web simples.',
                'date_debut' => Carbon::now()->addDays(5),
                'date_fin' => Carbon::now()->addDays(10),
                'formateur_id' => $formateurs->where('specialite', 'Développement Web')->first()->id,
                'places_disponibles' => 15,
                'statut' => 'en_attente',
                'created_by' => $admin->id,
            ],
            [
                'titre' => 'Design UI/UX Avancé',
                'description' => 'Techniques avancées de design d\'interface utilisateur et d\'expérience utilisateur.',
                'date_debut' => Carbon::now()->addDays(15),
                'date_fin' => Carbon::now()->addDays(20),
                'formateur_id' => $formateurs->where('specialite', 'Design UI/UX')->first()->id,
                'places_disponibles' => 10,
                'statut' => 'validee',
                'created_by' => $admin->id,
            ],
        ];
        
        foreach ($formations as $formation) {
            Formation::create($formation);
        }
    }
} 