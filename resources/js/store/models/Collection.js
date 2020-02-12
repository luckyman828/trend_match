// Product Model
import { Model } from '@vuex-orm/core'
import TeamFile from './TeamFile'
import Team from './Team'
import Product from './Product'
import Selection from './Selection'

export default class Collection extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'collections'

    // List of all fields (schema) of the product model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        const data = {
            id: this.attr(null),
            workspace_id: this.attr(''),
            title: this.attr(''),
            phase: this.attr(''),
            catalog_id: this.attr(''),
            folder_id: this.attr(''),
            start_date: this.attr('unset'),
            end_date: this.attr('unset'),
            owners: this.attr([]),
            approvers: this.attr([]),
            teamFiles: this.hasMany(TeamFile, 'file_id'),
            products: this.attr(''),
            // products: this.hasMany(Product, 'collection_id'),
            selections: this.hasMany(Selection, 'file_id'),
            teams: this.belongsToMany(Team, TeamFile, 'file_id', 'team_id'),
        }

        return data
    }
}
