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
import presentationQueue from './modules/presentationQueue'
import lightbox from './modules/lightbox'
import tables from './modules/tables'
import changelog from './modules/changelog'
import flyin from './modules/flyin'
import mapProductData from './modules/mapProductData'
import videoPresentation from './modules/videoPresentation'
import videoPlayer from './modules/videoPlayer'
import routes from './modules/routes'
import scanner from './modules/scanner'
import presentation from './modules/presentation'
import responsive from './modules/responsive'

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
        presentationQueue,
        lightbox,
        tables,
        changelog,
        flyin,
        mapProductData,
        videoPresentation,
        videoPlayer,
        routes,
        scanner,
        presentation,
        responsive,
    },
})

export default store
