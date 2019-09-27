// Team Model
import { Model } from '@vuex-orm/core'
import User from './User'
import UserTeam from './UserTeam'
import Collection from './Collection'
import TeamFile from './TeamFile'
import TeamInvite from './TeamInvite'
import TeamProduct from './TeamProduct'
import TaskTeam from './TaskTeam'

export default class Team extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'teams'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    // static primaryKey = 'id'

    static fields() {
        const data = {
            id: this.attr(null),
            title: this.attr(''),
            workspace_id: this.attr(''),
            currency: this.attr(''),
            category_scope: this.attr(''),
            users: this.belongsToMany(User, UserTeam, 'team_id', 'user_id'),
            teamFiles: this.hasMany(TeamFile, 'team_id'),
            actions: this.hasMany(TeamProduct, 'team_id'),
            files: this.belongsToMany(Collection, TeamFile, 'team_id', 'file_id'),
            invites: this.hasMany(TeamInvite, 'team_id'),
            taskTeams: this.hasMany(TaskTeam, 'team_id', 'id'),
        }

        return data
    }
}
