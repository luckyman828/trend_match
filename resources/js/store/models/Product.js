// Product Model
import { Model } from '@vuex-orm/core'
import Comment from './Comment'
import Action from './Action'
import TaskAction from './TaskAction'

export default class Product extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'products'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        const data = {
            id: this.attr(null),
            datasource_id: this.attr(null),
            title: this.attr(null),
            short_description: this.attr(null),
            category: this.attr(null),
            delivery_date: this.attr(null),
            sale_description: this.attr(null),
            brand: this.attr(null),
            collection_id: this.attr(null),
            is_editor_choice: this.attr(false),
            quantity: this.attr(null),
            variant_min_quantity: this.attr(null),
            prices: this.attr([]),
            composition: this.attr(null),
            category_id: this.attr(null),
            sub_category_id: this.attr(null),
            color_variants: this.attr([{ color: '', image: null, sizes: null, blob_ib: null }]),
            assortments: this.attr([]),
            comments: this.hasMany(Comment, 'product_id'),
            actions: this.hasMany(Action, 'product_id'),
            updated_at: this.attr(null),
            created_at: this.attr(null),
            buyer_group: this.attr(null),

            // Custom features added
            ins: this.attr([]),
            outs: this.attr([]),
            focus: this.attr([]),
            nds: this.attr([]),
            requests: this.attr([]),
            currentAction: this.attr(null),
        }
        return data
    }
}
