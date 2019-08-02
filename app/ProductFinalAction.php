<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProductFinalAction extends Model
{
    use Traits\HasCompositePrimaryKey;

    protected $primaryKey = ['product_id', 'phase'];
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'phase',
        'action',
        ];
}
