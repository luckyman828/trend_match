<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Action extends Model
{
    use Traits\HasCompositePrimaryKey;

    protected $primaryKey = ['user_id', 'product_id'];
    public $incrementing = false;
    protected $table = 'user_products';
}
