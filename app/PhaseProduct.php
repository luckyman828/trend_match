<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PhaseProduct extends Model
{
    use Traits\HasCompositePrimaryKey;

    // protected $table = 'user_teams';
    protected $primaryKey = ['phase_id', 'product_id'];
    public $timestamps = false;

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    } 
}
