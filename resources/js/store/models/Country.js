// Product Model
import { Model } from '@vuex-orm/core'
import User from './User';

export default class Country extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'countries'


  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    const data = {
      id: this.attr(null),
      title: this.attr(''),
      users: this.hasMany(User, 'country_id'),
    }

    return data
  }
}