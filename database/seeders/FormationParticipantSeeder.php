<?php

namespace Database\Seeders;

use App\Models\Formation;
use App\Models\Participant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FormationParticipantSeeder extends Seeder
{
    public function run()
    {
        // Récupérer toutes les formations et participants
        $formations = Formation::all();
        $participants = Participant::all();

        if ($formations->isEmpty() || $participants->isEmpty()) {
            return;
        }

        foreach ($formations as $formation) {
            // Prendre 2 participants aléatoires pour chaque formation
            $selectedParticipants = $participants->random(min(2, $participants->count()));
            
            foreach ($selectedParticipants as $participant) {
                try {
                    DB::table('formation_participant')->insert([
                        'formation_id' => $formation->id,
                        'participant_id' => $participant->id,
                        'statut' => 'en_attente',
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                } catch (\Exception $e) {
                    // Log l'erreur mais continue l'exécution
                    \Log::error("Erreur lors de l'insertion formation_participant: " . $e->getMessage());
                }
            }
        }
    }
}
