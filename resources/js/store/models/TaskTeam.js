// Product Model
import { Model } from '@vuex-orm/core'
import FileTask from './FileTask'
import Task from './Task'
import Team from './Team'

export default class TaskTeam extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'taskTeams'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.

    static primaryKey = ['task_id', 'team_id', 'role_id']

    static fields() {
        const data = {
            task_id: this.attr(null),
            team_id: this.attr(null),
            role_id: this.attr(null),
            team: this.belongsTo(Team, 'team_id'),
            completed: this.hasMany(FileTask, 'task_id', 'task_id'),
            task: this.belongsTo(Task, 'task_id'),
        }

        return data
    }
}
