// Product Model
import { Model } from '@vuex-orm/core'
import Comment from './Comment';
import Action from './Action';
import ProductFinalAction from './ProductFinalAction';

export default class Product extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'products'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    const data = {
      id: this.attr(null),
      title: this.attr(''),
      images: this.attr(''),
      collection_id: this.attr(''),
      is_editor_choice: this.attr(''),
      comments: this.hasMany(Comment, 'product_id'),
      actions: this.hasMany(Action, 'product_id'),
      productFinalAction: this.hasOne(ProductFinalAction, 'product_id'),
    }

    return data
  }
}