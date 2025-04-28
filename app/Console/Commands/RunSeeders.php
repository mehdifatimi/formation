<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RunSeeders extends Command
{
    protected $signature = 'seed:run';
    protected $description = 'Run database seeders without Termwind';

    public function handle()
    {
        try {
            $this->info('Starting database seeding...');
            
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            $this->info('Disabled foreign key checks');
            
            // Clear all tables first
            $this->info('Clearing existing data...');
            $tables = [
                'participants',
                'animateurs',
                'formations',
                'filieres',
                'cdcs',
                'drifs',
                'drs',
                'villes',
                'regions'
            ];
            
            foreach ($tables as $table) {
                DB::table($table)->truncate();
                $this->info("Cleared table: {$table}");
            }

            // Run seeders in correct order
            $this->info('Running seeders...');
            
            $seeders = [
                'RegionSeeder' => 'Creating regions...',
                'VilleSeeder' => 'Creating cities...',
                'DRSeeder' => 'Creating DRs...',
                'DRIFSeeder' => 'Creating DRIFs...',
                'CDCSeeder' => 'Creating CDs...',
                'FiliereSeeder' => 'Creating filieres...',
                'AnimateurSeeder' => 'Creating animateurs...',
                'FormationSeeder' => 'Creating formations...',
                'ParticipantSeeder' => 'Creating participants...'
            ];

            foreach ($seeders as $seeder => $message) {
                $this->info($message);
                try {
                    $this->call('db:seed', [
                        '--class' => $seeder,
                        '--no-ansi' => true
                    ]);
                    $this->info("✓ {$seeder} completed");
                } catch (\Exception $e) {
                    $this->error("✗ Error in {$seeder}: " . $e->getMessage());
                    Log::error("Seeder error in {$seeder}: " . $e->getMessage());
                }
            }
            
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            $this->info('Enabled foreign key checks');
            
            $this->info('All seeders completed!');
        } catch (\Exception $e) {
            $this->error('Fatal error: ' . $e->getMessage());
            Log::error('Fatal seeder error: ' . $e->getMessage());
        }
    }
} 