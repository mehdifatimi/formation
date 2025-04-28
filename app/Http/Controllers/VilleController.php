<?php

namespace App\Http\Controllers;

use App\Models\Ville;
use App\Models\Region;
use Illuminate\Http\Request;

class VilleController extends Controller
{
    public function index()
    {
        $villes = Ville::with(['region', 'formations'])->get();
        return response()->json($villes);
    }

    public function create()
    {
        $regions = Region::all();
        return view('villes.create', compact('regions'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'region_id' => 'required|exists:regions,id',
            'nom' => 'required|string|max:255',
        ]);

        $ville = Ville::create($request->all());
        return response()->json($ville, 201);
    }

    public function show(Ville $ville)
    {
        return response()->json($ville->load(['region', 'formations']));
    }

    public function edit(Ville $ville)
    {
        $regions = Region::all();
        return view('villes.edit', compact('ville', 'regions'));
    }

    public function update(Request $request, Ville $ville)
    {
        $request->validate([
            'region_id' => 'required|exists:regions,id',
            'nom' => 'required|string|max:255',
        ]);

        $ville->update($request->all());
        return response()->json($ville);
    }

    public function destroy(Ville $ville)
    {
        $ville->delete();
        return response()->json(null, 204);
    }
} 