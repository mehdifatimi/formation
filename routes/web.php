<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Development routes (should be disabled in production)
Route::prefix('dev')->group(function () {
    Route::get('/run-seeder', function () {
        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            
            // Clear all tables first
            DB::table('participants')->truncate();
            DB::table('animateurs')->truncate();
            DB::table('formations')->truncate();
            DB::table('filieres')->truncate();
            DB::table('cdcs')->truncate();
            DB::table('drifs')->truncate();
            DB::table('drs')->truncate();
            DB::table('villes')->truncate();
            DB::table('regions')->truncate();
            
            // Run seeders
            Artisan::call('db:seed', ['--force' => true]);
            
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            
            return 'Seeder completed successfully!';
        } catch (\Exception $e) {
            return 'Error: ' . $e->getMessage();
        }
    });
});
