<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
}
