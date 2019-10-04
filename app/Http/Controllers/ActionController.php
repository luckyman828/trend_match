<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Action;
use App\Events\ActionDeleted;
use App\Events\ActionUpdated;
use App\Events\ManyActionsCreated;
use App\Events\ManyActionsUpdated;
Use App\Http\Resources\Action as ActionResource;
use Illuminate\Support\Facades\DB;

class ActionController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $existingAction = Action::where('product_id', $request->product_id)->where('task_id', $request->task_id)->where('user_id', $request->user_id)->first();
        // return $request;

        $action = ($existingAction) ? $existingAction : new Action;

        $action->user_id = $request->user_id;
        $action->task_id = $request->task_id;
        $action->product_id = $request->product_id;
        $action->action = $request->action_code;
        $action->is_task_action = $request->is_task_action;

        // return $action;

        if($action->save()) {

            // Fire event
            $actionToReturn = new ActionResource($action);
            event(new ActionUpdated($actionToReturn));

            return $actionToReturn;
        }
    }

    public function storeTask(Request $request)
    {
        $existingAction = Action::where('product_id', $request->product_id)->where('task_id', $request->task_id)->first();
        // return $request;

        $action = ($existingAction) ? $existingAction : new Action;

        $action->user_id = $request->user_id;
        $action->task_id = $request->task_id;
        $action->product_id = $request->product_id;
        $action->action = $request->action_code;
        $action->is_task_action = $request->is_task_action;

        // return $action;

        if($action->save()) {

            // Fire event
            $actionToReturn = new ActionResource($action);
            event(new ActionUpdated($actionToReturn));

            return $actionToReturn;
        }
    }

    public function destroy(Request $request)
    {
        // First, check if an action for the following product and user already exists
        $existingAction = Action::where('product_id', $request->product_id)->where('task_id', $request->task_id)->where('user_id', $request->user_id)->first();

        if( $existingAction->delete() ) {

             // Fire event
            $actionToReturn = new ActionResource($existingAction);
            event(new ActionDeleted($actionToReturn));
            return $actionToReturn;

        } else {
            return 'nothing found';
        }
    }
    public function destroyTask(Request $request)
    {
        $existingAction = Action::where([['product_id', $request->product_id], ['task_id', $request->task_id]])->first();

        if( Action::where([['product_id', $request->product_id], ['task_id', $request->task_id]])->delete() ) {

            // Fire event
            $actionToReturn = new ActionResource($existingAction);
            event(new ActionDeleted($actionToReturn));
            return $actionToReturn;

        } else {
            return 'nothing found';
        }
    }

    public function storeMany(Request $request)
    {
        $count = 0;
        $starttime = microtime(true);
        $dataToInsert = [];

        foreach($request->product_ids as $product_id){
            $dataToPush = [
                'product_id' => $product_id,
                'task_id' => $request->task_id,
                'user_id' => $request->user_id,
                'action' => $request->action_code,
                'is_task_action' => $request->is_task_action,
            ];
            array_push($dataToInsert, $dataToPush);
            $count++;
        }
        $endtime = microtime(true);
        $timediff = $endtime - $starttime;
        Action::insert($dataToInsert);

        // Fire event
        event(new ManyActionsCreated($dataToInsert));

        return 'Inserted ' . $count . ' records. Time elapsed: ' . $timediff;
    }

    public function updateMany(Request $request)
    {
        $count = sizeof($request->product_ids);
        $starttime = microtime(true);

        Action::whereIn('product_id', $request->product_ids)->where('task_id', $request->task_id)->where('user_id', $request->user_id)->update(['action' => $request->action_code]);

        // Fire event
        event(new ManyActionsUpdated($request->all()));

        $endtime = microtime(true);
        $timediff = $endtime - $starttime;
        return 'Updated ' . $count . ' records. Time elapsed: ' . $timediff;
    }
    public function updateManyTask(Request $request)
    {
        $count = sizeof($request->product_ids);
        $starttime = microtime(true);

        Action::whereIn('product_id', $request->product_ids)->where('task_id', $request->task_id)->update(['action' => $request->action_code]);

        // Fire event
        event(new ManyActionsUpdated($request->all()));

        $endtime = microtime(true);
        $timediff = $endtime - $starttime;
        return 'Updated ' . $count . ' records. Time elapsed: ' . $timediff;
    }

}
