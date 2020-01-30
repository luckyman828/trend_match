<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    public function workspace_users()
    {
        return $this->hasMany(WorkspaceUser::class, 'workspace_id');
    }
}
