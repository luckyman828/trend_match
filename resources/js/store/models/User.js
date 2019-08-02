// Product Model
import { Model } from '@vuex-orm/core'
import Comment from './Comment'
import Country from './Country'

export default class User extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'users'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    const data = {
      id: this.attr(null),
      email: this.attr(''),
      // name: this.attr(''),
      country_id: this.attr(''),
      team_ids: this.attr(''),
      role_id: this.attr(''),
      comments: this.hasMany(Comment, 'user_id'),
      country: this.belongsTo(Country, 'country_id'),
      team: this.belongsTo(Country, 'team_ids')
    }

    return data
  }
}