<?php

namespace App\Http\Controllers;

use App\Models\Profil;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

class ProfilController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $profils = Profil::with('user')->get();
            return response()->json($profils);
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement des profils: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du chargement des profils'], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            Log::info('Données reçues pour la création du profil:', $request->all());

            // Validation des données
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'permissions' => 'nullable|array'
            ]);

            if ($validator->fails()) {
                Log::error('Erreur de validation:', ['errors' => $validator->errors()]);
                return response()->json([
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();

            DB::beginTransaction();

            try {
                // Créer d'abord l'utilisateur
                $userData = [
                    'name' => $validated['name'],
                    'email' => $request->email ?? $validated['name'] . '@example.com',
                    'password' => Hash::make('password'), // Mot de passe par défaut
                    'role' => !empty($validated['permissions']) ? 'admin' : 'user'
                ];

                Log::info('Création de l\'utilisateur avec les données:', $userData);
                $user = User::create($userData);

                if (!$user) {
                    throw new \Exception('Échec de la création de l\'utilisateur');
                }

                // Créer le profil
                $profilData = [
                    'user_id' => $user->id,
                    'bio' => $validated['description'],
                    'preferences' => json_encode([
                        'permissions' => $validated['permissions'] ?? []
                    ]),
                    'status' => 'actif',
                    'avatar' => null,
                    'telephone' => null,
                    'adresse' => null,
                    'ville' => null,
                    'pays' => null,
                    'code_postal' => null
                ];

                Log::info('Création du profil avec les données:', $profilData);

                // Vérifier si le profil existe déjà pour cet utilisateur
                $existingProfil = Profil::where('user_id', $user->id)->first();
                if ($existingProfil) {
                    throw new \Exception('Un profil existe déjà pour cet utilisateur');
                }

                $profil = Profil::create($profilData);

                if (!$profil) {
                    throw new \Exception('Échec de la création du profil');
                }

                DB::commit();
                Log::info('Profil créé avec succès:', ['profil_id' => $profil->id]);
                return response()->json($profil->load('user'), 201);
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Erreur lors de la création du profil: ' . $e->getMessage(), [
                    'trace' => $e->getTraceAsString(),
                    'request_data' => $request->all()
                ]);
                return response()->json([
                    'message' => 'Erreur lors de la création du profil',
                    'error' => $e->getMessage()
                ], 500);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la création du profil: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'message' => 'Erreur lors de la création du profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Profil $profil)
    {
        return response()->json($profil->load('user'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            Log::info('Données reçues pour la mise à jour du profil:', $request->all());

            DB::beginTransaction();

            $profil = Profil::findOrFail($id);
            Log::info('Profil trouvé:', ['profil' => $profil->toArray()]);

            // Mettre à jour l'utilisateur associé
            if ($profil->user) {
                Log::info('Mise à jour de l\'utilisateur:', ['user_id' => $profil->user->id]);
                $profil->user->update([
                    'name' => $request->name,
                    'role' => !empty($request->permissions) ? 'admin' : 'user'
                ]);
            } else {
                Log::warning('Pas d\'utilisateur associé au profil');
            }

            // Préparer les données du profil
            $profilData = [
                'bio' => $request->description,
                'preferences' => json_encode([
                    'permissions' => $request->permissions ?? []
                ])
            ];

            Log::info('Données de mise à jour du profil:', $profilData);

            // Mettre à jour le profil
            $profil->update($profilData);

            DB::commit();
            return response()->json($profil->load('user'));
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la mise à jour du profil: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return response()->json(['message' => 'Erreur lors de la mise à jour du profil'], 500);
        }
    }

    public function updateStatus(Request $request, Profil $profil)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|string|in:actif,inactif'
            ]);

            $profil->update($validated);
            return response()->json($profil->load('user'));
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du statut du profil: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la mise à jour du statut du profil'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $profil = Profil::findOrFail($id);
            $user = $profil->user;

            // Supprimer le profil
            $profil->delete();

            // Supprimer l'utilisateur s'il existe
            if ($user) {
                $user->delete();
            }

            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la suppression du profil: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la suppression du profil'], 500);
        }
    }
}
