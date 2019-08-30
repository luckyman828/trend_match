// Team Model
import { Model } from '@vuex-orm/core'
import User from './Team'
import UserTeam from './UserTeam';
import TeamInvite from './TeamInvite';

export default class Team extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'teams'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  // static primaryKey = 'id'

  static fields () {
    const data = {
      id: this.attr(null),
      title: this.attr(''),
      workspace_id: this.attr(''),
      users: this.belongsToMany(User, UserTeam, 'team_id', 'user_id'),
      invites: this.hasMany(TeamInvite, 'team_id'),
    }

    return data
  }
}