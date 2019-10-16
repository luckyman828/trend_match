<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Action extends JsonResource
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
        //     'user_id' => $this->user_id,
        //     'product_id' => $this->product_id,
        //     'action' => $this->action,
        //     'task_id' => $this->action,
        // ];
    }
}
