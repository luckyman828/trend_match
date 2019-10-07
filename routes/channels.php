<?php

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

// Broadcast::channel('App.User.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id;
// });

Broadcast::channel('workspace.{id}', function ($user, $id) {
    // return Cache::get('user_'.$user->id.'_currentWorkspaceId') === $id;


    // ERROR ---->>>> IT IS CURRENTLY GETTING THE AUTH USER BASED ON THE BEARER TOKEN USED FOR THE MIDDLEWARE
    // Log::info('Broadcast channel Auth user:');
    // Log::info(session()->all());
    
    // Log::info('user id:' . Auth::id());
    // Log::info(Auth::user());
    // Log::info('1: Cached id: ' . Cache::get('user_'.$user->id.'_currentWorkspaceId'));
    // Log::info('2: Cached id: ' . Cache::get('user_d148aed1-c70d-462e-94e3-68843a49bd45_currentWorkspaceId'));
    
    // Log::info('Route id: ' . $id . ', cache id: ' . Cache::get('user_'.$user->id.'_currentWorkspaceId'));
    return true;
});
// Broadcast::channel('workspace.9626a108-51ab-4149-9265-15fd6d42a3e9', function ($user) {
//     return true;
// });
// Broadcast::channel('private-workspace.9626a108-51ab-4149-9265-15fd6d42a3e9', function ($user) {
//     return true;
// });
// Broadcast::channel('workspace', function ($user) {
//     return true;
// });
// Broadcast::channel('private-workspace', function () {
//     return true;
// });
Broadcast::channel('secret', function ($user) {
    return true;
});