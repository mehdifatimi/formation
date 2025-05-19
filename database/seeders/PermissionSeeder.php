<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            [
                'name' => 'Gérer les formations',
                'slug' => 'manage-formations',
                'description' => 'Permet de créer, modifier et supprimer des formations'
            ],
            [
                'name' => 'Valider les formations',
                'slug' => 'validate-formations',
                'description' => 'Permet de valider ou rejeter des formations'
            ],
            [
                'name' => 'Gérer les formateurs',
                'slug' => 'manage-formateurs',
                'description' => 'Permet de gérer les formateurs'
            ],
            [
                'name' => 'Gérer les participants',
                'slug' => 'manage-participants',
                'description' => 'Permet de gérer les participants'
            ]
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
} 