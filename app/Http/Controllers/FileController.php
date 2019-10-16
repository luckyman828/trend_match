<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use App\Product;
use App\Http\Resources\Product as ProductResource;
use App\Action;
use App\Http\Resources\Action as ActionResource;
use App\Comment;
use App\Http\Resources\Comment as CommentResource;
use App\ProductFinalAction;
use App\Http\Resources\ProductFinalAction as ProductFinalActionResource;
use App\CommentVote;
use App\Http\Resources\CommentVote as CommentVoteResource;
use App\PhaseProduct;
use App\Http\Resources\PhaseProduct as PhaseProductResource;
use App\TeamProduct;
use App\Http\Resources\TeamProduct as TeamProductResource;
use App\TaskAction;
use App\Request as RequestModel;

class FileController extends Controller
{

    public function products($file_id)
    {
        $products = Product::where('collection_id', $file_id)->get();

        // Return collection of users as a resource
        return ProductResource::collection($products);
    }

    public function userProducts($file_id)
    {
        $products = Action::whereHas('product', function (Builder $query) use($file_id) {
            $query->where('collection_id', $file_id);
        })->get();

        // Return collection of users as a resource
        return ActionResource::collection($products);
    }

    public function comments($file_id)
    {
        $comments = Comment::whereHas('product', function (Builder $query) use($file_id) {
            $query->where('collection_id', $file_id);
        })->get();

        // Return collection of users as a resource
        return CommentResource::collection($comments);
    }

    public function commentVotes($file_id)
    {
        $comment_votes = CommentVote::whereHas('product', function (Builder $query) use($file_id) {
            $query->where('collection_id', $file_id);
        })->get();

        // Return collection of users as a resource
        return CommentVoteResource::collection($comment_votes);
    }

    public function finalActions($file_id)
    {
        $final_actions = ProductFinalAction::whereHas('product', function (Builder $query) use($file_id) {
            $query->where('collection_id', $file_id);
        })->get();

        // Return collection of users as a resource
        return ProductFinalActionResource::collection($final_actions);
    }
    // Return all team actions for the specified collection
    public function teamProducts($file_id)
    {
        $data = TeamProduct::whereHas('product', function (Builder $query) use($file_id) {
            $query->where('collection_id', $file_id);
        })->get();

        // Return collection of users as a resource
        return TeamProductResource::collection($data);
    }

    // Return all phase actions for the specified collection
    public function phaseProducts($file_id)
    {
        $data = PhaseProduct::whereHas('product', function (Builder $query) use($file_id) {
            $query->where('collection_id', $file_id);
        })->get();

        // Return collection of users as a resource
        return PhaseProductResource::collection($data);
    }

    // Return all task actions for the specified collection
    public function taskActions($file_id)
    {
        $result = TaskAction::whereHas('product', function (Builder $query) use($file_id) {
            $query->where('collection_id', $file_id);
        })->get();

        return $result;
    }

    // Return all requests for the specified file
    public function requests($file_id)
    {
        $result = RequestModel::whereHas('product', function (Builder $query) use($file_id) {
            $query->where('collection_id', $file_id);
        })->get();

        return $result;
    }

    
}
