<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('permission:assign-roles');
    }

    public function index()
    {
        $roles = Role::with('permissions')->get();
        return response()->json($roles);
    }

    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|exists:roles,slug'
        ]);

        $user->giveRoleTo($request->role);

        return response()->json([
            'message' => 'Rôle assigné avec succès',
            'user' => $user->load('roles')
        ]);
    }

    public function removeRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|exists:roles,slug'
        ]);

        $user->removeRole($request->role);

        return response()->json([
            'message' => 'Rôle retiré avec succès',
            'user' => $user->load('roles')
        ]);
    }

    public function syncRoles(Request $request, User $user)
    {
        $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,slug'
        ]);

        $user->syncRoles($request->roles);

        return response()->json([
            'message' => 'Rôles synchronisés avec succès',
            'user' => $user->load('roles')
        ]);
    }
} 