<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// Route::get('test', 'CaptchaController@verify');
Route::post('join-selection-via-link', 'JoinController@joinViaLink');
Route::get('/selections/{selection_id}/get-link', 'JoinController@getLinkHash');
Route::get('/selections/read-link/{link_hash}', 'JoinController@readLinkHash');

// Private API routes (Passport protected)
Route::middleware('auth:api')->group( function() {


    // Route::post('verify-captcha', function () {
    //     return 'John';
    // });

    // Route::get('test', 'CaptchaController@verify');
    
});