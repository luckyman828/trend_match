<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    public function phase()
    {
        return $this->belongsTo(Phase::class, 'phase_id');
    }
    public function taskTeams()
    {
        return $this->hasMany(TaskTeam::class, 'task_id');
    }
    public function fileTasks()
    {
        return $this->hasMany(FileTask::class, 'task_id');
    }
}
