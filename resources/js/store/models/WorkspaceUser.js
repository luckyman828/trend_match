// Product Model
import { Model } from '@vuex-orm/core'
import Workspace from './Workspace'
import User from './User'

export default class WorkspaceUser extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'workspaceUsers'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.

    static primaryKey = ['workspace_id', 'user_id']

    static fields() {
        const data = {
            workspace_id: this.attr(null),
            user_id: this.attr(null),
            permission_level: this.attr(''),
            workspaces: this.hasMany(Workspace, 'id', 'workspace_id'),
            users: this.hasMany(User, 'id', 'user_id'),
        }
        return data
    }
    get workspaceRole() {
        switch (this.permission_level) {
            case 1:
                return 'User'
                break
            case 2:
                return 'Observer'
                break
            case 3:
                return 'Admin'
                break
            case 4:
                return 'Owner'
                break
        }
    }
}
