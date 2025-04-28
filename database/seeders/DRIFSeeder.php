<?php

namespace Database\Seeders;

use App\Models\DRIF;
use Illuminate\Database\Seeder;

class DRIFSeeder extends Seeder
{
    public function run(): void
    {
        DRIF::factory()->count(10)->create();
    }
} 