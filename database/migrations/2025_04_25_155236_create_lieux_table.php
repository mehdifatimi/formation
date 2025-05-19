<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lieux', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('type')->nullable(); // salle de conférence, amphithéâtre, etc.
            $table->integer('capacite')->nullable();
            $table->text('description')->nullable();
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });

        // Modifier la table formations pour ajouter la clé étrangère
        Schema::table('formations', function (Blueprint $table) {
            if (Schema::hasColumn('formations', 'lieu')) {
                $table->dropColumn('lieu'); // Supprimer l'ancien champ
            }
            $table->foreignId('lieu_id')->nullable()->constrained('lieux')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropForeign(['lieu_id']);
            $table->string('lieu')->nullable();
        });
        Schema::dropIfExists('lieux');
    }
};
