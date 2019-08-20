<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class User extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // return parent::toArray($request);

        return [
            'id' => $this->id,
            'email' => $this->email,
            'name' => $this->name,
            'country_id' => $this->country_id,
            'team_ids' => $this->team_ids,
            'role_id' => $this->role_id,
            'assigned_room_id' => $this->assigned_room_id,
        ];
    }
}
