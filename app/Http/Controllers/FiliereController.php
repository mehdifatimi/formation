<?php
namespace App\Http\Controllers;

use App\Models\Filiere;
use Illuminate\Http\Request;

class FiliereController extends Controller
{
    public function index()
    {
        $filieres = Filiere::with('cdc')->get();
        return response()->json($filieres);
    }

    public function store(Request $request)
    {
        $request->validate([
            'idFiliere' => 'required|unique:filieres',
            'idCdc' => 'required|exists:cdcs,idCdc'
        ]);

        $filiere = Filiere::create($request->all());
        return response()->json($filiere, 201);
    }

    public function show(Filiere $filiere)
    {
        return response()->json($filiere->load('cdc'));
    }

    public function update(Request $request, Filiere $filiere)
    {
        $request->validate([
            'idFiliere' => 'required|unique:filieres,idFiliere,' . $filiere->id,
            'idCdc' => 'required|exists:cdcs,idCdc'
        ]);

        $filiere->update($request->all());
        return response()->json($filiere);
    }

    public function destroy(Filiere $filiere)
    {
        $filiere->delete();
        return response()->json(null, 204);
    }
} 