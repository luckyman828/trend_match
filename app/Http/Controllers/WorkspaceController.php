<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Workspace;
Use App\Http\Resources\Workspace as WorkspaceResource;
use App\WorkspaceUser;
Use App\Http\Resources\WorkspaceUser as WorkspaceUserResource;
use App\Team;
use App\Http\Resources\Team as TeamResource;
use App\Collection;
Use App\Http\Resources\Collection as CollectionResource;
use App\User;
use App\Http\Resources\User as UserResource;
use App\TeamFile;
use App\Http\Resources\TeamFile as TeamFileResource;
use Illuminate\Database\Eloquent\Builder;

class WorkspaceController extends Controller
{
    // Return all workspaces available to the logged in user
    public function workspaces()
    {
        $workspaces = Workspace::get();
        // Return collection of products as a resource
        return WorkspaceResource::collection($workspaces);
    }

    // Return all workspaceUsers available to the logged in user
    public function workspaceUsers()
    {
        $workspaceUsers = WorkspaceUser::get();
        // Return collection of products as a resource
        return WorkspaceUserResource::collection($workspaceUsers);
    }

    // Reutrn all teams of the workspace
    public function teams($workspace_id)
    {
        $teams = Team::where('workspace_id', $workspace_id)->get();

        // Return collection of users as a resource
        return TeamResource::collection($teams);
    }

    // Return all collections of the workspace
    public function files($workspace_id)
    {
        $files = Collection::where('workspace_id', $workspace_id)->get();

        // Return collection of products as a resource
        return CollectionResource::collection($files);
    }

    // Return all team files of the workspace
    public function teamFiles($workspace_id)
    {
        $teamFiles = TeamFile::whereHas('team', function (Builder $query) use($workspace_id) {
            $query->where('workspace_id', $workspace_id);
        })->get();

        return TeamFileResource::collection($teamFiles);
    }

    // Return all users with access to the specified collection
    public function users($workspace_id)
    {
        $users = User::whereHas('workspaces', function (Builder $query) use($workspace_id) {
            $query->where('id', $workspace_id);
        })->get();

        // Return collection of users as a resource
        return UserResource::collection($users);
    }

}