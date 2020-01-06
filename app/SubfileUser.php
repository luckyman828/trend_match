<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SubfileUser extends Model
{
    protected $table = 'file_subfile_users';

    use Traits\HasCompositePrimaryKey;

    protected $primaryKey = ['subfile_id', 'user_id'];
    public $incrementing = false;
}
