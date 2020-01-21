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

// Private API routes (Passport protected)
Route::middleware('auth:api')->group( function(){

    // xxx WORKSPACES xxx
    // List workspaces available to logged in user
    Route::get('workspaces', 'WorkspaceController@workspaces');
    // List WorkspaceUsers available to logged in user
    Route::get('workspace/{workspace_id}/workspace-users', 'WorkspaceController@workspaceUsers');
    // List workspace teams
    Route::get('workspace/{workspace_id}/teams', 'WorkspaceController@teams');
    // List workspace folders
    Route::get('workspace/{workspace_id}/folders', 'WorkspaceController@folders');
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
    Route::get('workspace/{workspace_id}/subfiles', 'WorkspaceController@subfiles');
    Route::get('workspace/{workspace_id}/subfile_users', 'WorkspaceController@subfileUsers');
    Route::get('workspace/{workspace_id}/subfile_teams', 'WorkspaceController@subfileTeams');
    Route::get('workspace/{workspace_id}/subfile_completed_products', 'WorkspaceController@subfileCompletedProducts');

    // xxx TEAMS xxx
    // List current workspace team invites
    Route::get('workspace/{workspace_id}/team-invites', 'TeamController@invites');
    // Create team
    Route::post('team', 'TeamController@insertOrUpdate');
    // Update team
    Route::put('team/{id}', 'TeamController@insertOrUpdate');
    // Delete team
    Route::delete('team', 'TeamController@destroyTeam');

    Route::put('user-team', 'TeamController@insertOrUpdateUserTeam');

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
    
    // xxx FILES CRUD xxx
    Route::post('file', 'FileController@upload');
    Route::put('file', 'FileController@insertOrUpdate');
    Route::delete('file', 'FileController@destroy');
    Route::post('file/reset', 'FileController@reset');

    // xxx FOLDERS CRUD xxx
    Route::post('folder', 'FolderController@insertOrUpdate');
    Route::put('folder/{folder_id}', 'FolderController@insertOrUpdate');
    Route::delete('folder/{folder_id}', 'FolderController@destroy');

    // xxx PRODUCTS xxx
    Route::put('product', 'ProductController@insertOrUpdate');
    Route::delete('product', 'ProductController@delete');
    Route::post('product/images', 'ProductController@uploadImages');
    Route::delete('product/images', 'ProductController@deleteImages');
    Route::post('product/rotate-img', 'ProductController@rotateImage');
    

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


    // xxx TASKS xxx
    Route::put('task/complete', 'TaskController@markComplete');
    Route::delete('task/complete', 'TaskController@undoMarkComplete');
    // Route::post('files/feedback-status', 'TaskController@feedbackStatus');


    // xxx USERS xxx
    // Get countries
    // Route::get('countries', 'UserController@countries');
    Route::post('invite-user', 'MailController@inviteUser');
    Route::post('invite-users', 'MailController@inviteUsers');
    Route::get('roles', 'UserController@roles');
    // Create / Update user
    Route::post('user', 'UserController@insertOrUpdate');
    Route::put('user/{id}', 'UserController@insertOrUpdate');
    Route::put('workspace-user', 'UserController@insertOrUpdateWorkspaceUser');

    // Add / Create user on Workspace
    Route::post('workspace/{workspace_id}/users/add', 'UserController@createOrAddUsersToWorkspace');
    // remove user from Workspace
    Route::delete('workspace/{workspace_id}/user', 'UserController@removeUserFromWorkspace');

    // xxx Comments xxx
    // create new comment
    Route::post('comment', 'CommentController@store');
    // Edit comment
    Route::put('comment', 'CommentController@store');
    // Update comment
    Route::put('comment/update-final', 'CommentController@updateFinal');

    Route::put('comment/{id}', 'CommentController@insertOrUpdate');
    Route::delete('comment/{id}', 'CommentController@destroy');

    // xxx Team Invites xxx
    // List team invites
    Route::get('team-invites', 'InviteController@index');
    Route::delete('team-invite', 'InviteController@destroy');
    Route::post('resend-invite', 'MailController@resendInvite');

    // xxxx Teams xxx
    Route::delete('team/user', 'TeamController@removeUser');
    Route::post('team/users', 'TeamController@addUsers');

    // xxxx Cache xxx
    Route::put('cache/workspace', 'WorkspaceController@cacheCurrentWorkspace');

    
});

// For external API
Route::middleware('client')->group( function(){
    Route::post('files/feedback-status', 'TaskController@feedbackStatus');
});

// Route::post('/files/feedback-status', 'TaskController@feedbackStatus')->middleware('client');
// Route::post('/files/feedback-status', 'TaskController@feedbackStatus');


// Public requests

// xxxx CLUBHOUSE WEBHOOK xxx
// Route::post('clubhouse', 'ClubhouseController@index');