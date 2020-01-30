<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SubfileCompletedProduct extends Model
{
    protected $table = 'file_subfile_completed_products';

    use Traits\HasCompositePrimaryKey;

    protected $primaryKey = ['subfile_id', 'product_id'];
    public $incrementing = false;
}
