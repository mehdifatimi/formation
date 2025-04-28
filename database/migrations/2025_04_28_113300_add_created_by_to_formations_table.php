<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('formations', function (Blueprint $table) {
            if (!Schema::hasColumn('formations', 'created_by')) {
                $table->foreignId('created_by')
                    ->default(1)
                    ->constrained('users')
                    ->onDelete('cascade');
            }
        });
    }

    public function down()
    {
        Schema::table('formations', function (Blueprint $table) {
            if (Schema::hasColumn('formations', 'created_by')) {
                $table->dropForeign(['created_by']);
                $table->dropColumn('created_by');
            }
        });
    }
}; 