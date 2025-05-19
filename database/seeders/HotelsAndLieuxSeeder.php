<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hotel;
use App\Models\Lieu;

class HotelsAndLieuxSeeder extends Seeder
{
    public function run()
    {
        // Création des hôtels
        Hotel::create([
            'nom' => 'Hôtel Royal',
            'adresse' => '123 Avenue Principale',
            'ville' => 'Casablanca',
            'telephone' => '0522123456',
            'description' => 'Hôtel 4 étoiles au centre-ville',
            'actif' => true
        ]);

        Hotel::create([
            'nom' => 'Hôtel Atlas',
            'adresse' => '456 Rue Mohammed V',
            'ville' => 'Rabat',
            'telephone' => '0537123456',
            'description' => 'Hôtel avec vue sur la mer',
            'actif' => true
        ]);

        // Création des lieux
        Lieu::create([
            'nom' => 'Salle de conférence A',
            'type' => 'Salle de conférence',
            'capacite' => 50,
            'description' => 'Grande salle équipée pour les formations',
            'actif' => true
        ]);

        Lieu::create([
            'nom' => 'Amphithéâtre B',
            'type' => 'Amphithéâtre',
            'capacite' => 100,
            'description' => 'Amphithéâtre moderne avec équipement audiovisuel',
            'actif' => true
        ]);
    }
} 