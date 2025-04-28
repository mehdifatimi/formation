<?php
namespace App\Http\Controllers;

use App\Models\DR;
use Illuminate\Http\Request;

class DRController extends Controller
{
    public function index()
    {
        $drs = DR::with('user')->get();
        return response()->json($drs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'idDR' => 'required|unique:drs',
            'idUser' => 'required|exists:users,idUser'
        ]);

        $dr = DR::create($request->all());
        return response()->json($dr, 201);
    }

    public function show(DR $dr)
    {
        return response()->json($dr->load('user'));
    }

    public function update(Request $request, DR $dr)
    {
        $request->validate([
            'idDR' => 'required|unique:drs,idDR,' . $dr->id,
            'idUser' => 'required|exists:users,idUser'
        ]);

        $dr->update($request->all());
        return response()->json($dr);
    }

    public function destroy(DR $dr)
    {
        $dr->delete();
        return response()->json(null, 204);
    }
} 