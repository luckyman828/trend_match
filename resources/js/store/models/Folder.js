// Product Model
import { Model } from '@vuex-orm/core'
import File from './Collection'

export default class Folder extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'folders'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        const data = {
            id: this.attr(null),
            workspace_id: this.attr(''),
            title: this.attr(''),
            created_at: this.attr(''),
            updated_at: this.attr(''),
            parent_id: this.attr(''),
            owners: this.attr([]),
            files: this.hasMany(File, 'folder_id'),
            folders: this.hasMany(Folder, 'parent_id'),
            parent: this.belongsTo(Folder, 'parent_id'),
        }

        return data
    }
}
