<?php
namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Formation;
use App\Models\User;

class ParticipantController extends Controller
{
    public function index()
    {
        try {
            $participants = Participant::all();
            return response()->json($participants);
        } catch (\Exception $e) {
            Log::error('Erreur lors du chargement des participants: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du chargement des participants'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            Log::info('Données reçues pour la création du participant:', $request->all());

            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'email' => 'required|email|unique:participants',
                'telephone' => 'nullable|string|max:20',
                'date_naissance' => 'nullable|date',
                'niveau_etude' => 'nullable|string',
                'attentes' => 'nullable|string',
                'statut_paiement' => 'nullable|string|in:en_attente,paye,annule'
            ]);

            Log::info('Données validées:', $validated);

            // Convertir la date au format Y-m-d si elle est fournie
            if (isset($validated['date_naissance'])) {
                $validated['date_naissance'] = date('Y-m-d', strtotime($validated['date_naissance']));
            }

            $participant = Participant::create($validated);

            Log::info('Participant créé:', ['id' => $participant->id]);

            DB::commit();
            return response()->json($participant, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Erreur de validation:', $e->errors());
            return response()->json(['message' => 'Erreur de validation', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la création du participant: ' . $e->getMessage());
            Log::error('Stack trace:', ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Erreur lors de la création du participant: ' . $e->getMessage()], 500);
        }
    }

    public function show(Participant $participant)
    {
        try {
            return response()->json($participant);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération du participant: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la récupération du participant'], 500);
        }
    }

    public function update(Request $request, Participant $participant)
    {
        try {
            DB::beginTransaction();

            Log::info('Données reçues pour la mise à jour du participant:', $request->all());

            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'email' => 'required|email|unique:participants,email,' . $participant->id,
                'telephone' => 'nullable|string|max:20',
                'date_naissance' => 'nullable|date',
                'niveau_etude' => 'nullable|string',
                'attentes' => 'nullable|string',
                'statut_paiement' => 'nullable|string|in:en_attente,paye,annule'
            ]);

            // Convertir la date au format Y-m-d si elle est fournie
            if (isset($validated['date_naissance'])) {
                $validated['date_naissance'] = date('Y-m-d', strtotime($validated['date_naissance']));
            }

            $participant->update($validated);

            Log::info('Participant mis à jour:', ['id' => $participant->id]);

            DB::commit();
            return response()->json($participant);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Erreur de validation:', $e->errors());
            return response()->json(['message' => 'Erreur de validation', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la mise à jour du participant: ' . $e->getMessage());
            Log::error('Stack trace:', ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Erreur lors de la mise à jour du participant: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Participant $participant)
    {
        try {
            DB::beginTransaction();

            $participant->delete();

            Log::info('Participant supprimé:', ['id' => $participant->id]);

            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la suppression du participant: ' . $e->getMessage());
            Log::error('Stack trace:', ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Erreur lors de la suppression du participant: ' . $e->getMessage()], 500);
        }
    }

    public function attachFormation(Request $request, Participant $participant)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'formation_id' => 'required|exists:formations,id'
            ]);

            // Vérifier si le participant existe
            if (!$participant) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Participant non trouvé'
                ], 404);
            }

            // Vérifier si la formation existe
            $formation = Formation::find($validated['formation_id']);
            if (!$formation) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Formation non trouvée'
                ], 404);
            }

            // Vérifier si le participant n'est pas déjà inscrit à cette formation
            if ($participant->formations()->where('formation_id', $validated['formation_id'])->exists()) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Le participant est déjà inscrit à cette formation'
                ], 422);
            }

            // Vérifier si la formation a des places disponibles
            $participantsCount = $formation->participants()->count();
            if ($participantsCount >= $formation->places_disponibles) {
                DB::rollBack();
                return response()->json([
                    'message' => 'La formation est complète, il n\'y a plus de places disponibles'
                ], 422);
            }

            // Ajouter le participant à la formation avec le statut par défaut
            $participant->formations()->attach($validated['formation_id'], [
                'statut' => 'en_attente',
                'date_inscription' => now()
            ]);

            Log::info('Formation attachée au participant:', [
                'participant_id' => $participant->id,
                'formation_id' => $validated['formation_id']
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Participant ajouté à la formation avec succès',
                'participant' => $participant->load('formations')
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Erreur de validation lors de l\'attachement de la formation:', [
                'errors' => $e->errors()
            ]);
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de l\'attachement de la formation: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de l\'attachement de la formation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function detachFormation(Request $request, Participant $participant)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'formation_id' => 'required|exists:formations,id'
            ]);

            $participant->formations()->detach($validated['formation_id']);

            Log::info('Formation détachée du participant:', [
                'participant_id' => $participant->id,
                'formation_id' => $validated['formation_id']
            ]);

            DB::commit();
            return response()->json($participant->load('formations'));
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors du détachement de la formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors du détachement de la formation: ' . $e->getMessage()], 500);
        }
    }

    public function updateFormationStatus(Request $request, Participant $participant, Formation $formation)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'statut' => 'required|string|in:en_attente,inscrit,termine,abandonne'
            ]);

            $participant->formations()->updateExistingPivot($formation->id, [
                'statut' => $validated['statut']
            ]);

            Log::info('Statut de formation mis à jour:', [
                'participant_id' => $participant->id,
                'formation_id' => $formation->id,
                'statut' => $validated['statut']
            ]);

            DB::commit();
            return response()->json($participant->load('formations'));
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la mise à jour du statut de formation: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la mise à jour du statut de formation: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get progress data for all participants (trainers)
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProgress()
    {
        try {
            $participants = Participant::with(['formations' => function($query) {
                $query->select('formations.id', 'titre', 'date_debut', 'date_fin', 'statut')
                    ->orderBy('date_debut', 'desc');
            }])->get();

            $data = $participants->map(function($participant) {
                $totalFormations = $participant->formations->count();
                $completedFormations = $participant->formations->where('statut', 'termine')->count();
                $absences = $participant->formations->where('statut', 'absent')->count();
                
                return [
                    'id' => $participant->id,
                    'nom' => $participant->nom,
                    'prenom' => $participant->prenom,
                    'email' => $participant->email,
                    'total_formations' => $totalFormations,
                    'completed_formations' => $completedFormations,
                    'absences' => $absences,
                    'absence_rate' => $totalFormations > 0 ? round(($absences / $totalFormations) * 100, 2) : 0,
                    'evaluation_score' => $participant->evaluation_score ?? 0,
                    'formations' => $participant->formations
                ];
            });

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des statistiques: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la récupération des statistiques: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get the latest participants.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function latest()
    {
        try {
            Log::info('Début de la récupération des derniers participants');
            
            $participants = User::whereHas('roles', function($query) {
                $query->where('name', 'participant');
            })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'nom', 'prenom', 'email', 'created_at']);

            Log::info('Participants récupérés avec succès', ['count' => $participants->count()]);
            
            return response()->json($participants);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des derniers participants', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Erreur lors de la récupération des derniers participants',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 