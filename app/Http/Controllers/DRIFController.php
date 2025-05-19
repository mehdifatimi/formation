<?php
namespace App\Http\Controllers;

use App\Models\DRIF;
use Illuminate\Http\Request;

class DRIFController extends Controller
{
    public function index()
    {
        $drifs = DRIF::with('user')->get();
        return response()->json($drifs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'idDrif' => 'required|unique:drifs',
            'idUser' => 'required|exists:users,idUser'
        ]);

        $drif = DRIF::create($request->all());
        return response()->json($drif, 201);
    }

    public function show(DRIF $drif)
    {
        return response()->json($drif->load('user'));
    }

    public function update(Request $request, DRIF $drif)
    {
        $request->validate([
            'idDrif' => 'required|unique:drifs,idDrif,' . $drif->id,
            'idUser' => 'required|exists:users,idUser'
        ]);

        $drif->update($request->all());
        return response()->json($drif);
    }

    public function destroy(DRIF $drif)
    {
        $drif->delete();
        return response()->json(null, 204);
    }
} 