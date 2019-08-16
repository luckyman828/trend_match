<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\UserTeam;

class TeamController extends Controller
{
    // public function index()
    // {
    //     $team_invites = TeamInvite::get();

    //     // Return collection of users as a resource
    //     return TeamInviteResource::collection($team_invites);
    // }

    public function destroy(Request $request)
    {
        $user_team = UserTeam::find(['user_id' => $request->user_id, 'team_id' => $request->team_id]);
        if ( $user_team ) {
            $user_team->delete();
            return "succes";
        }
        else return $request;
    }
}
