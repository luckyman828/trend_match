<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TeamInvite;
use App\Http\Resources\TeamInvite as TeamInviteResource;

class InviteController extends Controller
{
    public function index()
    {
        $team_invites = TeamInvite::get();

        // Return collection of users as a resource
        return TeamInviteResource::collection($team_invites);
    }

    public function destroy(Request $request)
    {
        $team_invite = TeamInvite::find(['email' => $request->email, 'team_id' => $request->team_id]);
        if ( $team_invite ) {
            $team_invite->delete();
            return "succes";
        }
        else return $request;
    }
}
