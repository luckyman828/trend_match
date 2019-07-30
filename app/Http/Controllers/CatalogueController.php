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

class CatalogueController extends Controller
{
    // Return all catalogues available to the logged in user
    public function index()
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

}
