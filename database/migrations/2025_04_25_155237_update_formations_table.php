<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('formations', function (Blueprint $table) {
            // Vérifier et supprimer les anciennes colonnes si elles existent
            if (Schema::hasColumn('formations', 'hotel')) {
                $table->dropColumn('hotel');
            }
            if (Schema::hasColumn('formations', 'lieu')) {
                $table->dropColumn('lieu');
            }
            
            // Ajouter les nouvelles colonnes avec les clés étrangères
            if (!Schema::hasColumn('formations', 'hotel_id')) {
                $table->foreignId('hotel_id')->nullable()->constrained('hotels')->nullOnDelete();
            }
            if (!Schema::hasColumn('formations', 'lieu_id')) {
                $table->foreignId('lieu_id')->nullable()->constrained('lieux')->nullOnDelete();
            }
        });
    }

    public function down()
    {
        Schema::table('formations', function (Blueprint $table) {
            // Supprimer les nouvelles colonnes si elles existent
            if (Schema::hasColumn('formations', 'hotel_id')) {
                $table->dropForeign(['hotel_id']);
                $table->dropColumn('hotel_id');
            }
            if (Schema::hasColumn('formations', 'lieu_id')) {
                $table->dropForeign(['lieu_id']);
                $table->dropColumn('lieu_id');
            }
            
            // Restaurer les anciennes colonnes si elles n'existent pas
            if (!Schema::hasColumn('formations', 'hotel')) {
                $table->string('hotel')->nullable();
            }
            if (!Schema::hasColumn('formations', 'lieu')) {
                $table->string('lieu')->nullable();
            }
        });
    }
}; 