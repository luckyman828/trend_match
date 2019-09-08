// Product Model
import { Model } from '@vuex-orm/core'
import Comment from './Comment';
import Action from './Action';
import ProductFinalAction from './ProductFinalAction';
import TeamProduct from './TeamProduct';
import PhaseProduct from './PhaseProduct';

export default class Product extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'products'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    const data = {
      id: this.attr(null),
      datasource_id: this.attr(''),
      title: this.attr(''),
      short_description: this.attr(''),
      sale_description: this.attr(''),
      brand: this.attr(''),
      collection_id: this.attr(''),
      is_editor_choice: this.attr(''),
      quantity: this.attr(''),
      wholesale_price: this.attr(''),
      recommended_retail_price: this.attr(''),
      prices: this.attr(''),
      composition: this.attr(''),
      mark_up: this.attr(''),
      category_id: this.attr(''),
      sub_category_id: this.attr(''),
      color_variants: this.attr(''),
      comments: this.hasMany(Comment, 'product_id'),
      actions: this.hasMany(Action, 'product_id'),
      productFinalAction: this.hasOne(ProductFinalAction, 'product_id'),
      teamActions: this.hasMany(TeamProduct, 'product_id'),
      phaseActions: this.hasMany(PhaseProduct, 'product_id'),
    }

    return data
  }
}