require('./bootstrap')

window.Vue = require('vue')
import store from './store/index'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

// import VueDragscroll from 'vue-dragscroll'
// Vue.use(VueDragscroll)

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

import UUID from 'vue-uuid'
Vue.use(UUID)

// import directive from './directive'
// Vue.use(directive)
import dragscrollDirective from './dragscrollDirective'
Vue.use(dragscrollDirective)
import clickOutsideDirective from './clickOutsideDirective'
Vue.use(clickOutsideDirective)

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VueVirtualScroller from 'vue-virtual-scroller'
Vue.use(VueVirtualScroller)

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)
VTooltip.options.popover.defaultTrigger = 'hover focus'

import PortalVue from 'portal-vue'
Vue.use(PortalVue)

Vue.component('app', require('./App.vue').default)

// Automatically import base components
const requireComponent = require.context(
    // The relative path of the components folder
    './components',
    // Whether or not to look in subfolders
    true,
    // The regular expression used to match base component filenames
    /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
    // Get component config
    const componentConfig = requireComponent(fileName)

    // Get PascalCase name of component
    const componentName =
        // Gets the file name regardless of folder depth
        fileName
            .split('/')
            .pop()
            .replace(/\.\w+$/, '')

    // Register component globally
    Vue.component(
        componentName,
        // Look for the component options on `.default`, which will
        // exist if the component was exported with `export default`,
        // otherwise fall back to module's root.
        componentConfig.default || componentConfig
    )
})

// Define global filters
Vue.filter('truncate', function(value, limit) {
    if (value.length > limit) {
        value = value.substring(0, limit - 2) + '..'
    }

    return value
})
Vue.filter('formatDate', function(value) {
    return new Date(value).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
})

// Define route components
import TeamsPage from './pages/TeamsPage'
import SelectionPage from './pages/SelectionPage'
import FilesPage from './pages/FilesPage'
import EditFilePage from './pages/EditFilePage'

const routes = [
    { path: '/file/:fileId/edit', name: 'editFile', component: EditFilePage },
    { path: '/files', name: 'files', component: FilesPage },
    { path: '/teams', name: 'teams', component: TeamsPage },
    { path: '/users', name: 'users', component: TeamsPage },
    { path: '/file/:fileId/:selectionId', name: 'selection', component: SelectionPage },
    { path: '/file/:fileId/:selectionId/feedback', name: 'selectionFeedback', component: SelectionPage },
    { path: '*', redirect: '/files' },
]

const router = new VueRouter({
    routes, // short for `routes: routes`
    // mode: 'history' // remove '#' from urls. To enable this we need some server configuration
    // link here: https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
})

router.beforeEach((to, from, next) => {
    const authUser = window.auth_user
    // Guard paths
    // Guard teams
    if (to.path == '/teams' && authUser.role_id < 2) next('/files'), console.log('access denied')
    // Guard file edit
    else if (to.path.startsWith('/file') && to.path.endsWith('edit') && authUser.role_id < 3)
        next('/files'), console.log('access denied')
    else next()
})

const app = new Vue({
    store,
    router,
    el: '#app',
})
