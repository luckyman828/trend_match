<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Subfile extends Model
{
    protected $table = 'file_subfiles';

    use \Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;

    public function getParentKeyName()
    {
        return 'parent_id';
    }

    public function file()
    {
        return $this->belongsTo(Collection::class, 'file_id');
    }
}
