<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PhaseTeam extends Model
{
    use Traits\HasCompositePrimaryKey;
    protected $primaryKey = ['phase_id', 'team_id', 'role_id'];

    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id');
    }
    public function phase()
    {
        return $this->belongsTo(Phase::class, 'phase_id');
    }
}
