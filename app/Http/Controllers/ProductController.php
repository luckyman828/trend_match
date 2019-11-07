<?php

namespace App\Http\Controllers;

use App\Product;
use App\Http\Resources\Product as ProductResource;
use Illuminate\Http\Request;

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
}
