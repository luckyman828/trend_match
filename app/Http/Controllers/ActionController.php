<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Action;
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
        $action = $request->isMethod('put') 
        ? Action::where('product_id', $request->product_id)->where('user_id', $request->user_id)->firstOrFail()
        : new Action;

        $action->user_id = $request->input('user_id');
        $action->product_id = $request->input('product_id');
        $action->action = $request->input('action_code');

        if($action->save()) {
            return new ActionResource($action);
        }

        // $userID = '"' . (string)$request->input('user_id') . '"';
        // $productID = $request->input('product_id');
        // $actionCode = $request->input('action_code');
        // //return ($userID . ", " . $productID . ", " . $actionCode);
        // DB::raw("call sp_insert_or_update_user_product_action($userID, $productID, $actionCode)");

        // DB::raw('call sp_insert_or_update_user_product_action(?, ?, ?)', [$request->input('user_id'), $request->input('product_id'), $request->input('action')]);
    }

    public function storeMany(Request $request)
    {
        // $action = $request->isMethod('put') 
        // ? Action::where('product_id', $request->product_id)->where('user_id', $request->user_id)->firstOrFail()
        // : new Action;

        // $action->user_id = $request->input('user_id');
        // $action->product_id = $request->input('product_id');
        // $action->action = $request->input('action_code');

        // if($action->save()) {
        //     return new ActionResource($action);
        // }
        // $jsonArray = json_decode($request, true);
        // $data = json_decode($request, true);
        return 'API response: ' . $request;
        // return $request;

        // $userID = '"' . (string)$request->input('user_id') . '"';
        // $productID = $request->input('product_id');
        // $actionCode = $request->input('action_code');
        // //return ($userID . ", " . $productID . ", " . $actionCode);
        // DB::raw("call sp_insert_or_update_user_product_action($userID, $productID, $actionCode)");

        // DB::raw('call sp_insert_or_update_user_product_action(?, ?, ?)', [$request->input('user_id'), $request->input('product_id'), $request->input('action')]);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
