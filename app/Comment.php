<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    // public $incrementing = false;
    // protected $keyType = 'string';
    protected $table = 'product_comments';
    public $timestamps = false;
}
