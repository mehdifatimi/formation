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
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('adresse')->nullable();
            $table->string('ville')->nullable();
            $table->string('telephone')->nullable();
            $table->text('description')->nullable();
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });

        // Modifier la table formations pour ajouter la clé étrangère
        Schema::table('formations', function (Blueprint $table) {
            $table->dropColumn('hotel'); // Supprimer l'ancien champ
            $table->foreignId('hotel_id')->nullable()->constrained('hotels')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->string('hotel')->nullable();
        });
        Schema::dropIfExists('hotels');
    }
};
