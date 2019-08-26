// User Model
import { Model } from '@vuex-orm/core'
import User from './User';
import WorkspaceUser from './WorkspaceUser';

export default class Workspace extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'workspaces'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  // static primaryKey = 'id'

  static fields () {
    const data = {
      id: this.attr(null),
      name: this.attr(''),
      users: this.belongsToMany(User, WorkspaceUser, 'workspace_id', 'user_id'),
      workspace_users: this.hasMany(WorkspaceUser, 'workspace_id')
    }

    return data
  }
}