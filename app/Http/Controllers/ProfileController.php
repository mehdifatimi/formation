<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        try {
            $user = $request->user();
            
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
                'phone' => ['nullable', 'string', 'max:20'],
                'current_password' => ['nullable', 'required_with:new_password', 'string'],
                'new_password' => ['nullable', 'string', 'min:8', 'confirmed'],
            ]);

            // Mise à jour des informations de base
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            if (isset($validated['phone'])) {
                $user->phone = $validated['phone'];
            }

            // Mise à jour du mot de passe si fourni
            if (!empty($validated['current_password'])) {
                if (!Hash::check($validated['current_password'], $user->password)) {
                    return response()->json([
                        'message' => 'Le mot de passe actuel est incorrect'
                    ], 422);
                }
                $user->password = Hash::make($validated['new_password']);
            }

            $user->save();

            return response()->json([
                'message' => 'Profil mis à jour avec succès',
                'user' => $user
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur lors de la mise à jour du profil: ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue lors de la mise à jour du profil'
            ], 500);
        }
    }

    public function show(Request $request)
    {
        try {
            $user = $request->user();
            return response()->json($user);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la récupération du profil: ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue lors de la récupération du profil'
            ], 500);
        }
    }
} 