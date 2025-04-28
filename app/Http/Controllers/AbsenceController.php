<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use App\Models\Participant;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AbsenceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Absence::with(['participant', 'formation']);

            // Filtres
            if ($request->has('participant_id')) {
                $query->where('participant_id', $request->participant_id);
            }

            if ($request->has('formation_id')) {
                $query->where('formation_id', $request->formation_id);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('date_from')) {
                $query->whereDate('date', '>=', $request->date_from);
            }

            if ($request->has('date_to')) {
                $query->whereDate('date', '<=', $request->date_to);
            }

            $absences = $query->orderBy('date', 'desc')->get();

            return response()->json($absences);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des absences: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la récupération des absences'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'participant_id' => 'required|exists:participants,id',
                'formation_id' => 'required|exists:formations,id',
                'date' => 'required|date',
                'reason' => 'required|string',
                'status' => 'required|in:justified,unjustified'
            ]);

            $absence = Absence::create($validated);

            DB::commit();
            return response()->json($absence, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur de validation', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la création de l\'absence: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la création de l\'absence'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Absence $absence)
    {
        try {
            return response()->json($absence->load(['participant', 'formation']));
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération de l\'absence: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la récupération de l\'absence'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Absence $absence)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'participant_id' => 'sometimes|required|exists:participants,id',
                'formation_id' => 'sometimes|required|exists:formations,id',
                'date' => 'sometimes|required|date',
                'reason' => 'sometimes|required|string',
                'status' => 'sometimes|required|in:justified,unjustified'
            ]);

            $absence->update($validated);

            DB::commit();
            return response()->json($absence);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur de validation', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la mise à jour de l\'absence: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la mise à jour de l\'absence'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Absence $absence)
    {
        try {
            DB::beginTransaction();
            
            $absence->delete();
            
            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la suppression de l\'absence: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la suppression de l\'absence'], 500);
        }
    }

    /**
     * Get absence statistics.
     */
    public function statistics(Request $request)
    {
        try {
            $query = Absence::query();

            if ($request->has('participant_id')) {
                $query->where('participant_id', $request->participant_id);
            }

            if ($request->has('formation_id')) {
                $query->where('formation_id', $request->formation_id);
            }

            $stats = [
                'total' => $query->count(),
                'justified' => $query->where('status', 'justified')->count(),
                'unjustified' => $query->where('status', 'unjustified')->count(),
                'by_month' => $query->selectRaw('MONTH(date) as month, COUNT(*) as count')
                    ->groupBy('month')
                    ->get()
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des statistiques: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la récupération des statistiques'], 500);
        }
    }
}
