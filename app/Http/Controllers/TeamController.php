<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\UserTeam;
use App\TeamInvite;
use App\Http\Resources\TeamInvite as TeamInviteResource;
use App\Team;
use App\Http\Resources\Team as TeamResource;
use Illuminate\Database\Eloquent\Builder;

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

    public function invites($workspace_id)
    {

        $team_invites = TeamInvite::whereHas('team', function (Builder $query) use($workspace_id) {
            $query->where('workspace_id', $workspace_id);
        })->get();

        // Return collection of users as a resource
        return TeamInviteResource::collection($team_invites);
    }

    public function store(Request $request, $workspace_id)
    {
        // First, check if an action for the following product and phase already exists
        $existingTeam = Team::where('title', $request->title)->where('workspace_id', $workspace_id)->first();

        $team = ($existingTeam) ? $existingTeam : new Team;
        
        $team->title = $request->title;
        $team->workspace_id = $workspace_id;

        if($team->save()) {
            return new TeamResource($team);
        }
    }

}
