<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run()
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin2@example.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin'
            ],
            [
                'name' => 'CDC User',
                'email' => 'cdc2@example.com',
                'password' => Hash::make('cdc123'),
                'role' => 'responsable_cdc'
            ],
            [
                'name' => 'DRIF User',
                'email' => 'drif2@example.com',
                'password' => Hash::make('drif123'),
                'role' => 'responsable_drif'
            ],
            [
                'name' => 'DR User',
                'email' => 'dr2@example.com',
                'password' => Hash::make('dr123'),
                'role' => 'responsable_dr'
            ],
            [
                'name' => 'Formateur User',
                'email' => 'formateur2@example.com',
                'password' => Hash::make('formateur123'),
                'role' => 'formateur_animateur'
            ],
            [
                'name' => 'Participant User',
                'email' => 'participant2@example.com',
                'password' => Hash::make('participant123'),
                'role' => 'formateur_participant'
            ]
        ];

        foreach ($users as $userData) {
            $role = $userData['role'];
            unset($userData['role']);
            
            $user = User::create($userData);
            $user->giveRoleTo($role);
        }
    }
} 