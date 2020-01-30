// Team Model
import { Model } from '@vuex-orm/core'

export default class SubfileUser extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'subfileUsers'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.

    static primaryKey = ['subfile_id', 'user_id']

    static fields() {
        const data = {
            subfile_id: this.attr(null),
            user_id: this.attr(null),
            owner: this.attr(false),
            exclude: this.attr(false),
            team_dependent: this.attr(false),
        }

        return data
    }
}
