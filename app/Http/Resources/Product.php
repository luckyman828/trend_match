<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Product extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Return all
        return parent::toArray($request);

        // Return selected
        // return [
        //     'id' => $this->id,
        //     'title' => $this->title,
        //     'image' => $this->images,
        // ];
    }
}
