// User Model
import { Model } from '@vuex-orm/core'
import Comment from './Comment'
import Country from './Country'
import Team from './Team'
import UserTeam from './UserTeam'
import Role from './Role'
import Action from './Action'
import WorkspaceUser from './WorkspaceUser'

export default class User extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'users'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    // static primaryKey = 'id'

    static fields() {
        const data = {
            id: this.attr(null),
            email: this.attr(''),
            name: this.attr('no name set'),
            country_id: this.attr(''),
            role_id: this.attr(''),
            impact: this.attr(null),
            currency: this.attr(null),
            comments: this.hasMany(Comment, 'user_id'),
            country: this.belongsTo(Country, 'country_id'),
            role: this.belongsTo(Role, 'role_id'),
            teams: this.belongsToMany(Team, UserTeam, 'user_id', 'team_id'),
            actions: this.hasMany(Action, 'user_id'),
            workspaceUsers: this.hasMany(WorkspaceUser, 'user_id', 'id'),
            userTeams: this.hasMany(UserTeam, 'user_id'),
            // assigned_room_id: this.attr(''),
            teamRoleId: this.attr(''),
        }
        return data
    }

    teamRole(roleId) {
        switch (roleId) {
            case 1:
                return 'Member'
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
    get workspaceUser() {
        return this.workspaceUsers[0]
    }
    get workspaceRoleId() {
        return this.workspaceUser.permission_level
    }
    get workspaceRole() {
        switch (this.workspaceUser.permission_level) {
            case 0:
                return 'External'
                break
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
