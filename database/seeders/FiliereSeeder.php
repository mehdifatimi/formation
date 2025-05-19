<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Filiere;
use App\Models\Cdc;

class FiliereSeeder extends Seeder
{
    public function run(): void
    {
        // Vérifier si la table des filières est vide
        if (Filiere::count() === 0) {
            // Récupérer tous les CDC
            $cdcs = Cdc::all();
            
            // Pour chaque CDC, créer 5 filières
            foreach ($cdcs as $cdc) {
                for ($i = 1; $i <= 5; $i++) {
                    Filiere::create([
                        'cdc_id' => $cdc->id,
                        'nom' => "Filière {$i} - {$cdc->nom}",
                        'description' => "Description de la filière {$i} pour {$cdc->nom}"
                    ]);
                }
            }
        }
    }
} 