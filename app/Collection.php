<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    public function products()
    {
        return $this->hasMany(Product::class, 'collection_id');
    } 
}
