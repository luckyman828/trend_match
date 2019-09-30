// Product Model
import { Model } from '@vuex-orm/core'
import Product from './Product'
import User from './User'

export default class Action extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'actions'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.

    static primaryKey = ['user_id', 'product_id', 'task_id']

    static fields() {
        const data = {
            user_id: this.attr(null),
            product_id: this.attr(''),
            team_id: this.attr(''),
            task_id: this.attr(''),
            action: this.attr(''),
            is_task_action: this.attr(''),
            product: this.belongsTo(Product, 'product_id'),
            user: this.belongsTo(User, 'user_id'),
        }

        return data
    }
}
