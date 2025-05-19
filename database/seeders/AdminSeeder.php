<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        // Création des permissions pour l'administrateur
        $adminPermissions = [
            // Permissions pour les formations
            ['name' => 'Créer des formations', 'slug' => 'create-formations'],
            ['name' => 'Modifier des formations', 'slug' => 'edit-formations'],
            ['name' => 'Supprimer des formations', 'slug' => 'delete-formations'],
            ['name' => 'Voir les formations', 'slug' => 'view-formations'],
            
            // Permissions pour les formateurs
            ['name' => 'Créer des formateurs', 'slug' => 'create-formateurs'],
            ['name' => 'Modifier des formateurs', 'slug' => 'edit-formateurs'],
            ['name' => 'Supprimer des formateurs', 'slug' => 'delete-formateurs'],
            ['name' => 'Voir les formateurs', 'slug' => 'view-formateurs'],
            
            // Permissions pour les participants
            ['name' => 'Créer des participants', 'slug' => 'create-participants'],
            ['name' => 'Modifier des participants', 'slug' => 'edit-participants'],
            ['name' => 'Supprimer des participants', 'slug' => 'delete-participants'],
            ['name' => 'Voir les participants', 'slug' => 'view-participants'],
            
            // Permissions pour les absences
            ['name' => 'Gérer les absences', 'slug' => 'manage-absences'],
            
            // Permissions pour les utilisateurs
            ['name' => 'Créer des utilisateurs', 'slug' => 'create-users'],
            ['name' => 'Assigner des rôles', 'slug' => 'assign-roles'],
        ];

        // Création ou mise à jour des permissions
        foreach ($adminPermissions as $permission) {
            Permission::updateOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }

        // Création ou mise à jour du rôle Admin
        $adminRole = Role::updateOrCreate(
            ['slug' => 'admin'],
            [
                'name' => 'Admin',
                'description' => 'Administrateur du système avec tous les droits'
            ]
        );

        // Attribution de toutes les permissions au rôle Admin
        $adminRole->permissions()->sync(
            Permission::whereIn('slug', array_column($adminPermissions, 'slug'))->get()
        );

        // Création du compte administrateur
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrateur',
                'password' => Hash::make('admin123'),
                'role' => 'admin'
            ]
        );

        // Attribution du rôle Admin à l'utilisateur
        $admin->syncRoles([$adminRole]);

        $this->command->info('Compte administrateur créé avec succès !');
        $this->command->info('Email: admin@example.com');
        $this->command->info('Mot de passe: admin123');
    }
} 