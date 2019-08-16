<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TeamInvite extends Model
{
    use Traits\HasCompositePrimaryKey;

    // protected $table = 'team_invites';
    protected $primaryKey = ['email', 'team_id'];
    // public $timestamps = false;

    /**
     * The name of the "updated at" column.
     *
     * @var string
     */
    const UPDATED_AT = null;
}
