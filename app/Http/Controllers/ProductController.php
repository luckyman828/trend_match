<?php

namespace App\Http\Controllers;

use App\Product;
use App\Http\Resources\Product as ProductResource;
use Intervention\Image\Facades\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
    public function uploadImages(Request $request)
    {
        // Loop through the files
        $countImgs = 0;

        foreach ( $request->file('files') as $file ) {
            // Cound how many images are uploaded
            $countImgs++;
            // Create HQ Image of 
            $hqImage = Image::make($file);
            $hqImage->resize('2000', '2000', function ($constaint) {
                $constaint->aspectRatio();
                $constaint->upsize();
            });
            $hqImage->encode('jpg', 90);
            Storage::disk('azure')->put($file->getClientOriginalName() . '.jpg', $hqImage->__toString());

            // Create a thumbnail and save it
            $thumbnail = Image::make($file);
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
