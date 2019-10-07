<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\FileTask;

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
            // $actionToReturn = new ActionResource($action);
            // broadcast(new ActionUpdated($actionToReturn))->toOthers();
            return $fileTask;
        }
    }

    public function undoMarkComplete(Request $request)
    {
        // return $request;
        $existing = FileTask::where('file_id', $request->file_id)->where('task_id', $request->task_id)->first();

        if( $existing->delete() ) {

             // Fire event
            // $actionToReturn = new ActionResource($existingAction);
            // broadcast(new ActionDeleted($actionToReturn))->toOthers();
            return $existing;

        } else {
            return 'nothing found';
        }
    }

}
