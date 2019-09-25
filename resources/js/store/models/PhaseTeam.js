// Product Model
import { Model } from '@vuex-orm/core'

export default class PhaseTeam extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'phaseTeams'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.

    static primaryKey = ['phase_id', 'team_id']

    static fields() {
        const data = {
            phase_id: this.attr(null),
            team_id: this.attr(null),
            role_level: this.attr(null),
        }

        return data
    }
}
