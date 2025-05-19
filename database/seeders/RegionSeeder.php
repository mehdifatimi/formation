<?php

namespace Database\Seeders;

use App\Models\Region;
use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        $regions = [
            'Casablanca-Settat',
            'Rabat-Salé-Kénitra',
            'Marrakech-Safi',
            'Tanger-Tétouan-Al Hoceïma',
            'Fès-Meknès',
            'Béni Mellal-Khénifra',
            'Souss-Massa',
            'Oriental',
            'Laâyoune-Sakia El Hamra',
            'Guelmim-Oued Noun',
            'Dakhla-Oued Ed-Dahab'
        ];

        foreach ($regions as $region) {
            Region::create(['nom' => $region]);
        }
    }
} 