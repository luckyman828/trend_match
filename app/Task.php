<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    public function phase()
    {
        return $this->belongsTo(Phase::class, 'phase_id');
    }
}
