<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    public function handle(Request $request, Closure $next, $permission)
    {
        if (!$request->user() || !$request->user()->hasPermission($permission)) {
            return response()->json([
                'message' => 'Vous n\'avez pas la permission d\'effectuer cette action.'
            ], 403);
        }

        return $next($request);
    }
} 