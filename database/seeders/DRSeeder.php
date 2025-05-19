<?php

namespace Database\Seeders;

use App\Models\DR;
use Illuminate\Database\Seeder;

class DRSeeder extends Seeder
{
    public function run(): void
    {
        DR::factory()->count(5)->create();
    }
} 