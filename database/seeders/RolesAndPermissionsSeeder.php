<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Création des permissions
        $permissions = [
            // Permissions pour les formations
            ['name' => 'Créer des formations', 'slug' => 'create-formations'],
            ['name' => 'Modifier des formations', 'slug' => 'edit-formations'],
            ['name' => 'Supprimer des formations', 'slug' => 'delete-formations'],
            ['name' => 'Valider des formations', 'slug' => 'validate-formations'],
            ['name' => 'Voir les formations', 'slug' => 'view-formations'],
            
            // Permissions pour les absences
            ['name' => 'Gérer les absences', 'slug' => 'manage-absences'],
            
            // Permissions pour les utilisateurs
            ['name' => 'Créer des utilisateurs', 'slug' => 'create-users'],
            ['name' => 'Assigner des rôles', 'slug' => 'assign-roles'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }

        // Création des rôles
        $roles = [
            [
                'name' => 'CDC',
                'slug' => 'responsable_cdc',
                'permissions' => ['create-formations', 'edit-formations', 'view-formations']
            ],
            [
                'name' => 'DRIF',
                'slug' => 'responsable_drif',
                'permissions' => ['create-formations', 'edit-formations', 'delete-formations', 'validate-formations', 'view-formations']
            ],
            [
                'name' => 'Formateur',
                'slug' => 'formateur_animateur',
                'permissions' => ['manage-absences', 'view-formations']
            ],
            [
                'name' => 'Participant',
                'slug' => 'formateur_participant',
                'permissions' => ['view-formations']
            ],
            [
                'name' => 'DR',
                'slug' => 'responsable_dr',
                'permissions' => ['view-formations']
            ],
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'permissions' => ['create-users', 'assign-roles']
            ],
        ];

        foreach ($roles as $roleData) {
            $permissions = $roleData['permissions'];
            unset($roleData['permissions']);
            
            $role = Role::create($roleData);
            $role->permissions()->attach(
                Permission::whereIn('slug', $permissions)->get()
            );
        }
    }
} 