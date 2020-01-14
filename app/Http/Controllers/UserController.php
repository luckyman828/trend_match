<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\Role as RoleResource;
use App\Role;
use App\Http\Resources\Country as CountryResource;
use App\User;
use App\Http\Resources\User as UserResource;
use App\Country;
use App\WorkspaceUser;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    public function countries()
    {
        $countries = Country::get();

        // Return collection of products as a resource
        return CountryResource::collection($countries);
    }

    public function roles()
    {
        $roles = Role::get();

        // Return collection of products as a resource
        return RoleResource::collection($roles);
    }

    public function insertOrUpdate(Request $request, $id = null)
    {
        if ($id) {
            $existingUser = User::find($id);
            $user = $existingUser;
            $user->id = $id;
        } else {
            $user = new User;
        }

        $user->name = $request->user['name'];
        $user->email = $request->user['email'];
        $user->currency = $request->user['currency'];
        $user->impact = $request->user['impact'];


        if($user->save()) {

            return $user;
            // Fire event
            $dataToReturn = new UserResource($user);
            // broadcast(new ActionUpdated($actionToReturn))->toOthers();
            // broadcast(new ActionUpdated($actionToReturn))->toOthers();

            // return $dataToReturn;
            return json_decode( json_encode($dataToReturn), true);
        }
    }

    public function insertOrUpdateWorkspaceUser(Request $request)
    {
        $existingWorkspaceUser = WorkspaceUser::where('user_id', $request->user_id)->where('workspace_id', $request->workspace_id)->first();
        $workspaceUser = $existingWorkspaceUser ? $existingWorkspaceUser : new WorkspaceUser;

        $workspaceUser->user_id = $request->user_id;
        $workspaceUser->workspace_id = $request->workspace_id;
        $workspaceUser->permission_level = $request->permission_level;


        if($workspaceUser->save()) {

            return $workspaceUser;
            // Fire event
            // $dataToReturn = new UserResource($user);
            // // broadcast(new ActionUpdated($actionToReturn))->toOthers();
            // // broadcast(new ActionUpdated($actionToReturn))->toOthers();

            // // return $dataToReturn;
            // return json_decode( json_encode($dataToReturn), true);
        }
    }



}
