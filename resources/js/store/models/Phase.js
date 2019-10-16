// Product Model
import { Model } from '@vuex-orm/core'

export default class Phase extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'phases'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.

    static fields() {
        const data = {
            id: this.attr(''),
            workspace_id: this.attr(''),
            title: this.attr(''),
        }

        return data
    }
}
