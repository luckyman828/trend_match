<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkspaceUser extends Model
{
    use Traits\HasCompositePrimaryKey;

    // protected $table = 'user_teams';
    protected $primaryKey = ['workspace_id', 'user_id'];
    public $timestamps = false;

}
