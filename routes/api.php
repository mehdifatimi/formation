<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\VilleController;
use App\Http\Controllers\DRController;
use App\Http\Controllers\DRIFController;
use App\Http\Controllers\CDCController;
use App\Http\Controllers\FiliereController;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\AnimateurController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FormateurController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\AbsenceController;
use App\Http\Controllers\RoleController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// CORS preflight requests
Route::options('{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN')
        ->header('Access-Control-Allow-Credentials', 'true');
})->where('any', '.*');

// Route CSRF
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

// Routes publiques
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/csrf-cookie', function() {
    return response()->json(['message' => 'CSRF cookie set']);
});

// Routes protégées
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Routes pour les formations
    Route::prefix('formations')->group(function () {
        Route::get('/', [FormationController::class, 'index']);
        Route::get('/options', [FormationController::class, 'getOptionsData']);
        Route::post('/', [FormationController::class, 'store']);
        Route::get('/{formation}', [FormationController::class, 'show']);
        Route::put('/{formation}', [FormationController::class, 'update']);
        Route::delete('/{formation}', [FormationController::class, 'destroy']);
        Route::post('/{formation}/absences', [FormationController::class, 'handleAbsence']);
    });

    // API Resource Routes
    Route::apiResource('formations', FormationController::class);
    Route::apiResource('regions', RegionController::class);
    Route::apiResource('villes', VilleController::class);
    Route::apiResource('drs', DRController::class);
    Route::apiResource('drifs', DRIFController::class);
    Route::apiResource('cdcs', CDCController::class);
    Route::apiResource('filieres', FiliereController::class);
    Route::apiResource('animateurs', AnimateurController::class);
    Route::apiResource('participants', ParticipantController::class);
    Route::apiResource('formateurs', FormateurController::class);
    Route::apiResource('profils', ProfilController::class);
    Route::apiResource('absences', AbsenceController::class);
    Route::apiResource('roles', RoleController::class);

    // Participant routes
    Route::prefix('participants')->group(function () {
        Route::get('/latest', [ParticipantController::class, 'latest']);
        Route::get('/progress', [ParticipantController::class, 'getProgress']);
        Route::post('/{participant}/formations', [ParticipantController::class, 'attachFormation']);
        Route::delete('/{participant}/formations/{formation}', [ParticipantController::class, 'detachFormation']);
        Route::put('/{participant}/formations/{formation}/status', [ParticipantController::class, 'updateFormationStatus']);
    });

    // Profil routes
    Route::put('profils/{profil}/status', [ProfilController::class, 'updateStatus']);

    // Absence routes
    Route::get('absences/statistics', [AbsenceController::class, 'statistics']);

    // Role management routes
    Route::prefix('users')->group(function () {
        Route::post('/{user}/roles', [RoleController::class, 'assignRole']);
        Route::delete('/{user}/roles', [RoleController::class, 'removeRole']);
        Route::put('/{user}/roles', [RoleController::class, 'syncRoles']);
    });

    // Routes pour les participants
    Route::get('/participants/latest', [ParticipantController::class, 'latest']);
    Route::apiResource('participants', ParticipantController::class);
});