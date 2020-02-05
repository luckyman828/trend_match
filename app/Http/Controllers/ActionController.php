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
use Illuminate\Support\Facades\Log;

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
            broadcast(new ActionUpdated($actionToReturn))->toOthers();
            // broadcast(new ActionUpdated($actionToReturn))->toOthers();

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
            broadcast(new ActionUpdated($actionToReturn))->toOthers();
            // broadcast(new ActionUpdated($actionToReturn))->toOthers();

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
            broadcast(new ActionDeleted($actionToReturn))->toOthers();
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
            broadcast(new ActionDeleted($actionToReturn))->toOthers();
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

        // Save a log entry so we can go back and see what happened
        Log::info('Mass action applied by');
        Log::info('Mass action applied by, '.$request->user_id.', for task, '.$request->task_id.', setting '.count($request->product_ids).' products as action: '.$request->action_code);

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

        // Loop theouh the data to insert and send a broadcast a chunk at a time
        $broadcastLimit = 100;
        $dataIndex = 0;
        $dataToBroadcast = [];
        foreach ($dataToInsert as $dataPoint) {
            // Add the currenct datapoint to the data to be broadcast
            array_push($dataToBroadcast, $dataPoint);
            // Increase the dataIndex
            $dataIndex++;
            // Check if we have reaced the broadcast limit
            if ($dataIndex > $broadcastLimit) {
                // Fire event
                broadcast(new ManyActionsCreated($dataToBroadcast))->toOthers();
                // Reset data to broadcast and index
                $dataToBroadcast = [];
                $dataIndex = 0;
            }
        }
        // When done looping through the products to broadcast, broadcast the remaining if we have any
        if ($dataIndex > 0) {
            // Fire event
            broadcast(new ManyActionsCreated($dataToBroadcast))->toOthers();
        }

        return 'Inserted ' . $count . ' records. Time elapsed: ' . $timediff;
    }

    public function updateMany(Request $request)
    {
        $count = sizeof($request->product_ids);
        $starttime = microtime(true);

        Action::whereIn('product_id', $request->product_ids)->where('task_id', $request->task_id)->where('user_id', $request->user_id)->update(['action' => $request->action_code]);

        // Save a log entry so we can go back and see what happened
        Log::info('Mass action applied by');
        Log::info('Mass action applied by, '.$request->user_id.', for task, '.$request->task_id.', setting '.count($request->product_ids).' products as action: '.$request->action_code);

        // Loop theouh the data to insert and send a broadcast a chunk at a time
        $broadcastLimit = 150;
        $dataIndex = 0;
        $dataToBroadcast = [
            "action_code" => $request->all()['action_code'],
            "is_task_action" => $request->all()['is_task_action'],
            "task_id" => $request->all()['task_id'],
            "user_id" => $request->all()['user_id'],
            "product_ids" => []
        ];
        foreach ($request->all()['product_ids'] as $dataPoint) {
            // Add the currenct datapoint to the data to be broadcast
            array_push($dataToBroadcast['product_ids'], $dataPoint);
            // Increase the dataIndex
            $dataIndex++;
            // Check if we have reaced the broadcast limit
            if ($dataIndex > $broadcastLimit) {
                // Fire event
                broadcast(new ManyActionsUpdated($dataToBroadcast))->toOthers();
                // Reset data to broadcast and index
                $dataToBroadcast['product_ids'] = [];
                $dataIndex = 0;
            }
        }
        // When done looping through the products to broadcast, broadcast the remaining if we have any
        if ($dataIndex > 0) {
            // Fire event
            broadcast(new ManyActionsUpdated($dataToBroadcast))->toOthers();
        }

        $endtime = microtime(true);
        $timediff = $endtime - $starttime;
        return 'Updated ' . $count . ' records. Time elapsed: ' . $timediff;
    }
    public function updateManyTask(Request $request)
    {
        $count = sizeof($request->product_ids);
        $starttime = microtime(true);

        Action::whereIn('product_id', $request->product_ids)->where('task_id', $request->task_id)->update(['action' => $request->action_code]);

        // Save a log entry so we can go back and see what happened
        Log::info('Mass action applied by');
        Log::info('Mass action applied by, '.$request->user_id.', for task, '.$request->task_id.', setting '.count($request->product_ids).' products as action: '.$request->action_code);

        // Loop theouh the data to insert and send a broadcast a chunk at a time
        $broadcastLimit = 150;
        $dataIndex = 0;
        $dataToBroadcast = [
            "action_code" => $request->all()['action_code'],
            "is_task_action" => $request->all()['is_task_action'],
            "task_id" => $request->all()['task_id'],
            "user_id" => $request->all()['user_id'],
            "product_ids" => []
        ];
        foreach ($request->all()['product_ids'] as $dataPoint) {
            // Add the currenct datapoint to the data to be broadcast
            array_push($dataToBroadcast['product_ids'], $dataPoint);
            // Increase the dataIndex
            $dataIndex++;
            // Check if we have reaced the broadcast limit
            if ($dataIndex > $broadcastLimit) {
                // Fire event
                // return $dataToBroadcast;
                broadcast(new ManyActionsUpdated($dataToBroadcast))->toOthers();
                // Reset data to broadcast and index
                $dataToBroadcast['product_ids'] = [];
                $dataIndex = 0;
            }
        }
        // When done looping through the products to broadcast, broadcast the remaining if we have any
        if ($dataIndex > 0) {
            // Fire event
            broadcast(new ManyActionsUpdated($dataToBroadcast))->toOthers();
        }

        $endtime = microtime(true);
        $timediff = $endtime - $starttime;
        return 'Updated ' . $count . ' records. Time elapsed: ' . $timediff;
    }

}
