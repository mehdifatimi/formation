<?php

namespace Database\Seeders;

use App\Models\CDC;
use Illuminate\Database\Seeder;

class CDCSeeder extends Seeder
{
    public function run(): void
    {
        CDC::factory()->count(10)->create();
    }
} 