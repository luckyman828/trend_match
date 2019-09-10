// Product Model
import { Model } from '@vuex-orm/core'
import Comment from './Comment';
import User from './User';

export default class CommentVote extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'commentVotes'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.

  static primaryKey = ['comment_id', 'user_id']

  static fields () {
    const data = {
      comment_id: this.attr(null),
      user_id: this.attr(''),
      user: this.belongsTo(User, 'user_id'),
      comment: this.belongsTo(Comment, 'comment_id')
    }

    return data
  }
}