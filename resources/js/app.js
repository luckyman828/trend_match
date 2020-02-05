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

// Global components
// Vue.component('TooltipAlt2', require('./components/TooltipAlt2.vue').default)
// Vue.component('Tooltip', require('./components/TooltipAlt2.vue').default)
Vue.component('TooltipList', require('./components/TooltipList.vue').default)
Vue.component('Toggle', require('./components/Toggle.vue').default)
Vue.component('Loader', require('./components/Loader.vue').default)
Vue.component('Modal', require('./components/Modal.vue').default)
Vue.component('Dropdown', require('./components/Dropdown.vue').default)
// Vue.component('AutoWidthTable', require('./components/AutoWidthTable.vue').default)
Vue.component('FlexTable', require('./components/FlexTable.vue').default)
Vue.component('TableHeader', require('./components/TableHeader.vue').default)
Vue.component('Checkbox', require('./components/Checkbox.vue').default)
Vue.component('Radiobox', require('./components/Radiobox.vue').default)
Vue.component('TableTopBar', require('./components/TableTopBar.vue').default)
Vue.component('FlyIn', require('./components/FlyIn.vue').default)
Vue.component('FlyinHeader', require('./components/FlyinHeader.vue').default)
Vue.component('FlyinHeaderNavigation', require('./components/FlyinHeaderNavigation.vue').default)
Vue.component('ContextMenu', require('./components/ContextMenu.vue').default)
Vue.component('EditInputWrapper', require('./components/EditInputWrapper.vue').default)
Vue.component('RadioButtons', require('./components/RadioButtons.vue').default)
Vue.component('CheckButtons', require('./components/CheckButtons.vue').default)
Vue.component('SelectButtons', require('./components/SelectButtons.vue').default)
Vue.component('SelectButton', require('./components/SelectButton.vue').default)
Vue.component('SearchField', require('./components/SearchField.vue').default)
Vue.component('InputField', require('./components/InputField.vue').default)
Vue.component('Droparea', require('./components/Droparea.vue').default)

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

// 1. Define route components.
// These can be imported from other files
// import Collection from './components/screens/Collection'
// import Catalogue from './components/screens/Catalogue'
// import Teams from './components/screens/Teams'
import TeamsLoader from './components/screens/loaders/TeamsLoader'
import UsersLoader from './components/screens/loaders/UsersLoader'
import FileLoader from './components/screens/loaders/FileLoader'
import FolderLoader from './components/screens/loaders/FolderLoader'
import EditFileLoader from './components/screens/loaders/EditFileLoader'
import SubfileLoader from './components/screens/loaders/SubfileLoader'

const routes = [
    { path: '/file/:fileId', name: 'file', component: FileLoader },
    { path: '/file/:fileId/edit', name: 'editFile', component: EditFileLoader },
    { path: '/files', name: 'files', component: FolderLoader },
    { path: '/teams', name: 'teams', component: TeamsLoader },
    { path: '/users', name: 'users', component: TeamsLoader },
    { path: '/file/:fileId/:subfileId', name: 'subfile', component: SubfileLoader },
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
