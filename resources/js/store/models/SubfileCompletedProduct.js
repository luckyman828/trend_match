// Team Model
import { Model } from '@vuex-orm/core'

export default class SubfileCompletedProduct extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'subfileCompletedProducts'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.

    static primaryKey = ['subfile_id', 'product_id']

    static fields() {
        const data = {
            subfile_id: this.attr(null),
            product_id: this.attr(null),
        }

        return data
    }
}
