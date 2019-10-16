<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FileTask extends Model
{
    use Traits\HasCompositePrimaryKey;

    protected $primaryKey = ['file_id', 'task_id'];
    public $timestamps = false;

    public function file()
    {
        return $this->belongsTo(Collection::class, 'file_id');
    } 
}
