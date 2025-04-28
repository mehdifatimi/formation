<?php

namespace App\Http\Controllers;

abstract class Controller
{
    protected function jsonResponse($data, $status = 200)
    {
        return response()->json($data, $status);
    }
}
