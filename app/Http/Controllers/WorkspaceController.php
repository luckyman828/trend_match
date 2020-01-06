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
use App\FileTask;
Use App\Http\Resources\Collection as CollectionResource;
use App\Catalogue as Folder;
Use App\Http\Resources\Catalogue as FolderResource;
use App\User;
use App\Http\Resources\User as UserResource;
use App\TeamFile;
use App\Http\Resources\TeamFile as TeamFileResource;
use App\Phase;
use App\PhaseTeam;
use App\Task;
use App\TaskParent;
use App\TaskTeam;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

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

    // Return all workspaceUsers available to the logged in user
    public function cacheCurrentWorkspace(Request $request)
    {
        // $request->session()->put('key', 'value');
        // session(['key' => 'value']);
        // Log::info('Workspace controller sessions:');
        // Log::info(session()->all());
        Cache::put('user_'.$request->user_id.'_currentWorkspaceId', $request->workspace_id, 86400);
        // Cache::put('token_'.session('token').'_currentWorkspaceId', $request->workspace_id, 86400);
    }

    // Reutrn all teams of the workspace
    public function teams($workspace_id)
    {
        $teams = Team::where('workspace_id', $workspace_id)->get();

        // Return collection of users as a resource
        return TeamResource::collection($teams);
    }

    // Return all folders of the workspace
    public function folders($workspace_id)
    {
        $folders = Folder::where('workspace_id', $workspace_id)->get();

        // Return collection of products as a resource
        return FolderResource::collection($folders);
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

    // Return all users of the workspace
    public function users($workspace_id)
    {
        $users = User::whereHas('workspaces', function (Builder $query) use($workspace_id) {
            $query->where('id', $workspace_id);
        })->get();

        // Return collection of users as a resource
        return UserResource::collection($users);
    }

    // Return all phases of the workspace
    public function phases($workspace_id)
    {
        $phases = Phase::where('workspace_id', $workspace_id)->get();

        return $phases;
    }

    // Return all phase teams of the workspace
    public function phaseTeams($workspace_id)
    {
        $phaseTeams = PhaseTeam::whereHas('phase', function (Builder $query) use($workspace_id) {
            $query->where('workspace_id', $workspace_id);
        })->get();

        return $phaseTeams;
    }

    // Return all tasks of the workspace
    public function tasks($workspace_id)
    {
        $tasks = Task::whereHas('phase', function (Builder $query) use($workspace_id) {
            $query->where('workspace_id', $workspace_id);
        })->get();

        return $tasks;
    }

     // Return task structure for workspace
     public function taskParents($workspace_id)
     {
        //  $taskTasks = TaskTask::all();
         $result = TaskParent::whereHas('phase', function (Builder $query) use($workspace_id) {
             $query->where('workspace_id', $workspace_id);
         })->get();
 
         return $result;
    }

    // Return task structure for workspace
    public function taskTeams($workspace_id)
    {
        $result = TaskTeam::whereHas('team', function (Builder $query) use($workspace_id) {
            $query->where('workspace_id', $workspace_id);
        })->get();

        return $result;
   }

   // Return task structure for workspace
   public function fileTasks($workspace_id)
   {
       $result = FileTask::whereHas('file', function (Builder $query) use($workspace_id) {
           $query->where('workspace_id', $workspace_id);
       })->get();

       return $result;
  }

}