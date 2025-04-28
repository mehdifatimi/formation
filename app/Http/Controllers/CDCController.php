<?php
namespace App\Http\Controllers;

use App\Models\CDC;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CDCController extends Controller
{
    public function index()
    {
        // Cache the results for 5 minutes to improve performance
        $cdcs = Cache::remember('cdcs.all', 300, function () {
            return CDC::select('id', 'nom', 'prenom', 'email', 'telephone')
                     ->orderBy('id')
                     ->get();
        });
        
        return response()->json($cdcs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email',
            'telephone' => 'required|string',
            'drif_id' => 'required|exists:drifs,id'
        ]);

        $cdc = CDC::create($request->all());
        Cache::forget('cdcs.all'); // Clear cache after creating new record
        return response()->json($cdc, 201);
    }

    public function show(CDC $cdc)
    {
        return response()->json($cdc);
    }

    public function update(Request $request, CDC $cdc)
    {
        $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email',
            'telephone' => 'required|string',
            'drif_id' => 'required|exists:drifs,id'
        ]);

        $cdc->update($request->all());
        Cache::forget('cdcs.all'); // Clear cache after update
        return response()->json($cdc);
    }

    public function destroy(CDC $cdc)
    {
        $cdc->delete();
        Cache::forget('cdcs.all'); // Clear cache after deletion
        return response()->json(null, 204);
    }
} 