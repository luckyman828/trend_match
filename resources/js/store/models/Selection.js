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
            completed: this.attr(false),
            owners: this.attr(null),
            users: this.attr([]),
            teams: this.attr([]),
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
            user_role: this.attr('Member'),

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
