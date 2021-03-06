<?php

namespace App\Http\Controllers;

use App\Collection;
use App\Comment;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use App\Events\TaskCompleted;
use App\Events\TaskUncompleted;

use App\FileTask;
use App\Http\Resources\FileTask as FileTaskResource;
use App\UserTeam;
use App\Task;
use App\User;

class TaskController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function markComplete(Request $request)
    {
        $existing = FileTask::where('file_id', $request->file_id)->where('task_id', $request->task_id)->first();

        $fileTask = ($existing) ? $existing : new FileTask;

        $fileTask->file_id = $request->file_id;
        $fileTask->task_id = $request->task_id;

        if($fileTask->save()) {

            // Fire event
            $fileTaskToBroadcast = new FileTaskResource($fileTask);
            broadcast(new TaskCompleted($fileTaskToBroadcast))->toOthers();
            return $fileTask;
        }
    }

    public function undoMarkComplete(Request $request)
    {
        // return $request;
        $existing = FileTask::where('file_id', $request->file_id)->where('task_id', $request->task_id)->first();

        if( $existing->delete() ) {

            // Fire event
            $fileTaskToBroadcast = new FileTaskResource($existing);
            broadcast(new TaskUncompleted($fileTaskToBroadcast))->toOthers();
            return $existing;

        } else {
            return 'nothing found';
        }
    }

    public function feedbackStatus(Request $request)
    {
        // Request: (workspace_id, file_ids, user_id)
        // return $request;
        
        $workspace_id = $request->workspace_id;
        $file_ids = $request->file_ids;
        $user_id = $request->user_id;
        $user = User::find($user_id);
        $user_teams = UserTeam::where('user_id', $user_id)->get();
        $user_tasks = [];
        $dataToReturn = [];
 

        $tasks = Task::with('taskTeams')->with('fileTasks')->where('type', 'feedback')->whereHas('phase', function (Builder $query) use($workspace_id) {
            $query->where('workspace_id', $workspace_id);
        })->get();

        foreach ($user_teams as $team) {
            foreach ($tasks as $task) {
                $hasAccess = false;
                foreach($task->taskTeams as $task_team) {
                    // array_push($user_tasks, $team->team_id);
                    if ($team->team_id == $task_team->team_id) {
                        $hasAccess = true;
                    }
                }
                if ( $hasAccess ) array_push($user_tasks, $task);
            }
        }

        foreach ($file_ids as $file_id) {
            $pushWithAccess = false;
            $taskToPush = null;
            if (count(Array($user_tasks)) > 0) {
                foreach($user_tasks as $user_task) {
                    $file = Collection::find($file_id);
                    if ($file->phase == $user_task->phase_id) {
                        $pushWithAccess = true;
                        $taskToPush = $user_task->id;
                    }

                    // Check if the task has been completed
                    if (count($user_task->fileTasks) > 0) {

                        foreach($user_task->fileTasks as $file_task) {
                            // array_push($dataToReturn, $file_task);
                            if ($file_task->file_id == $file_id) {
                                $pushWithAccess = false;
                            }
                        }
                    }
                }
            }
            if ($pushWithAccess) {
                array_push($dataToReturn, ['task_id' => $taskToPush, 'file_id' => $file_id, 'has_access' => true]);
            } else {
                array_push($dataToReturn, ['task_id' => $taskToPush, 'file_id' => $file_id, 'has_access' => false]);
            }
        }

        return $dataToReturn;

        
    }

}
