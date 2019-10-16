import { Model } from '@vuex-orm/core'

export default class TaskAction extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'taskActions'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.

    static primaryKey = ['task_id', 'product_id']

    static fields() {
        const data = {
            task_id: this.attr(null),
            product_id: this.attr(''),
            team_id: this.attr(''),
            user_id: this.attr(''),
            action: this.attr(''),
        }

        return data
    }
}
