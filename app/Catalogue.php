<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Catalogue extends Model
{
    // public $incrementing = false;
    // protected $keyType = 'string';
    protected $table = 'catalogs';

    use \Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;

    public function getParentKeyName()
    {
        return 'parent_id';
    }

    public function files()
    {
        return $this->hasMany(Collection::class, 'folder_id', 'id');
    }

    // public function childFolders()
    // {
    //     return $this->hasMany(Catalogue::class, 'parent_id', 'id');
    // }

    // public function allChildFolders()
    // {
    //     return $this->childFolders()->with('allChildFolders');
    // }

    // public function childFiles()
    // {
    //     return $this->hasMany(Collection::class, 'folder_id', 'id');
    // }

    // public function allChildFiles()
    // {
    //     return $this->childFiles()->with('allChildFiles');
    // }
}
