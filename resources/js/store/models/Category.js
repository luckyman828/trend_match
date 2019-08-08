// Product Model
import { Model } from '@vuex-orm/core'
import Product from './Product';

export default class Collection extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'categories'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    const data = {
      id: this.attr(''),
      title: this.attr(''),
      parrent: this.attr(''),
      products: this.hasMany(Product, 'category_id')
    }

    return data
  }
}