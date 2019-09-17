<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TeamFile extends Model
{
    use Traits\HasCompositePrimaryKey;
    protected $primaryKey = ['file_id', 'team_id'];

    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id');
    }
}
