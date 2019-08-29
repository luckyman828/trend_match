<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Comment extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);

        // return [
        //     'id' => $this->id,
        //     'user_id' => $this->user_id,
        //     'product_id' => $this->product_id,
        //     'comment' => $this->comment,
        //     'important' => $this->important,
        //     'final' => $this->final,
        //     'product_final' => $this->product_final,
        // ];
    }
}
