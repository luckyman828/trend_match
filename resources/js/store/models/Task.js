// Product Model
import { Model } from '@vuex-orm/core'
import FileTask from './FileTask'
import TaskParent from './TaskParent'
import TaskTeam from './TaskTeam'
import Action from './Action'

export default class Task extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'tasks'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.

    static fields() {
        const data = {
            id: this.attr(''),
            phase_id: this.attr(''),
            title: this.attr(''),
            type: this.attr(''),
            inherit_from_id: this.attr(''),
            filter_products_by_ids: this.attr(''),
            completed: this.hasMany(FileTask, 'task_id'),
            parents: this.hasMany(TaskParent, 'task_id'),
            children: this.hasMany(TaskParent, 'parent_id'),
            taskTeams: this.hasMany(TaskTeam, 'task_id'),
            actions: this.hasMany(Action, 'task_id'),
        }

        return data
    }
}
