<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Comment;
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
        $comment = $request->isMethod('put')
        // If request is put
        ? Comment::findOrFail($request->comment_id)

        // Else (it is create) define a new comment
        : new Comment;

        $comment->user_id = $request->input('user_id');
        $comment->product_id = $request->input('product_id');
        $comment->comment = $request->input('comment_body');
        $comment->important = $request->input('important');
        $comment->final = $request->input('final');
        $comment->product_final = $request->input('product_final');

        if($comment->save()) {
            return new CommentResource($comment);
        }
    }

    public function update(Request $request)
    {
        // Remove final from other comments from the same product

        $oldFinal = Comment::where('product_id', $request->product_id)->where('product_final', 1)->first();

        if($oldFinal) {

            $oldFinal->product_final = 0;
            
            $oldFinal->save();
        }

        // First, check if the comment already exists
        $existingComment = Comment::find($request->id);

        // If the comment exists, select that one, otherwise, create a new comment
        $comment = ($existingComment) ? $existingComment : new Comment;
        // $comment = ($existingComment) ? $existingComment : "creating new comment";
        // return $comment;
        
        $comment->id = $request->input('id');
        $comment->user_id = $request->input('user_id');
        $comment->product_id = $request->input('product_id');
        $comment->comment = $request->input('comment_body');
        $comment->important = $request->input('important');
        $comment->final = $request->input('final');
        $comment->product_final = $request->input('product_final');

        // return $comment;

        if($comment->save()) {
            return new CommentResource($comment);
        }

    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
