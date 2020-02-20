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
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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
    public function createOrAddUsersToWorkspace(Request $request, $workspace_id)
    {
        // Loop through the users to add
        // If a user with their e-mail already exists, add that user to the provided workspace
        // Else create a new user with the provided user details
        // First create the new users
        // Then get their ids in the DB response
        // Create all workspace users including the newly created users

        // 1. Loop trough the users to add
        $users = $request->users_to_add;
        $usersToInsert = [];
        $usersToCreate = [];
        $usersToReturn = [];

        foreach($users as $user){
            // test if the user exists
            $existingUser = User::where('email', $user['email'])->first();
            if ($existingUser) {
                $dataToPush = [
                    'user_id' => $existingUser->id,
                    'workspace_id' => $workspace_id,
                    'permission_level' => 1,
                ];
                array_push($usersToInsert, $dataToPush);
                array_push($usersToReturn, $existingUser);
            } else {
                $dataToPush = [
                    'email' => $user['email'],
                    'name' => $user['name'],
                    'password' => $user['password'],
                ];
                array_push($usersToCreate, $dataToPush);
            }
        }

        // Use a transaction to make sure we get all or nothing
        DB::transaction(function() use($usersToCreate, $workspace_id, $usersToInsert, $usersToReturn) {
            foreach($usersToCreate as $user){
                $new_user = new User;
                $new_user->email = $user['email'];
                $new_user->name = $user['name'];
                $new_user->password = Hash::make($user['password']);
    
                // Save the new user
                $new_user->save();

                // Push the new user to the users to be inserted
                $dataToPush = [
                    'user_id' => $new_user->id,
                    'workspace_id' => $workspace_id,
                    'permission_level' => 1,
                ];
                array_push($usersToInsert, $dataToPush);
                array_push($usersToReturn, $new_user);
            }

            // Insert users to workspace
            WorkspaceUser::insert($usersToInsert);
            
        });
        // If succes
        return $usersToReturn;
    }
    
    public function removeUserFromWorkspace(Request $request, $workspace_id)
    {
        $existingWorkspaceUser = WorkspaceUser::where('workspace_id', $workspace_id)->where('user_id', $request->user_id)->first();

        if( $existingWorkspaceUser->delete() ) {
            return $existingWorkspaceUser;
        } else {
            return 'nothing found';
        }
    }



}
