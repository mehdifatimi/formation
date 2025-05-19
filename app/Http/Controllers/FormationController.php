<?php
namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\User;
use App\Models\Participant;
use App\Models\Hotel;
use App\Models\Lieu;
use App\Models\Formateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FormationController extends Controller
{
    public function index()
    {
        try {
            $formations = Formation::with([
                'formateur',
                'participants' => function($query) {
                    $query->select('participants.id', 'nom', 'prenom', 'email');
                },
                'absences' => function($query) {
                    $query->with('participant:id,nom,prenom');
                },
                'hotel',
                'lieu'
            ])->get();
            
            Log::info('Formations chargées avec succès', ['count' => $formations->count()]);
            return response()->json($formations);
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement des formations: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du chargement des formations'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'titre' => 'required|string',
                'description' => 'required|string',
                'date_debut' => 'required|date',
                'date_fin' => 'required|date|after:date_debut',
                'formateur_id' => 'required|exists:formateurs,id',
                'hotel_id' => 'nullable|exists:hotels,id',
                'lieu_id' => 'nullable|exists:lieux,id',
                'places_disponibles' => 'required|integer|min:1',
                'statut' => 'required|in:planifiée,en_cours,terminée,annulée',
                'participants' => 'nullable|array',
                'participants.*' => 'exists:participants,id'
            ]);

            $validated['created_by'] = auth()->id() ?? 1;

            $formation = Formation::create($validated);

            // Ajouter les participants sélectionnés
            if (!empty($validated['participants'])) {
                foreach ($validated['participants'] as $participantId) {
                    $formation->participants()->attach($participantId, [
                        'statut' => 'en_attente',
                        'date_inscription' => now()
                    ]);
                }
            }

            DB::commit();

            return response()->json($formation->load(['hotel', 'lieu', 'formateur', 'participants']));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la création de la formation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Formation $formation)
    {
        try {
            return response()->json($formation->load(['formateur', 'participants']));
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du chargement de la formation'], 500);
        }
    }

    public function update(Request $request, Formation $formation)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'titre' => 'required|string',
                'description' => 'required|string',
                'date_debut' => 'required|date',
                'date_fin' => 'required|date|after:date_debut',
                'formateur_id' => 'required|exists:formateurs,id',
                'hotel_id' => 'nullable|exists:hotels,id',
                'lieu_id' => 'nullable|exists:lieux,id',
                'places_disponibles' => 'required|integer|min:1',
                'statut' => 'required|in:planifiée,en_cours,terminée,annulée',
                'participants' => 'nullable|array',
                'participants.*' => 'exists:participants,id'
            ]);

            $formation->update($validated);

            // Mettre à jour les participants
            if (isset($validated['participants'])) {
                // Supprimer les participants qui ne sont plus sélectionnés
                $currentParticipants = $formation->participants()->pluck('participants.id')->toArray();
                $participantsToRemove = array_diff($currentParticipants, $validated['participants']);
                $formation->participants()->detach($participantsToRemove);

                // Ajouter les nouveaux participants
                $participantsToAdd = array_diff($validated['participants'], $currentParticipants);
                foreach ($participantsToAdd as $participantId) {
                    $formation->participants()->attach($participantId, [
                        'statut' => 'en_attente',
                        'date_inscription' => now()
                    ]);
                }
            }

            DB::commit();

            return response()->json($formation->load(['hotel', 'lieu', 'formateur', 'participants']));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la mise à jour de la formation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Formation $formation)
    {
        try {
            $formation->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la suppression de la formation'], 500);
        }
    }

    public function validate(Formation $formation)
    {
        try {
            $formation->update(['statut' => 'validee']);
            return response()->json($formation);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la validation de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la validation de la formation'], 500);
        }
    }

    public function reject(Request $request, Formation $formation)
    {
        try {
            $validated = $request->validate([
                'reason' => 'required|string'
            ]);

            $formation->update([
                'statut' => 'rejetee',
                'rejection_reason' => $validated['reason']
            ]);
            return response()->json($formation->load(['formateur', 'participants']));
        } catch (\Exception $e) {
            Log::error('Erreur lors du rejet de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du rejet de la formation'], 500);
        }
    }

    public function pendingValidations()
    {
        try {
            $formations = Formation::where('statut', 'en_attente')
                ->with(['formateur', 'participants'])
                ->get();

            return response()->json($formations);
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement des formations en attente: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du chargement des formations en attente'], 500);
        }
    }

    public function addParticipant(Formation $formation, $participantId)
    {
        try {
            DB::beginTransaction();
            
            // Vérifier si le participant existe
            $participant = Participant::find($participantId);
            
            if (!$participant) {
                return response()->json([
                    'message' => 'Participant non trouvé'
                ], 404);
            }

            // Vérifier si le participant n'est pas déjà inscrit
            if ($formation->participants()->where('participant_id', $participantId)->exists()) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Le participant est déjà inscrit à cette formation'
                ], 422);
            }

            // Vérifier les places disponibles
            if ($formation->participants()->count() >= $formation->places_disponibles) {
                DB::rollBack();
                return response()->json([
                    'message' => 'La formation est complète'
                ], 422);
            }

            // Ajouter le participant
            $formation->participants()->attach($participantId, [
                'statut' => 'en_attente',
                'date_inscription' => now()
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Participant ajouté avec succès',
                'formation' => $formation->load(['formateur', 'participants'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de l\'ajout du participant: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de l\'ajout du participant',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the latest formations.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function latest()
    {
        try {
            $formations = Formation::with(['formateur'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get();

            return response()->json($formations);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du chargement des formations récentes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getOptionsData()
    {
        try {
            Log::info('Début du chargement des options de formation');

            // Vérifier si les tables existent
            if (!Schema::hasTable('hotels') || !Schema::hasTable('lieux') || !Schema::hasTable('formateurs') || !Schema::hasTable('participants')) {
                Log::error('Une ou plusieurs tables sont manquantes');
                return response()->json([
                    'success' => false,
                    'message' => 'Tables manquantes dans la base de données'
                ], 500);
            }

            // Récupérer les données avec gestion des erreurs pour chaque requête
            try {
                $hotels = Hotel::select('id', 'nom')->get();
                Log::info('Hotels chargés avec succès', ['count' => $hotels->count()]);
            } catch (\Exception $e) {
                Log::error('Erreur lors du chargement des hôtels', ['error' => $e->getMessage()]);
                $hotels = collect([]);
            }

            try {
                $lieux = Lieu::select('id', 'nom')->get();
                Log::info('Lieux chargés avec succès', ['count' => $lieux->count()]);
            } catch (\Exception $e) {
                Log::error('Erreur lors du chargement des lieux', ['error' => $e->getMessage()]);
                $lieux = collect([]);
            }

            try {
                $formateurs = Formateur::select('id', 'nom', 'prenom')->get();
                Log::info('Formateurs chargés avec succès', ['count' => $formateurs->count()]);
            } catch (\Exception $e) {
                Log::error('Erreur lors du chargement des formateurs', ['error' => $e->getMessage()]);
                $formateurs = collect([]);
            }

            try {
                $participants = Participant::select('id', 'nom', 'prenom')->get();
                Log::info('Participants chargés avec succès', ['count' => $participants->count()]);
            } catch (\Exception $e) {
                Log::error('Erreur lors du chargement des participants', ['error' => $e->getMessage()]);
                $participants = collect([]);
            }

            return response()->json([
                'success' => true,
                'hotels' => $hotels,
                'lieux' => $lieux,
                'formateurs' => $formateurs,
                'participants' => $participants
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur générale lors du chargement des options', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des options',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function handleAbsence(Request $request, Formation $formation)
    {
        try {
            DB::beginTransaction();

            Log::info('Début de la gestion d\'absence', [
                'request' => $request->all(),
                'formation_id' => $formation->id
            ]);

            $validated = $request->validate([
                'participant_id' => 'required|exists:participants,id',
                'date' => 'required|date',
                'reason' => 'required|string',
                'status' => 'required|in:justified,unjustified',
                'commentaire' => 'nullable|string'
            ]);

            Log::info('Données validées', ['validated' => $validated]);

            // Vérifier si le participant est inscrit à la formation
            $isParticipant = $formation->participants()
                ->where('participant_id', $validated['participant_id'])
                ->exists();

            Log::info('Vérification participant', [
                'is_participant' => $isParticipant,
                'participant_id' => $validated['participant_id']
            ]);

            if (!$isParticipant) {
                Log::warning('Participant non inscrit', [
                    'formation_id' => $formation->id,
                    'participant_id' => $validated['participant_id']
                ]);
                return response()->json([
                    'message' => 'Le participant n\'est pas inscrit à cette formation'
                ], 422);
            }

            try {
                // Mettre à jour ou créer l'absence
                $absence = $formation->absences()->updateOrCreate(
                    [
                        'participant_id' => $validated['participant_id'],
                        'date' => $validated['date']
                    ],
                    [
                        'reason' => $validated['reason'],
                        'status' => $validated['status'],
                        'commentaire' => $validated['commentaire'] ?? null
                    ]
                );

                Log::info('Absence créée/mise à jour', [
                    'absence_id' => $absence->id,
                    'formation_id' => $formation->id,
                    'participant_id' => $validated['participant_id']
                ]);

                DB::commit();

                return response()->json([
                    'message' => 'Absence enregistrée avec succès',
                    'absence' => $absence,
                    'formation' => $formation->load(['participants', 'absences'])
                ]);
            } catch (\Exception $e) {
                Log::error('Erreur lors de la création/mise à jour de l\'absence', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'formation_id' => $formation->id,
                    'participant_id' => $validated['participant_id']
                ]);
                throw $e;
            }
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de l\'enregistrement de l\'absence', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'formation_id' => $formation->id,
                'participant_id' => $request->participant_id
            ]);
            return response()->json([
                'message' => 'Erreur lors de l\'enregistrement de l\'absence',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}