import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import database from './database'
import authUser from './modules/authUser'

// Load Vuex
Vue.use(Vuex);

// Create Vuex Store and register database through Vuex ORM.
const store = new Vuex.Store({
    plugins: [VuexORM.install(database)],
    modules: {
      authUser
    }
  })
  
export default store