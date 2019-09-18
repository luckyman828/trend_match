// Product Model
import { Model } from '@vuex-orm/core'
import TeamFile from './TeamFile';
import Team from './Team';
import Product from './Product';

export default class Collection extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'collections'

  // List of all fields (schema) of the product model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    const data = {
      id: this.attr(null),
      room_code: this.attr(''),
      title: this.attr(''),
      phase: this.attr(''),
      catalog_id: this.attr(''),
      start_time: this.attr('unset'),
      end_time: this.attr('unset'),
      teamFiles: this.hasMany(TeamFile, 'file_id'),
      products: this.attr(''),
      // products: this.hasMany(Product, 'collection_id'),
      teams: this.belongsToMany(Team, TeamFile, 'file_id', 'team_id'),
    }

    return data
  }
}