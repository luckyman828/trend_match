import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

Vue.use(VueRouter)

// Define route components

// import RecoverPasswordScreen from './pages/LoginPage/RecoverPasswordScreen'
// import VerificationCodeScreen from './pages/LoginPage/VerificationCodeScreen'
// import SetNewPasswordScreen from './pages/LoginPage/SetNewPasswordScreen'
// import TeamsPage from './pages/TeamsPage'
// import UsersPage from './pages/UsersPage'
// import SelectionPage from './pages/SelectionPage'
// import FilesPage from './pages/FilesPage'
// import EditFilePage from './pages/EditFilePage'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "LoginScreen" */ './pages/LoginPage/LoginScreen'),
    },
    {
        path: '/login/recover-password',
        name: 'recoverPassword',
        component: () =>
            import(/* webpackChunkName: "RecoverPasswordScreen" */ './pages/LoginPage/RecoverPasswordScreen'),
    },
    {
        path: '/login/verification-code',
        name: 'verificationCode',
        component: () =>
            import(/* webpackChunkName: "VerificationCodeScreen" */ './pages/LoginPage/VerificationCodeScreen'),
    },
    {
        path: '/login/set-new-password',
        name: 'setNewPassword',
        component: () =>
            import(/* webpackChunkName: "SetNewPasswordScreen" */ './pages/LoginPage/SetNewPasswordScreen'),
    },
    {
        path: '/file/:fileId/edit',
        name: 'editFile',
        component: () => import(/* webpackChunkName: "EditFilePage" */ './pages/EditFilePage'),
    },
    {
        path: '/files',
        name: 'files',
        component: () => import(/* webpackChunkName: "FilesPage" */ './pages/FilesPage'),
    },
    {
        path: '/teams',
        name: 'teams',
        component: () => import(/* webpackChunkName: "TeamsPage" */ './pages/TeamsPage'),
    },
    {
        path: '/users',
        name: 'users',
        component: () => import(/* webpackChunkName: "UsersPage" */ './pages/UsersPage'),
    },
    {
        path: '/file/:fileId/selection/:selectionId',
        name: 'selection',
        component: () => import(/* webpackChunkName: "SelectionPage" */ './pages/SelectionPage'),
    },
    {
        path: '/file/:fileId/video/edit',
        name: 'editVideoPresentation',
        component: () => import(/* webpackChunkName: "VideoPresentationName" */ './pages/EditVideoPresentationPage'),
    },
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

    if (to.name == 'verificationCode' && !store.getters['auth/getPasswordRecoveryEmail']) {
        next({ name: 'login' })
    } else if (to.name == 'setNewPassword' && !store.getters['auth/getPasswordRecoverySessionId']) {
        next({ name: 'login' })
    }

    // Check that the user is not going to the login page already
    else if (!to.path.startsWith('/login') && !store.getters['auth/isAuthenticated']) {
        next({
            name: 'login',
            params: {
                nextUrl: to.fullPath,
            },
        })
    } else next()
})

export default router
