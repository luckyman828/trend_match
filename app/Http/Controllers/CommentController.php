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
