<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TaskAction extends Model
{
    use Traits\HasCompositePrimaryKey;

    protected $primaryKey = ['task_id', 'product_id'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    } 
}
