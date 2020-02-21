import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import database from './database'
// import authUser from './modules/authUser'
import persist from './modules/persist'
import VuexORMisDirtyPlugin from '@vuex-orm/plugin-change-flags'
VuexORM.use(VuexORMisDirtyPlugin)

// Load Vuex
Vue.use(Vuex)

// Create Vuex Store and register database through Vuex ORM.
const store = new Vuex.Store({
    plugins: [VuexORM.install(database)],
    modules: {
        // authUser
        persist,
    },
})

export default store
