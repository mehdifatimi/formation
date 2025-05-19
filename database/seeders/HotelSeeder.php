<?php

namespace Database\Seeders;

use App\Models\Hotel;
use Illuminate\Database\Seeder;

class HotelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hotels = [
            [
                'nom' => 'Hôtel Mercure Paris',
                'adresse' => '123 rue de Paris',
                'ville' => 'Paris',
                'telephone' => '01 23 45 67 89',
                'description' => 'Hôtel 4 étoiles au centre-ville',
                'actif' => true
            ],
            [
                'nom' => 'Ibis Styles Lyon',
                'adresse' => '456 avenue de Lyon',
                'ville' => 'Lyon',
                'telephone' => '04 56 78 90 12',
                'description' => 'Hôtel moderne et confortable',
                'actif' => true
            ],
            [
                'nom' => 'Novotel Marseille',
                'adresse' => '789 boulevard du Prado',
                'ville' => 'Marseille',
                'telephone' => '04 91 23 45 67',
                'description' => 'Hôtel avec vue sur mer',
                'actif' => true
            ]
        ];

        foreach ($hotels as $hotel) {
            Hotel::create($hotel);
        }
    }
}
