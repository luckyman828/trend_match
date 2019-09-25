<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TaskTask extends Model
{
    use Traits\HasCompositePrimaryKey;

    protected $primaryKey = ['task_id', 'parent_id'];

    public function phase()
    {
        return $this->hasOneThrough(Phase::class, Task::class, 'id', 'id', 'task_id', 'phase_id');
    }
}
