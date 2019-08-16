// Team Invites Model
import { Model } from '@vuex-orm/core'
// import Team from './Team';
// import User from './User';

export default class TeamInvite extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'teamInvites'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.

  static primaryKey = ['email', 'team_id']

  static fields () {
    const data = {
      email: this.attr(null),
      team_id: this.attr(null),
    }

    return data
  }
}