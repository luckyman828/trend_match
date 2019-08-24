<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Action;
Use App\Http\Resources\Action as ActionResource;
use Illuminate\Support\Facades\DB;
use App\ProductFinalAction;
Use App\Http\Resources\ProductFinalAction as ProductFinalActionResource;

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
        $existingAction = Action::where('product_id', $request->product_id)->where('user_id', $request->user_id)->first();
        // return $request;

        $action = ($existingAction) ? $existingAction : new Action;

        $action->user_id = $request->user_id;
        $action->product_id = $request->product_id;
        $action->action = $request->action_code;

        // return $action;

        if($action->save()) {
            return new ActionResource($action);
        }
    }

    public function storeFinal(Request $request)
    {
        // First, check if an action for the following product and phase already exists
        $existingFinalAction = ProductFinalAction::where('product_id', $request->product_id)->where('phase', $request->phase)->first();

        $finalAction = ($existingFinalAction) ? $existingFinalAction : new ProductFinalAction;
        
        $finalAction->phase = $request->input('phase');
        $finalAction->product_id = $request->input('product_id');
        $finalAction->action = $request->input('action_code');

        if($finalAction->save()) {
            return new ProductFinalActionResource($finalAction);
        }

    }

    public function destroy(Request $request)
    {
        // First, check if an action for the following product and user already exists
        $existingAction = Action::where('product_id', $request->product_id)->where('user_id', $request->user_id)->first();

        if( $existingAction->delete() ) {
            return new ActionResource($existingAction);
        } else {
            return 'nothing found';
        }
    }

    public function destroyFinal(Request $request)
    {
        // First, check if an action for the following product and phase already exists
        $existingFinalAction = ProductFinalAction::where('product_id', $request->product_id)->where('phase', $request->phase)->first();

        if( $existingFinalAction->delete() ) {
            return new ProductFinalActionResource($existingFinalAction);
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
            // Check if the action already exists
            // $existingAction = Action::where('product_id', $product_id)->where('phase', $request->phase)->first();
            // $finalAction = ($existingFinalAction) ? $existingFinalAction : new ProductFinalAction;
            
            $dataToPush = [
                'product_id' => $product_id,
                'user_id' => $request->user_id,
                'action' => $request->action_code,
            ];
            array_push($dataToInsert, $dataToPush);
            $count++;
        }
        $endtime = microtime(true);
        $timediff = $endtime - $starttime;
        Action::insert($dataToInsert);
        return 'Inserted ' . $count . ' records. Time elapsed: ' . $timediff;

    }

    public function storeManyFinal(Request $request)
    {

        $count = 0;
        $starttime = microtime(true);
        $dataToInsert = [];

        foreach($request->product_ids as $product_id){
            // Check if the action already exists
            // $existingFinalAction = ProductFinalAction::where('product_id', $product_id)->where('phase', $request->phase)->first();
            // $finalAction = ($existingFinalAction) ? $existingFinalAction : new ProductFinalAction;
            
            $dataToPush = [
                'product_id' => $product_id,
                'phase' => $request->phase,
                'action' => $request->action_code,
            ];
            array_push($dataToInsert, $dataToPush);
            $count++;
        }
        $endtime = microtime(true);
        $timediff = $endtime - $starttime;
        ProductFinalAction::insert($dataToInsert);
        return 'Inserted ' . $count . ' records. Time elapsed: ' . $timediff;

    }

    public function updateMany(Request $request)
    {

        $count = sizeof($request->product_ids);
        $starttime = microtime(true);

        Action::whereIn('product_id', $request->product_ids)->where('user_id', $request->user_id)->update(['action' => $request->action_code]);
        $endtime = microtime(true);
        $timediff = $endtime - $starttime;
        return 'Updated ' . $count . ' records. Time elapsed: ' . $timediff;

    }

    public function updateManyFinal(Request $request)
    {

        $count = sizeof($request->product_ids);
        $starttime = microtime(true);

        ProductFinalAction::whereIn('product_id', $request->product_ids)->where('phase', $request->phase)->update(['action' => $request->action_code]);
        $endtime = microtime(true);
        $timediff = $endtime - $starttime;
        return 'Updated ' . $count . ' records. Time elapsed: ' . $timediff;

    }

}
