import { Model } from '@vuex-orm/core'
import TaskTeam from './TaskTeam'
import Task from './Task'

export default class FileTask extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'fileTasks'

    static primaryKey = ['file_id', 'task_id']

    static fields() {
        const data = {
            file_id: this.attr(''),
            task_id: this.attr(''),
            // taskTeams: this.hasMany(TaskTeam, 'task_id', 'task_id'),
            // tasks: this.belongsTo(Task, 'task_id', 'task_id'),
        }

        return data
    }
}
