<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'prices' => 'array',
        'assortments' => 'array',
        'eans' => 'array',
        'color_variants' => 'array',
    ];
}
