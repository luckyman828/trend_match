// Product Model
import { Model } from '@vuex-orm/core'

export default class ProductFinalAction extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'productFinalActions'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.

  static primaryKey = 'product_id'

  static fields () {
    const data = {
      product_id: this.attr(''),
      phase: this.attr(''),
      action: this.attr(''),
    }

    return data
  }
}