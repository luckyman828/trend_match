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
        $existingComment = Comment::find($request->comment_id);
        $comment = ($existingComment) ? $existingComment : new Comment;
   
        $comment->user_id = $request->input('user_id');
        $comment->product_id = $request->input('product_id');
        $comment->team_id = $request->input('team_id');
        $comment->phase_id = $request->input('phase_id');
        $comment->comment = $request->input('comment_body');
        $comment->important = $request->input('important');
        $comment->team_final = $request->input('team_final');
        $comment->phase_final = $request->input('phase_final');

        if($comment->save()) {
            return new CommentResource($comment);
        }
    }

    public function updateFinal(Request $request)
    {
        // Remove final from other comments from the same product
        $comment = Comment::findOrFail($request->id);

        $oldPhaseFinal = ($request->phase_final) ? Comment::where('product_id', $comment->product_id)->where('phase_final', 1)->first() : false;
        $oldTeamFinal = ($request->team_final) ? Comment::where('product_id', $comment->product_id)->where('team_id', $comment->team_id)->where('team_final', 1)->first() : false;

        if($oldPhaseFinal) {
            $oldPhaseFinal->phase_final = 0;
            $oldPhaseFinal->save();
        }
        if($oldTeamFinal) {
            $oldTeamFinal->team_final = 0;
            $oldTeamFinal->save();
        }

        if ($request->phase_final) {
            $comment->phase_final = $request->input('phase_final');
        }
        if ($request->team_final) {
            $comment->team_final = $request->input('team_final');
        }
        
        
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
