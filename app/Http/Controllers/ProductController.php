<?php

namespace App\Http\Controllers;

use App\Action;
use App\Comment;
use App\CommentVote;
use App\Product;
use App\Http\Resources\Product as ProductResource;
use Illuminate\Database\Eloquent\Builder;
use Intervention\Image\Facades\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function insertOrUpdate(Request $request)
    {
        $existingProduct = Product::find($request->id);

        $product = ($existingProduct) ? $existingProduct : new Product;

        $product->id = $request->id;
        $product->title = $request->title;
        $product->prices = $request->prices;
        $product->assortments = $request->assortments;
        $product->color_variants = $request->color_variants;
        $product->quantity = $request->quantity;
        $product->delivery_date = $request->delivery_date;
        $product->composition = $request->composition;
        $product->category = $request->category;
        $product->sale_description = $request->description;
        $product->collection_id = $request->collection_id;
        $product->datasource_id = $request->datasource_id;

        // return $action;

        if($product->save()) {

            // Fire event
            $dataToReturn = new ProductResource($product);
            // broadcast(new ActionUpdated($actionToReturn))->toOthers();
            // broadcast(new ActionUpdated($actionToReturn))->toOthers();

            // return $dataToReturn;
            return json_decode( json_encode($dataToReturn), true);
        }
    }
    public function delete(Request $request)
    {
        // Find all file specific records
        $product_id = $request->id;
        
        $product = Product::find($product_id);
        $comments = Comment::where('product_id', $product_id);
        $actions = Action::where('product_id', $product_id);
        $commentVotes = CommentVote::whereHas('comment', function (Builder $query) use($product_id) {
            $query->where('product_id', $product_id);
        });
        
        // Use a transaction to make sure all file related records are deleted or none
        DB::transaction(function() use($product, $comments, $actions, $commentVotes) {
            $product->delete();
            $comments->delete();
            $actions->delete();
            $commentVotes->delete();
        });

        return 'Deleted product with id: ' . $product_id;
    }
    public function rotateImage(Request $request)
    {
        // Create an image from the file and rotate it
        $img = Image::make($request->file);
        // Rotate the image
        // The orientate method automatically orientates the image correctly by reading it's EXIF data
        $img->orientate();
        // Resize the image to a thumbnail size
        $img->resize('400', '400', function ($constaint) {
            $constaint->aspectRatio();
            $constaint->upsize();
        });
        // Encode the image as data-url to be used as src for an <img> tag
        return $img->encode('data-url')->__toString();
    }
    public function uploadImages(Request $request)
    {
        // Loop through the files
        $countImgs = 0;

        foreach ( $request->file('files') as $file ) {
            // Cound how many images are uploaded
            $countImgs++;
            // Create HQ Image of 
            $hqImage = Image::make($file);
            // Rotate the image
            // The orientate method automatically orientates the image correctly by reading it's EXIF data
            $hqImage->orientate();
            // Resize the image
            $hqImage->resize('2000', '2000', function ($constaint) {
                $constaint->aspectRatio();
                $constaint->upsize();
            });
            $hqImage->encode('jpg', 90);
            Storage::disk('azure')->put($file->getClientOriginalName() . '.jpg', $hqImage->__toString());

            // Create a thumbnail and save it
            $thumbnail = Image::make($file);
            // Rotate the image
            // The orientate method automatically orientates the image correctly by reading it's EXIF data
            $thumbnail->orientate();
            // Resize the image
            $thumbnail->resize('400', '400', function ($constaint) {
                $constaint->aspectRatio();
                $constaint->upsize();
            });
            $thumbnail->encode('jpg', 80);
            Storage::disk('azure')->put($file->getClientOriginalName() . '_thumbnail.jpg', $thumbnail->__toString());
         }

        // return $output;
        return 'Hurrah! ' . $countImgs . ' images uploaded successfully to blob storage';
    }
    public function deleteImages(Request $request)
    {
        // Loop through the ids
        foreach ( $request->ids as $id ) {
            Storage::disk('azure')->delete($id . '_thumbnail.jpg');
            Storage::disk('azure')->delete($id . '.jpg');
         }

        // return $output;
        return 'Images successfully deleted!';
    }
}
