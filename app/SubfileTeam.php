<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SubfileTeam extends Model
{
    protected $table = 'file_subfile_teams';

    use Traits\HasCompositePrimaryKey;

    protected $primaryKey = ['subfile_id', 'team_id'];
    public $incrementing = false;
}
