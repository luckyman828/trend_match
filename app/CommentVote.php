<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CommentVote extends Model
{
    use Traits\HasCompositePrimaryKey;

    protected $table = 'product_comment_votes';
    protected $primaryKey = ['comment_id', 'user_id'];
    public $timestamps = false;

    public function product()
    {
        return $this->hasOneThrough(Product::class, Comment::class, 'id', 'id', 'comment_id', 'product_id');
    }
    public function comment()
    {
        return $this->belongsTo(Comment::class, 'comment_id', 'id');
    }

}
