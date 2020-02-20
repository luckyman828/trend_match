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
use App\Collection;
use App\FileTask;
use App\Http\Resources\Collection as CollectionResource;
use App\TaskAction;
use App\Request as RequestModel;
use App\TeamFile as TeamFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
    

    public function upload(Request $request)
    {

        // $files = $request->files;

        // $file = $request->hasFile('csv');
        // if ($file) {
        //     return 'has file';
        // }   
        // else {
        //     return 'no file';
        // }
        // return $request->file('uploadFile');
    
        $output = [];
        foreach ( $request->files as $file ) {
            // $output [] = $file->getClientOriginalName();
            // continue;
            // $name = $file->getClientOriginalName();
            // $destination = $_SERVER['DOCUMENT_ROOT'].'/uploads/'.$file->getClientOriginalName();
            // move_uploaded_file($file, $destination);
            // return $destination;
            $output[] = [
                'name'     => 'files',
                // 'path_name'     => $file->getPathName(),
                // 'path'     => $file->getPath(),
                'contents'     => file_get_contents($file->getPathName()),
                // 'contents'     => file($file->getPathName()),
                // 'contents'     => fopen($file->getPathName(), 'r'),
                // 'contents'     => fopen($destination, 'r'),
                // 'contents'     => file_get_contents($destination),
                // 'contents' => stream_get_contents($file->getPathName()),
                // 'contents' => fopen( $file->getClientOriginalName(), 'r' ),
                'filename' => $file->getClientOriginalName()
                // 'filename' => $name
                // 'filename' => 'filename'
            ];
            continue;
         }

        //  return $output;

        $endpoint = 'https://api-beta.kollekt.dk/hooks/import-csv?collection_id=' . $request->id;
        $client = new \GuzzleHttp\Client([
            'headers' => [
                'X-Kollekt-App-Key' => 'mnkAEefWBEL7cY1gEetlW4dM_YYL9Vu4K6dmavW2'
                ]
        ]);


        $response = $client->request('POST', $endpoint, [
            'multipart' => $output
        ]);

        return $response->getStatusCode();

        // if($response) {


            // Fire event
            // $dataToReturn = new CollectionResource($file);
            // broadcast(new ActionUpdated($actionToReturn))->toOthers();
            // broadcast(new ActionUpdated($actionToReturn))->toOthers();

            // return $dataToReturn;
            // return json_decode( json_encode($dataToReturn), true);
        // }
    }

    public function insertOrUpdate(Request $request)
    {
        $existingFile = Collection::find($request->id);

        $file = ($existingFile) ? $existingFile : new Collection;

        $file->id = $request->id;
        $file->workspace_id = $request->workspace_id;
        $file->title = $request->title;
        $file->phase = $request->phase;
        $file->folder_id = $request->folder_id;
        $file->catalog_id = $request->catalog_id;
        $file->start_date = $request->start_date;
        $file->end_date = $request->end_date;

        // return $action;

        if($file->save()) {

            // Fire event
            $dataToReturn = new CollectionResource($file);
            // broadcast(new ActionUpdated($actionToReturn))->toOthers();
            // broadcast(new ActionUpdated($actionToReturn))->toOthers();

            // return $dataToReturn;
            return json_decode( json_encode($dataToReturn), true);
        }
    }

    public function destroy(Request $request)
    {
        // Find all file specific records

        $file_id = $request->file_id;
        
        $file = Collection::find($file_id);
        $products = Product::where('collection_id', $file_id);
        $completed_files = FileTask::where('file_id', $file_id);
        $team_files = TeamFile::where('file_id', $file_id);
        $comments = Comment::whereHas('product', function (Builder $query) use($file_id) {
            $query->where('collection_id', $file_id);
        });
        $actions = Action::whereHas('product', function (Builder $query) use($file_id) {
            $query->where('collection_id', $file_id);
        });
        
        // Use a transaction to make sure all file related records are deleted or none
        DB::transaction(function() use($file, $products, $completed_files, $team_files, $comments, $actions) {
            $file->delete();
            $products->delete();
            $completed_files->delete();
            $team_files->delete();
            $comments->delete();
            $actions->delete();
        });

        return 'Deleted file with id: ' . $file_id;

    }

    public function reset(Request $request)
    {
        // Find all file specific records

        $file_id = $request->file_id;
        
        $completed_files = FileTask::where('file_id', $file_id);
        $comments = Comment::whereHas('product', function (Builder $query) use($file_id) {
            $query->where('collection_id', $file_id);
        });
        $actions = Action::whereHas('product', function (Builder $query) use($file_id) {
            $query->where('collection_id', $file_id);
        });
        
        // Use a transaction to make sure all file related records are deleted or none
        DB::transaction(function() use($completed_files, $comments, $actions) {
            $completed_files->delete();
            $comments->delete();
            $actions->delete();
        });

        return 'File Reset! Id: ' . $file_id;

    }
    
}
