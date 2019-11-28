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

import directive from './directive'
Vue.use(directive)
import dragscrollDirective from './dragscrollDirective'
Vue.use(dragscrollDirective)

Vue.component('app', require('./App.vue').default)

// Global components
Vue.component('TooltipAlt2', require('./components/TooltipAlt2.vue').default)
Vue.component('Tooltip', require('./components/TooltipAlt2.vue').default)
Vue.component('Toggle', require('./components/Toggle.vue').default)
Vue.component('Loader', require('./components/Loader.vue').default)
Vue.component('Modal', require('./components/Modal.vue').default)
Vue.component('Dropdown', require('./components/Dropdown.vue').default)
Vue.component('GridTable', require('./components/GridTable.vue').default)
Vue.component('Checkbox', require('./components/Checkbox.vue').default)

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

// Define global mixins
// Vue.mixin({
//   methods: {
//     groupBy(prop) {
//       return this.reduce(function(groups, item) {
//         const val = item[prop]
//         groups[val] = groups[val] || []
//         groups[val].push(item)
//         return groups
//       }, {})
//     }
//   }
// })

// 1. Define route components.
// These can be imported from other files
// import Collection from './components/screens/Collection'
// import Catalogue from './components/screens/Catalogue'
// import Teams from './components/screens/Teams'
import TeamsLoader from './components/screens/loaders/TeamsLoader'
import FileLoader from './components/screens/loaders/FileLoader'
import FolderLoader from './components/screens/loaders/FolderLoader'
import EditFileLoader from './components/screens/loaders/EditFileLoader'

const routes = [
    { path: '/file/:fileId', name: 'file', component: FileLoader },
    { path: '/file/:fileId/edit', name: 'editFile', component: EditFileLoader },
    { path: '/files', name: 'files', component: FolderLoader },
    { path: '/teams', name: 'teams', component: TeamsLoader },
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
