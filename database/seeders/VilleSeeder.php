<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ville;
use App\Models\Region;

class VilleSeeder extends Seeder
{
    public function run(): void
    {
        // Vérifier si la table des régions est vide
        if (Region::count() === 0) {
            // Créer les régions si elles n'existent pas
            $regions = [
                ['nom' => 'Casablanca-Settat'],
                ['nom' => 'Rabat-Salé-Kénitra'],
                ['nom' => 'Tanger-Tétouan-Al Hoceïma'],
                ['nom' => 'Fès-Meknès'],
                ['nom' => 'Marrakech-Safi'],
            ];

            foreach ($regions as $region) {
                Region::create($region);
            }
        }

        // Vérifier si la table des villes est vide
        if (Ville::count() === 0) {
            // Récupérer les régions
            $casablancaSettat = Region::where('nom', 'Casablanca-Settat')->first();
            $rabatSaleKenitra = Region::where('nom', 'Rabat-Salé-Kénitra')->first();
            $tangerTetouan = Region::where('nom', 'Tanger-Tétouan-Al Hoceïma')->first();
            $fesMeknes = Region::where('nom', 'Fès-Meknès')->first();
            $marrakechSafi = Region::where('nom', 'Marrakech-Safi')->first();

            // Ajouter les villes pour chaque région
            $villes = [
                // Casablanca-Settat
                ['region_id' => $casablancaSettat->id, 'nom' => 'Casablanca'],
                ['region_id' => $casablancaSettat->id, 'nom' => 'Settat'],
                ['region_id' => $casablancaSettat->id, 'nom' => 'Mohammedia'],
                ['region_id' => $casablancaSettat->id, 'nom' => 'El Jadida'],
                ['region_id' => $casablancaSettat->id, 'nom' => 'Benslimane'],
                ['region_id' => $casablancaSettat->id, 'nom' => 'Berrechid'],

                // Rabat-Salé-Kénitra
                ['region_id' => $rabatSaleKenitra->id, 'nom' => 'Rabat'],
                ['region_id' => $rabatSaleKenitra->id, 'nom' => 'Salé'],
                ['region_id' => $rabatSaleKenitra->id, 'nom' => 'Kénitra'],
                ['region_id' => $rabatSaleKenitra->id, 'nom' => 'Témara'],
                ['region_id' => $rabatSaleKenitra->id, 'nom' => 'Skhirat'],
                ['region_id' => $rabatSaleKenitra->id, 'nom' => 'Sidi Slimane'],

                // Tanger-Tétouan-Al Hoceïma
                ['region_id' => $tangerTetouan->id, 'nom' => 'Tanger'],
                ['region_id' => $tangerTetouan->id, 'nom' => 'Tétouan'],
                ['region_id' => $tangerTetouan->id, 'nom' => 'Al Hoceïma'],
                ['region_id' => $tangerTetouan->id, 'nom' => 'Larache'],
                ['region_id' => $tangerTetouan->id, 'nom' => 'Fnideq'],
                ['region_id' => $tangerTetouan->id, 'nom' => 'M\'diq'],

                // Fès-Meknès
                ['region_id' => $fesMeknes->id, 'nom' => 'Fès'],
                ['region_id' => $fesMeknes->id, 'nom' => 'Meknès'],
                ['region_id' => $fesMeknes->id, 'nom' => 'Ifrane'],
                ['region_id' => $fesMeknes->id, 'nom' => 'Sefrou'],
                ['region_id' => $fesMeknes->id, 'nom' => 'Moulay Yacoub'],
                ['region_id' => $fesMeknes->id, 'nom' => 'El Hajeb'],

                // Marrakech-Safi
                ['region_id' => $marrakechSafi->id, 'nom' => 'Marrakech'],
                ['region_id' => $marrakechSafi->id, 'nom' => 'Safi'],
                ['region_id' => $marrakechSafi->id, 'nom' => 'Essaouira'],
                ['region_id' => $marrakechSafi->id, 'nom' => 'El Kelaa des Sraghna'],
                ['region_id' => $marrakechSafi->id, 'nom' => 'Youssoufia'],
                ['region_id' => $marrakechSafi->id, 'nom' => 'Chichaoua'],
            ];

            foreach ($villes as $ville) {
                Ville::create($ville);
            }
        }
    }
} 