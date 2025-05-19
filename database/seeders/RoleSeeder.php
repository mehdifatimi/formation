<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Création des rôles de base
        $roles = [
            [
                'name' => 'Administrateur',
                'slug' => 'admin',
                'description' => 'Administrateur du système'
            ],
            [
                'name' => 'Formateur/Animateur',
                'slug' => 'formateur_animateur',
                'description' => 'Formateur qui anime les formations'
            ],
            [
                'name' => 'Formateur/Participant',
                'slug' => 'formateur_participant',
                'description' => 'Formateur qui participe aux formations'
            ]
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
