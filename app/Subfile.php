<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Subfile extends Model
{
    protected $table = 'file_subfiles';

    public function file()
    {
        return $this->belongsTo(Collection::class, 'file_id');
    }
}
