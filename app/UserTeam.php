<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserTeam extends Model
{
    use Traits\HasCompositePrimaryKey;

    // protected $table = 'user_teams';
    protected $primaryKey = ['user_id', 'team_id'];
    public $timestamps = false;
}
