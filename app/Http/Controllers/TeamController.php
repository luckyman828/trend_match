<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\UserTeam;
use App\TeamInvite;
use App\Http\Resources\TeamInvite as TeamInviteResource;
use App\Team;
use App\Http\Resources\Team as TeamResource;
use App\TaskTeam;
use App\TeamFile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class TeamController extends Controller
{
    public function removeUser(Request $request)
    {
        $user_team = UserTeam::find(['user_id' => $request->user_id, 'team_id' => $request->team_id]);
        if ( $user_team ) {
            $user_team->delete();
            return $user_team;
        }
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
        // First, check if the team already exists
        // $existingTeam = Team::where('title', $request->title)->where('workspace_id', $workspace_id)->first();

        // return $existingTeam;
        
        // $team = ($existingTeam) ? $existingTeam : new Team;
        $team = new Team;
        // return $team;
        
        $team->title = $request->title;
        $team->workspace_id = $workspace_id;

        if($team->save()) {
            return new TeamResource($team);
        }
    }
    public function update(Request $request)
    {
        $team = Team::find($request->id);
        if ($request->title) {
            $team->title = $request->title;
        }
        if ($request->currency) {
            $team->currency = $request->currency;
        }
        if ($request->category_scope) {
            $team->category_scope = $request->category_scope;
        }
        
        if($team->save()) {
            return new TeamResource($team);
        }
    }
    public function insertOrUpdate(Request $request, $id = null)
    {
        if ($id) {
            $existingTeam = Team::find($id);
            $team = $existingTeam;
            $team->id = $id;
        } else {
            $team = new Team;
        }

        $team->workspace_id = $request->team['workspace_id'];
        $team->title = $request->team['title'];
        $team->currency = $request->team['currency'];

        // return $action;

        if($team->save()) {

            return $team;
            // Fire event
            $dataToReturn = new TeamResource($team);
            // broadcast(new ActionUpdated($actionToReturn))->toOthers();
            // broadcast(new ActionUpdated($actionToReturn))->toOthers();

            // return $dataToReturn;
            return json_decode( json_encode($dataToReturn), true);
        }
    }
    public function destroyTeam(Request $request)
    {
        // Find all team specific records

        $team_id = $request->team_id;
        
        $team = Team::find($team_id);
        $files = TeamFile::where('team_id', $team_id);
        $tasks = TaskTeam::where('team_id', $team_id);
        $invites = TeamInvite::where('team_id', $team_id);
        $users = UserTeam::where('team_id', $team_id);
        
        // Use a transaction to make sure all team related records are deleted or none
        DB::transaction(function() use($team, $files, $tasks, $invites, $users) {
            $team->delete();
            $files->delete();
            $tasks->delete();
            $invites->delete();
            $users->delete();
        });

        return 'Deleted team with id: ' . $team_id;
    }

    public function insertOrUpdateUserTeam(Request $request)
    {
        $existingUserTeam = UserTeam::where('user_id', $request->user_id)->where('team_id', $request->team_id)->first();
        $userTeam = $existingUserTeam ? $existingUserTeam : new UserTeam;

        $userTeam->user_id = $request->user_id;
        $userTeam->team_id = $request->team_id;
        $userTeam->permission_level = $request->permission_level;


        if($userTeam->save()) {

            return $userTeam;
            // Fire event
            // $dataToReturn = new UserResource($user);
            // // broadcast(new ActionUpdated($actionToReturn))->toOthers();
            // // broadcast(new ActionUpdated($actionToReturn))->toOthers();

            // // return $dataToReturn;
            // return json_decode( json_encode($dataToReturn), true);
        }
    }

    public function addUsers(Request $request)
    {
        $count = 0;
        $starttime = microtime(true);
        $dataToInsert = [];

        foreach($request->user_ids as $user_id){
            $dataToPush = [
                'team_id' => $request->team_id,
                'user_id' => $user_id,
                'permission_level' => 1,
            ];
            array_push($dataToInsert, $dataToPush);
            $count++;
        }
        $endtime = microtime(true);
        $timediff = $endtime - $starttime;
        UserTeam::insert($dataToInsert);

        return 'Inserted ' . $count . ' records. Time elapsed: ' . $timediff;
    }

}
