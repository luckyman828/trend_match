<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use App\Catalogue as Folder;
use App\Http\Resources\Catalogue as FolderResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FolderController extends Controller
{

    public function insertOrUpdate(Request $request, $id)
    {
        if ($id) {
            $existingFolder = Folder::find($id);
            $folder = $existingFolder;
            $folder->id = $id;
        } else {
            $folder = new Folder;
        }

        $folder->workspace_id = $request->folder['workspace_id'];
        $folder->parent_id = $request->folder['parent_id'];
        $folder->title = $request->folder['title'];

        // return $action;

        if($folder->save()) {

            // Fire event
            $dataToReturn = new FolderResource($folder);
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
