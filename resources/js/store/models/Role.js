// Team Model
import { Model } from '@vuex-orm/core'
import AuthUser from './AuthUser';

export default class Role extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'roles'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  // static primaryKey = 'id'

  static fields () {
    const data = {
      id: this.attr(null),
      title: this.attr(''),
      authUser: this.hasOne(AuthUser, 'role_id'),
    }

    return data
  }
}