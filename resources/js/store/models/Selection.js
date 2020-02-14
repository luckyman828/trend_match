// Team Model
import { Model } from '@vuex-orm/core'

export default class Selection extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'selections'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.

    static fields() {
        const data = {
            id: this.attr(null),
            file_id: this.attr(null),
            name: this.attr(null),
            parent_id: this.attr(null),
            master: this.boolean(false),
            hidden: this.boolean(false),
            locked: this.boolean(false),
            unhide_date: this.attr(null),
            unlock_date: this.attr(null),
            feedback_open: this.attr(false),
            anonymize_feedback: this.attr(false),
            anonymize_requests: this.attr(false),
            anonymize_comments: this.attr(false),
            anonymize_childrens_requests: this.attr(false),
            anonymize_childrens_comments: this.attr(false),
            anonymize_childrens_actions: this.attr(false),
            children_requests_public: this.attr(false),
            children_comments_public: this.attr(false),
            children_actions_public: this.attr(false),
            requests_public: this.attr(false),
            comments_public: this.attr(false),
            actions_public: this.attr(false),
            view_sibling_requests: this.attr(false),
            view_sibling_comments: this.attr(false),
            view_sibling_actions: this.attr(false),
            completed: this.attr(false),
            owners: this.attr([]),
            feedback_users: this.attr([]),
            options: this.attr({
                comments: {
                    broadcast: [],
                    listen: [],
                    anonymize: false,
                },
                requests: {
                    broadcast: [],
                    listen: [],
                },
                actions: {
                    broadcast: [],
                    listen: [],
                    anonymize: false,
                },
                feedback: {
                    broadcast: [],
                    listen: [],
                    anonymize: false,
                },
            }),
            user_access: this.attr('user'),

            // Staudemeir attributes
            descendants: this.attr(false),
            depth: this.attr(),
            path: this.attr(),

            children: this.attr(),

            // Relationships
            // children: this.hasMany(Subfile, 'parent_id', 'id'),
            // parent: this.belongsTo(Subfile, 'parent_id', 'id'),
        }

        return data
    }
    get splitPath() {
        const arr = this.path.split('.')
        arr.pop()
        return arr
    }
}
