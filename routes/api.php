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
    // Create new action
    Route::post('action', 'ActionController@store');
    // Update action
    Route::put('action', 'ActionController@store');
    
    // Update final action
    Route::put('final-action', 'ActionController@storeFinal');
    // Delete final action
    Route::delete('final-action', 'ActionController@destroyFinal');
    // Update final action
    Route::put('many-final-action', 'ActionController@storeManyFinal');
    // Delete final action
    Route::delete('many-final-action', 'ActionController@destroyManyFinal');
    
    // Update final actions
    Route::put('actions', 'ActionController@storeMany');
    // Delete action
    Route::delete('action/{user_id}/{product_id}', 'ActionController@destroy');

    // xxx USERS xxx
    // Get countries
    Route::get('countries', 'UserController@countries');

    // xxx Comments xxx
    // create new comment
    Route::post('comment', 'CommentController@store');
    // Edit comment
    Route::put('comment', 'CommentController@store');
    // Update comment
    Route::put('comment/update', 'CommentController@update');

});