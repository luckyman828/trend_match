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
import display from './modules/display'
import videoComments from './modules/videoComments'
import productFilters from './modules/productFilters'
import selectionProducts from './modules/selectionProducts'
import kollektApps from './modules/kollektApps'
import kollektFeatures from './modules/kollektFeatures'
import productGroups from './modules/productGroups'

//PLAY
import videos from './modules/play/videos'
import playPresentations from './modules/play/presentations'
import player from './modules/play/player'
import playPresentation from './modules/play/presentation'
import playEmbed from './modules/play/embed'

// PLAY B2C
import wishlist from './modules/playb2c/wishlist'
import basket from './modules/playb2c/basket'

// BUY
import buyProducts from './modules/buy/buyProducts'
import backgroundJobs from './modules/backgroundJobs'
import liveUpdates from './modules/liveUpdates'
import supportLog from './modules/supportLog'

// INTERGRATIONS
import integrationDkc from './modules/integrations/dkc'
import bonaparte from './modules/integrations/dkc/bonaparte'

const cloneDeep = require('clone-deep')

// Load Vuex
Vue.use(Vuex)

// Initial store with modules as an object
export const initialStoreModules = {
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
    display,
    videoComments,
    productFilters,
    selectionProducts,
    wishlist,
    basket,
    videos,
    kollektApps,
    kollektFeatures,
    buyProducts,
    integrationDkc,
    backgroundJobs,
    liveUpdates,
    supportLog,
    playPresentations,
    playPresentation,
    player,
    playEmbed,
    bonaparte,
    productGroups,
}

// const store = new Vuex.Store({

const store = new Vuex.Store({
    modules: cloneDeep(initialStoreModules),
    mutations: {
        // reset default state modules by looping around the initialStoreModules
        RESET_STATE(state) {
            for (const key of Object.keys(initialStoreModules)) {
                const value = cloneDeep(initialStoreModules[key].state)
                state[key] = value
            }
        },
    },
})
// Set the token in the store
try {
    store.state.auth.token = localStorage.getItem('user-token') || ''
} catch (e) {}
export default store
