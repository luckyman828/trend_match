// Product Model
import { Model } from '@vuex-orm/core'
import FileTask from './FileTask'
import Task from './Task'

export default class TaskParent extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'taskParents'

    static primaryKey = ['task_id', 'parent_id']

    static fields() {
        const data = {
            task_id: this.attr(''),
            parent_id: this.attr(''),
            completed: this.hasMany(FileTask, 'task_id', 'parent_id'),
            parentTask: this.belongsTo(Task, 'parent_id'),
        }

        return data
    }
}
