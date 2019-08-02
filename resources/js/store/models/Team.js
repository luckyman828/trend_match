// Product Model
import { Model } from '@vuex-orm/core'
import User from './User'

export default class Team extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'teams'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    const data = {
      id: this.attr(null),
      title: this.attr(null),
      users: this.hasMany(User, 'team_ids'),
    }

    return data
  }
}