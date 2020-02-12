import { Model } from '@vuex-orm/core'
import User from './User'
import Team from './Team'

export default class Request extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'requests'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        const data = {
            id: this.attr(null),
            product_id: this.attr(''),
            selection_id: this.attr(''),
            team_id: this.attr(''),
            user_id: this.attr(''),
            body: this.attr(''),
            status: this.attr(''),
            user: this.belongsTo(User, 'user_id'),
            team: this.belongsTo(Team, 'team_id'),
        }

        return data
    }
}
