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

    public function insertOrUpdate(Request $request)
    {
        $existingFile = Collection::find($request->id);

        $file = ($existingFile) ? $existingFile : new Collection;

        $file->id = $request->id;
        $file->workspace_id = $request->workspace_id;
        $file->title = $request->title;
        $file->phase = $request->phase;
        $file->folder_id = $request->catalog_id;
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
    
}
