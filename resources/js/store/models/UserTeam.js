// Product Model
import { Model } from '@vuex-orm/core'
import Team from './Team'
import User from './User'

export default class UserTeam extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'userTeams'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.

    static primaryKey = ['user_id', 'team_id']

    static fields() {
        const data = {
            user_id: this.attr(''),
            team_id: this.attr(''),
            team: this.belongsTo(Team, 'team_id', 'id'),
            user: this.belongsTo(User, 'user_id', 'id'),
        }

        return data
    }
}
