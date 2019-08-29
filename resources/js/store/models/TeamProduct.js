// Product Model
import { Model } from '@vuex-orm/core'
import Team from './Team';

export default class TeamProduct extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'teamProducts'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.

  static primaryKey = ['team_id', 'product_id', 'phase_id']

  static fields () {
    const data = {
        team_id: this.attr(''),
        product_id: this.attr(''),
        phase_id: this.attr(''),
        action: this.attr(''),
        team: this.belongsTo(Team, 'team_id')
    }

    return data
  }
}