<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClubhouseController extends Controller
{
    public function index (Request $request) {
        // $data = $request->actions;
        $data = $request;
        // Workflow state IDs:
        $api_token = '5d6a53ac-fa5e-4543-a87e-48a02855ae3c';
        $designReadyForDevId = 500000034;
        $devReadyForDevId = 500000031;
        Log::info($data);
        if ($data->actions[0]['changes']['workflow_state_id']['new'] == $designReadyForDevId)
            Log::info('It is true');
        else
            Log::info('It is false');
    }
}

}
