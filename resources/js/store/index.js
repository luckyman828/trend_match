import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import database from './database'
// import authUser from './modules/authUser'
import persist from './modules/persist'
import auth from './modules/auth'
import workspaces from './modules/workspaces'
import teams from './modules/teams'
import users from './modules/users'
import files from './modules/files'
import folders from './modules/folders'
import selections from './modules/selections'
import VuexORMisDirtyPlugin from '@vuex-orm/plugin-change-flags'
VuexORM.use(VuexORMisDirtyPlugin)

// Load Vuex
Vue.use(Vuex)

// Create Vuex Store and register database through Vuex ORM.
const store = new Vuex.Store({
    plugins: [VuexORM.install(database)],
    modules: {
        persist,
        auth,
        workspaces,
        teams,
        users,
        files,
        folders,
        selections,
    },
})

export default store
