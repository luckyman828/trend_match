<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Action;
Use App\Http\Resources\Action as ActionResource;
use Illuminate\Support\Facades\DB;
use App\ProductFinalAction;
Use App\Http\Resources\ProductFinalAction as ProductFinalActionResource;
use App\TeamProduct;
Use App\Http\Resources\TeamProduct as TeamProductResource;
use App\PhaseProduct;
Use App\Http\Resources\PhaseProduct as PhaseProductResource;

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
            return new ActionResource($action);
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
            return new ActionResource($action);
        }
    }

    public function destroy(Request $request)
    {
        // First, check if an action for the following product and user already exists
        $existingAction = Action::where('product_id', $request->product_id)->where('task_id', $request->task_id)->where('user_id', $request->user_id)->first();

        if( $existingAction->delete() ) {
            return new ActionResource($existingAction);
        } else {
            return 'nothing found';
        }
    }
    public function destroyTask(Request $request)
    {
        if( Action::where([['product_id', $request->product_id], ['task_id', $request->task_id]])->delete() ) {
            return $request;
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
        return 'Inserted ' . $count . ' records. Time elapsed: ' . $timediff;
    }

    public function updateMany(Request $request)
    {
        $count = sizeof($request->product_ids);
        $starttime = microtime(true);

        Action::whereIn('product_id', $request->product_ids)->where('task_id', $request->task_id)->where('user_id', $request->user_id)->update(['action' => $request->action_code]);
        $endtime = microtime(true);
        $timediff = $endtime - $starttime;
        return 'Updated ' . $count . ' records. Time elapsed: ' . $timediff;
    }
    public function updateManyTask(Request $request)
    {
        $count = sizeof($request->product_ids);
        $starttime = microtime(true);

        Action::whereIn('product_id', $request->product_ids)->where('task_id', $request->task_id)->update(['action' => $request->action_code]);
        $endtime = microtime(true);
        $timediff = $endtime - $starttime;
        return 'Updated ' . $count . ' records. Time elapsed: ' . $timediff;
    }

}
