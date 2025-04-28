<?php

namespace Database\Seeders;

use App\Models\Lieu;
use Illuminate\Database\Seeder;

class LieuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lieux = [
            [
                'nom' => 'Salle Conférence A',
                'type' => 'Salle de conférence',
                'capacite' => 50,
                'description' => 'Grande salle équipée pour les formations',
                'actif' => true
            ],
            [
                'nom' => 'Amphithéâtre B',
                'type' => 'Amphithéâtre',
                'capacite' => 100,
                'description' => 'Amphithéâtre moderne avec équipement audiovisuel',
                'actif' => true
            ],
            [
                'nom' => 'Salle Formation C',
                'type' => 'Salle de formation',
                'capacite' => 30,
                'description' => 'Salle adaptée aux petits groupes',
                'actif' => true
            ]
        ];

        foreach ($lieux as $lieu) {
            Lieu::create($lieu);
        }
    }
}
