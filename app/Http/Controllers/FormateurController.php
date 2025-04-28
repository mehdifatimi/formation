<?php

namespace App\Http\Controllers;

use App\Models\Formateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class FormateurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $formateurs = Formateur::all();
        return response()->json($formateurs);
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
        // Log des données reçues pour le débogage
        Log::info('Données reçues pour créer un formateur:', $request->all());

        try {
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'email' => 'required|email|unique:formateurs,email',
                'telephone' => 'required|string|max:20',
                'specialites' => 'required|array|min:1',
                'bio' => 'required|string',
                'linkedin' => 'nullable|url',
                'disponible' => 'boolean',
            ]);

            if ($validator->fails()) {
                Log::error('Erreur de validation:', [
                    'errors' => $validator->errors()->toArray(),
                    'data' => $request->all()
                ]);
                return response()->json([
                    'message' => 'Les données fournies sont invalides.',
                    'errors' => $validator->errors(),
                    'received_data' => $request->all()
                ], 422);
            }

            // Préparer les données
            $data = $request->all();
            
            // S'assurer que les spécialités sont au bon format
            if (isset($data['specialites'])) {
                if (is_string($data['specialites'])) {
                    $data['specialites'] = json_decode($data['specialites'], true);
                }
                if (!is_array($data['specialites'])) {
                    $data['specialites'] = [$data['specialites']];
                }
            }

            // Valeur par défaut pour disponible
            if (!isset($data['disponible'])) {
                $data['disponible'] = true;
            }

            $formateur = Formateur::create($data);
            return response()->json($formateur, 201);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du formateur: ' . $e->getMessage(), [
                'data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Une erreur est survenue lors de la création du formateur.',
                'error' => $e->getMessage(),
                'received_data' => $request->all()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $formateur = Formateur::findOrFail($id);
        return response()->json($formateur);
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
    public function update(Request $request, string $id)
    {
        try {
            $formateur = Formateur::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'email' => 'required|email|unique:formateurs,email,' . $id,
                'telephone' => 'required|string|max:20',
                'specialites' => 'required|array|min:1',
                'bio' => 'required|string',
                'linkedin' => 'nullable|url',
                'disponible' => 'boolean',
            ]);

            if ($validator->fails()) {
                Log::error('Erreur de validation lors de la mise à jour:', [
                    'errors' => $validator->errors()->toArray(),
                    'data' => $request->all()
                ]);
                return response()->json([
                    'message' => 'Les données fournies sont invalides.',
                    'errors' => $validator->errors(),
                    'received_data' => $request->all()
                ], 422);
            }

            // Préparer les données
            $data = $request->all();
            
            // S'assurer que les spécialités sont au bon format
            if (isset($data['specialites'])) {
                if (is_string($data['specialites'])) {
                    $data['specialites'] = json_decode($data['specialites'], true);
                }
                if (!is_array($data['specialites'])) {
                    $data['specialites'] = [$data['specialites']];
                }
            }

            $formateur->update($data);
            return response()->json($formateur);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du formateur: ' . $e->getMessage(), [
                'data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Une erreur est survenue lors de la mise à jour du formateur.',
                'error' => $e->getMessage(),
                'received_data' => $request->all()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $formateur = Formateur::findOrFail($id);
            $formateur->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du formateur: ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue lors de la suppression du formateur.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
