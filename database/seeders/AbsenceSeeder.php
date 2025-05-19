<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Formation;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AbsenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les participants
        $participants = User::where('role', 'participant')->get();
        
        if ($participants->isEmpty()) {
            $this->command->info('Aucun participant trouvé. Veuillez exécuter UserSeeder d\'abord.');
            return;
        }
        
        // Récupérer les formations
        $formations = Formation::all();
        
        if ($formations->isEmpty()) {
            $this->command->info('Aucune formation trouvée. Veuillez exécuter FormationSeeder d\'abord.');
            return;
        }
        
        // Créer des absences pour certains participants
        foreach ($participants as $participant) {
            // Sélectionner aléatoirement 1 à 3 formations pour ce participant
            $nombreFormations = rand(1, 3);
            $formationsSelectionnees = $formations->random(min($nombreFormations, $formations->count()));
            
            foreach ($formationsSelectionnees as $formation) {
                // Vérifier si le participant est inscrit à cette formation
                $inscrit = DB::table('formation_participant')
                    ->where('formation_id', $formation->id)
                    ->where('participant_id', $participant->id)
                    ->exists();
                
                if ($inscrit) {
                    // Créer 1 à 3 absences pour cette formation
                    $nombreAbsences = rand(1, 3);
                    
                    for ($i = 0; $i < $nombreAbsences; $i++) {
                        // Générer une date d'absence entre la date de début et la date de fin de la formation
                        $dateDebut = Carbon::parse($formation->date_debut);
                        $dateFin = Carbon::parse($formation->date_fin);
                        
                        if ($dateDebut->lt($dateFin)) {
                            $jours = $dateDebut->diffInDays($dateFin);
                            $dateAbsence = $dateDebut->copy()->addDays(rand(0, $jours))->format('Y-m-d');
                            
                            // Motifs d'absence possibles
                            $motifs = [
                                'Maladie',
                                'Rendez-vous médical',
                                'Problème de transport',
                                'Raison personnelle',
                                'Autre engagement professionnel',
                            ];
                            
                            $motif = $motifs[array_rand($motifs)];
                            
                            // Statuts possibles
                            $statuts = ['en_attente', 'justifiee', 'non_justifiee'];
                            $statut = $statuts[array_rand($statuts)];
                            
                            // Commentaire optionnel
                            $commentaire = $statut === 'justifiee' ? 'Justificatif fourni' : null;
                            
                            // Vérifier si l'absence existe déjà
                            $existe = DB::table('absences')
                                ->where('formation_id', $formation->id)
                                ->where('participant_id', $participant->id)
                                ->where('date', $dateAbsence)
                                ->exists();
                            
                            if (!$existe) {
                                DB::table('absences')->insert([
                                    'formation_id' => $formation->id,
                                    'participant_id' => $participant->id,
                                    'date' => $dateAbsence,
                                    'motif' => $motif,
                                    'statut' => $statut,
                                    'commentaire' => $commentaire,
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                ]);
                            }
                        }
                    }
                }
            }
        }
    }
}
