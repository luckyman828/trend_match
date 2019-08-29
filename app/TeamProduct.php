<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TeamProduct extends Model
{
    use Traits\HasCompositePrimaryKey;

    // protected $table = 'user_teams';
    protected $primaryKey = ['team_id', 'product_id', 'phase_id'];
    public $timestamps = false;

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    } 
}
