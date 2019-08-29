<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Action extends Model
{
    use Traits\HasCompositePrimaryKey;

    protected $primaryKey = ['user_id', 'product_id'];
    public $incrementing = false;
    protected $table = 'user_products';

    /**
     * The name of the "created at" column.
     *
     * @var string
     */
    const CREATED_AT = null;

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    } 

}
