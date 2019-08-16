<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Product;
Use App\Http\Resources\Product as ProductResource;
use App\Catalogue;
Use App\Http\Resources\Catalogue as CatalogueResource;
use App\Collection;
Use App\Http\Resources\Collection as CollectionResource;
use App\Action;
Use App\Http\Resources\Action as ActionResource;
use App\Comment;
Use App\Http\Resources\Comment as CommentResource;
use App\User;
use App\Http\Resources\User as UserResource;
use App\ProductFinalAction;
use App\Http\Resources\ProductFinalAction as ProductFinalActionResource;
use App\Team;
use App\Http\Resources\Team as TeamResource;
use App\CommentVote;
use App\Http\Resources\CommentVote as CommentVoteResource;
use App\UserTeam;
use App\Http\Resources\UserTeam as UserTeamResource;
use App\Category;
use App\Http\Resources\Category as CategoryResource;
use App\TeamInvite;
use App\Http\Resources\TeamInvite as TeamInviteResource;

class CatalogueController extends Controller
{
    // Return all catalogues available to the logged in user
    public function catalogues()
    {
        $catalogues = Catalogue::get();

        // Return collection of products as a resource
        return CatalogueResource::collection($catalogues);
    }

    // Return all collections in the specified catalogue
    public function collections()
    {
        $collections = Collection::get();

        // Return collection of products as a resource
        return CollectionResource::collection($collections);
    }

    // Return all products in the specified collection
    public function products($collection_id)
    {
        $products = Product::where('collection_id', $collection_id)->get();

        // Return collection of products as a resource
        return ProductResource::collection($products);
    }

    // Return all products in the specified collection
    public function actions($collection_id)
    {
        // $actions = Acitvity::where('collection_id', $collection_id)->get();
        $actions = Action::get();

        // Return collection of products as a resource
        return ActionResource::collection($actions);
    }

    // Return all products in the specified collection
    public function finalActions()
    {
        // $actions = Acitvity::where('collection_id', $collection_id)->get();
        $finalActions = ProductFinalAction::get();

        // Return collection of products as a resource
        return ProductFinalActionResource::collection($finalActions);
    }

    // Return count of comments per product
    public function comments($collection_id)
    {
// $raw_query = <<<EOD
//     SELECT product_id, COUNT(*) AS comments FROM trendmatchb2b.tmb_product_comments GROUP BY product_id;
// EOD;
//         $comments = DB::select(DB::raw($raw_query), array(
//             'collectionID' => $collection_id
//         ));

//         return $comments;

        $comments = Comment::get();

        // Return collection of products as a resource
        return CommentResource::collection($comments);

    }

    // Return all users with access to the specified collection
    public function users($collection_id)
    {
        $users = User::get();

        // Return collection of users as a resource
        return UserResource::collection($users);
    }

    public function teams($collection_id)
    {
        $teams = Team::get();

        // Return collection of users as a resource
        return TeamResource::collection($teams);
    }

    public function userTeams()
    {
        $user_teams = UserTeam::get();

        // Return collection of users as a resource
        return UserTeamResource::collection($user_teams);
    }

    public function categories()
    {
        $categories = Category::get();

        // Return collection of users as a resource
        return CategoryResource::collection($categories);
    }

    public function commentVotes($collection_id)
    {
        $comment_votes = CommentVote::get();

        // Return collection of users as a resource
        return CommentVoteResource::collection($comment_votes);
    }

    public function teamInvites()
    {
        $team_invites = TeamInvite::get();

        // Return collection of users as a resource
        return TeamInviteResource::collection($team_invites);
    }

}
