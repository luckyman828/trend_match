<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
}
