<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description');
            $table->dateTime('date_debut');
            $table->dateTime('date_fin');
            $table->foreignId('formateur_id')->constrained('users');
            $table->integer('places_disponibles');
            $table->string('hotel')->nullable();
            $table->string('lieu')->nullable();
            $table->string('statut')->default('en_attente');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('formations');
    }
}; 