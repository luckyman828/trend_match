import Vue from 'vue'
import Vuex from 'vuex'
import persist from './modules/persist'
import auth from './modules/auth'
import workspaces from './modules/workspaces'
import teams from './modules/teams'
import users from './modules/users'
import files from './modules/files'
import folders from './modules/folders'
import selections from './modules/selections'
import products from './modules/products'
import actions from './modules/actions'
import alerts from './modules/alerts'
import comments from './modules/comments'
import requests from './modules/requests'
import contextMenu from './modules/contextMenu'
import presenterQueue from './modules/presenterQueue'
import lightbox from './modules/lightbox'
import tables from './modules/tables'

// Load Vuex
Vue.use(Vuex)

// Create Vuex Store and register database through Vuex ORM.
const store = new Vuex.Store({
    modules: {
        persist,
        auth,
        workspaces,
        teams,
        users,
        files,
        folders,
        selections,
        products,
        actions,
        alerts,
        comments,
        requests,
        contextMenu,
        presenterQueue,
        lightbox,
        tables,
    },
})

export default store
