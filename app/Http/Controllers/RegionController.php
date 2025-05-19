<?php
namespace App\Http\Controllers;

use App\Models\Region;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function index()
    {
        $regions = Region::with('villes')->get();
        return response()->json($regions);
    }

    public function create()
    {
        return view('regions.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $region = Region::create($request->all());
        return response()->json($region, 201);
    }

    public function show(Region $region)
    {
        return response()->json($region->load('villes'));
    }

    public function edit(Region $region)
    {
        return view('regions.edit', compact('region'));
    }

    public function update(Request $request, Region $region)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $region->update($request->all());
        return response()->json($region);
    }

    public function destroy(Region $region)
    {
        $region->delete();
        return response()->json(null, 204);
    }
} 