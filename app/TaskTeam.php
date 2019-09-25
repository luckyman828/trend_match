<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TaskTeam extends Model
{
    use Traits\HasCompositePrimaryKey;

    protected $primaryKey = ['task_id', 'team_id', 'role_id'];

    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id');
    }
}
