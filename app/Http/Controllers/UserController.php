<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Country;
use App\Http\Resources\Country as CountryResource;

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


}
