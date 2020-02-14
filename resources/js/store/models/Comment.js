// Product Model
import { Model } from '@vuex-orm/core'
import User from './User'
import CommentVote from './CommentVote'
import Team from './Team'

export default class Comment extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'comments'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        const data = {
            id: this.attr(''),
            product_id: this.attr(''),
            selection_id: this.attr(''),
            team_id: this.attr(''),
            user_id: this.attr(''),
            comment: this.attr(''),
            body: this.attr(''),
            important: this.attr(''),
            is_request: this.attr(''),
            created_at: this.attr(new Date()),
            // user: this.belongsTo(User, 'user_id'),
            team: this.belongsTo(Team, 'team_id'),
            // task: this.belongsTo(Task, 'task_id'),
            votes: this.hasMany(CommentVote, 'comment_id'),

            selection: this.attr({
                name: 'unknown selection',
            }),
            user: this.attr({
                name: 'unknown user',
            }),

            // Custom added
            failed: this.attr(false),
        }

        return data
    }
}
