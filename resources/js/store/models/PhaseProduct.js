// Product Model
import { Model } from '@vuex-orm/core'
import Product from './Product';

export default class PhaseProduct extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'phaseProducts'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.

  static primaryKey = ['phase_id', 'product_id']

  static fields () {
    const data = {
        phase_id: this.attr(''),
        product_id: this.attr(''),
        action: this.attr(''),
        products: this.hasMany(Product, 'id', 'product_id')
    }

    return data
  }
}