// Team Model
import { Model } from '@vuex-orm/core'

export default class SubfileTeam extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'subfileTeams'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.

    static primaryKey = ['subfile_id', 'team_id']

    static fields() {
        const data = {
            subfile_id: this.attr(null),
            team_id: this.attr(null),
        }

        return data
    }
}
