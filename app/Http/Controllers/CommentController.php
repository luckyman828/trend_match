<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Comment;
use App\Events\CommentDeleted;
use App\Events\CommentUpdated;
use App\http\resources\Comment as CommentResource;

class CommentController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Check if the comment already exists. If it does - update it
        if ($request->id) {
            $existingComment = Comment::find($request->id);
            $comment = ($existingComment) ? $existingComment : new Comment;
        } else {
            $comment = new Comment;
        }
   
        $comment->user_id = $request->input('user_id');
        $comment->product_id = $request->input('product_id');
        $comment->team_id = $request->input('team_id');
        $comment->task_id = $request->input('task_id');
        $comment->comment = $request->input('comment_body');
        $comment->important = $request->input('important');
        $comment->is_request = $request->input('is_request');

        if($comment->save()) {

            $commentToReturn = new CommentUpdated($comment);
            // Fire dynamic update event
            broadcast($commentToReturn)->toOthers();

            // Return new comment
            return $comment;
        }
    }

    public function insertOrUpdate(Request $request, $id)
    {
        $comment = Comment::find($id);

        $comment->comment = $request->comment['comment'];

        // return $action;

        if($comment->save()) {

            // Fire event
            $commentToReturn = new CommentUpdated($comment);
            // Fire dynamic update event
            broadcast($commentToReturn)->toOthers();

            // Return the comment
            $dataToReturn = new CommentResource($comment);
            return json_decode( json_encode($dataToReturn), true);
        }
    }

    public function destroy(Request $request, $id)
    {
        // Find all file specific records

        $comment_id = $id;
        $comment = Comment::find($comment_id);

        // Fire event
        $commentToReturn = new CommentDeleted($comment);
        // Fire dynamic update event
        broadcast($commentToReturn)->toOthers();

        $comment->delete();

        return 'Deleted comment with id: ' . $comment_id;

    }

}
