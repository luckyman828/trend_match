<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\Role as RoleResource;
use App\Role;
use App\Http\Resources\Country as CountryResource;
use App\User;
use App\Http\Resources\User as UserResource;
use App\Country;

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
    public function changeRole(Request $request)
    {
        // Return collection of products as a resource
        $user = User::find($request->user_id);
        $user->role_id = $request->role_id;
        $user->save();
        if($user->save()) {
            return $user;
        }
        // return new UserResource($user);
    }


}
