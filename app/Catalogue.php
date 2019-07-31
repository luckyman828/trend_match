<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Catalogue extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'catalogs';
}
