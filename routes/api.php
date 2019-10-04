<?php

use Illuminate\Http\Request;

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

// Private API routes (Passport protected)
Route::middleware('auth:api')->group( function(){

    // xxx WORKSPACES xxx
    // List workspaces available to logged in user
    Route::get('workspaces', 'WorkspaceController@workspaces');
    // List WorkspaceUsers available to logged in user
    Route::get('workspace-users', 'WorkspaceController@workspaceUsers');
    // List workspace teams
    Route::get('workspace/{workspace_id}/teams', 'WorkspaceController@teams');
    // List workspace files
    Route::get('workspace/{workspace_id}/files', 'WorkspaceController@files');
    // List workspace team files
    Route::get('workspace/{workspace_id}/team-files', 'WorkspaceController@teamFiles');
    // List workspace users
    Route::get('workspace/{workspace_id}/users', 'WorkspaceController@users');
    // List workspace phases
    Route::get('workspace/{workspace_id}/phases', 'WorkspaceController@phases');
    // List workspace phase teams
    Route::get('workspace/{workspace_id}/phase-teams', 'WorkspaceController@phaseTeams');
    // List workspace tasks
    Route::get('workspace/{workspace_id}/tasks', 'WorkspaceController@tasks');
    // List workspace task tasks
    Route::get('workspace/{workspace_id}/task-parents', 'WorkspaceController@taskParents');
    // List workspace task teams
    Route::get('workspace/{workspace_id}/task-teams', 'WorkspaceController@taskTeams');
    // List workspace file tasks
    Route::get('workspace/{workspace_id}/file-tasks', 'WorkspaceController@fileTasks');

    // xxx TEAMS xxx
    // List current workspace team invites
    Route::get('workspace/{workspace_id}/team-invites', 'TeamController@invites');
    // Create team
    Route::post('workspace/{workspace_id}/team', 'TeamController@store');

    // xxx FILES xxx
    Route::get('file/{file_id}/products', 'FileController@products');
    Route::get('file/{file_id}/user-products', 'FileController@userProducts');
    Route::get('file/{file_id}/comments', 'FileController@comments');
    Route::get('file/{file_id}/comment-votes', 'FileController@commentVotes');
    Route::get('file/{file_id}/final-actions', 'FileController@finalActions');
    Route::get('file/{file_id}/team-products', 'FileController@teamProducts');
    Route::get('file/{file_id}/phase-products', 'FileController@phaseProducts');
    Route::get('file/{file_id}/task-actions', 'FileController@taskActions');
    Route::get('file/{file_id}/requests', 'FileController@requests');
    

    // xxx CATALOGS xxx
    // List catelogues available to logged in user
    Route::get('catalogues', 'CatalogueController@catalogues');
    // List collections from catalogue
    Route::get('catalogue/{catalogue_id}/collections', 'CatalogueController@collections');
    // List products from collection
    Route::get('collection/{collection_id}/products', 'CatalogueController@products');
    // List actions from collection
    Route::get('collection/{collection_id}/actions', 'CatalogueController@actions');
    // List comments from collection
    Route::get('collection/{collection_id}/comments', 'CatalogueController@comments');
    // List users from collection
    Route::get('collection/{collection_id}/users', 'CatalogueController@users');
    // List final actions from collection
    Route::get('collection/{collection_id}/final-actions', 'CatalogueController@finalActions');
    // List teams from collection
    Route::get('collection/{collection_id}/teams', 'CatalogueController@teams');
    // List comment votes
    Route::get('collection/{collection_id}/comment-votes', 'CatalogueController@commentVotes');
    // List user teams
    Route::get('collection/user-teams', 'CatalogueController@userTeams');
    // List categories
    Route::get('collection/categories', 'CatalogueController@categories');

    // xxx ACTIONS xxx
    // Update action
    Route::put('action', 'ActionController@store');
    Route::put('task-action', 'ActionController@storeTask');
    // Delete action
    Route::delete('action', 'ActionController@destroy');
    Route::delete('task-action', 'ActionController@destroyTask');
    // Update many actions
    Route::put('many-actions', 'ActionController@updateMany');
    Route::put('many-task-actions', 'ActionController@updateManyTask');
    // Create many actions
    Route::post('many-actions', 'ActionController@storeMany');
    Route::post('many-task-actions', 'ActionController@storeManyTask');


    // xxx USERS xxx
    // Get countries
    // Route::get('countries', 'UserController@countries');
    Route::post('invite-user', 'MailController@inviteUser');
    Route::post('invite-users', 'MailController@inviteUsers');
    Route::get('roles', 'UserController@roles');
    Route::put('user/role', 'UserController@changeRole');

    // xxx Comments xxx
    // create new comment
    Route::post('comment', 'CommentController@store');
    // Edit comment
    Route::put('comment', 'CommentController@store');
    // Update comment
    Route::put('comment/update-final', 'CommentController@updateFinal');

    // xxx Team Invites xxx
    // List team invites
    Route::get('team-invites', 'InviteController@index');
    Route::delete('team-invite', 'InviteController@destroy');
    Route::post('resend-invite', 'MailController@resendInvite');

    // xxxx Teams xxx
    Route::delete('user-team', 'TeamController@destroy');

    // xxxx Cache xxx
    Route::put('cache/workspace', 'WorkspaceController@cacheCurrentWorkspace');

});

// Public requests

// xxxx CLUBHOUSE WEBHOOK xxx
Route::post('clubhouse', 'ClubhouseController@index');