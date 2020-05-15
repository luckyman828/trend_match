import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

Vue.use(VueRouter)

// Define route components
import LoginPage from './pages/Login'
import TeamsPage from './pages/TeamsPage'
import UsersPage from './pages/UsersPage'
import SelectionPage from './pages/SelectionPage'
import FilesPage from './pages/FilesPage'
import EditFilePage from './pages/EditFilePage'

const routes = [
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/file/:fileId/edit', name: 'editFile', component: EditFilePage },
    { path: '/files', name: 'files', component: FilesPage },
    { path: '/teams', name: 'teams', component: TeamsPage },
    { path: '/users', name: 'users', component: UsersPage },
    { path: '/file/:fileId/selection/:selectionId', name: 'selection', component: SelectionPage },
    { path: '*', redirect: '/files' },
]

const router = new VueRouter({
    routes, // short for `routes: routes`
    // mode: 'history' // remove '#' from urls. To enable this we need some server configuration
    // link here: https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
})

router.beforeEach((to, from, next) => {
    // Reset current folder
    if (!['files', 'editFile', 'selection'].includes(to.name)) {
        // If we are not going to a file related path --> reset the current folder
        store.commit('files/SET_CURRENT_FOLDER', null)
    }

    // Check that the user is not going to the login page already
    if (to.path !== '/login' && !store.getters['auth/isAuthenticated']) {
        // If the user is not authenticated
        next({
            name: 'login',
            params: {
                nextUrl: to.fullPath,
            },
        })
    } else next()
})

export default router
