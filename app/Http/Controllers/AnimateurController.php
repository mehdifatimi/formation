<?php
namespace App\Http\Controllers;

use App\Models\Animateur;
use Illuminate\Http\Request;

class AnimateurController extends Controller
{
    public function index()
    {
        $animateurs = Animateur::with(['user', 'formations'])->get();
        return response()->json($animateurs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'idAnimateur' => 'required|unique:animateurs',
            'idUser' => 'required|exists:users,idUser'
        ]);

        $animateur = Animateur::create($request->all());
        return response()->json($animateur, 201);
    }

    public function show(Animateur $animateur)
    {
        return response()->json($animateur->load(['user', 'formations']));
    }

    public function update(Request $request, Animateur $animateur)
    {
        $request->validate([
            'idAnimateur' => 'required|unique:animateurs,idAnimateur,' . $animateur->id,
            'idUser' => 'required|exists:users,idUser'
        ]);

        $animateur->update($request->all());
        return response()->json($animateur);
    }

    public function destroy(Animateur $animateur)
    {
        $animateur->delete();
        return response()->json(null, 204);
    }
} 