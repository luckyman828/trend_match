<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\Role as RoleResource;
use App\Role;
use App\Http\Resources\Country as CountryResource;
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


}
