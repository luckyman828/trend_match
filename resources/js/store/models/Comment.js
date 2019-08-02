// Product Model
import { Model } from '@vuex-orm/core'
import User from './User';
import CommentVote from './CommentVote';

export default class Comment extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'comments'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    const data = {
      id: this.attr(null),
      user_id: this.attr(''),
      product_id: this.attr(''),
      comment: this.attr(''),
      important: this.attr(''),
      final: this.attr(''),
      product_final: this.attr(''),
      user: this.belongsTo(User, 'user_id'),
      votes: this.hasMany(CommentVote, 'comment_id'),
    }

    return data
  }
}