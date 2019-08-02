<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CommentVote extends Model
{
    use Traits\HasCompositePrimaryKey;

    protected $table = 'product_comment_votes';
    protected $primaryKey = ['comment_id', 'user_id'];
    public $timestamps = false;
}
