import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

Vue.use(VueRouter)

// Define route components

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
        component: () =>
            import(/* webpackChunkName: "EditVideoPresentationPage" */ './pages/EditVideoPresentationPage'),
    },
    // {
    //     path: '/file/:fileId/selection/:selectionId/video/watch',
    //     name: 'watchVideoPresentation',
    //     component: () => import(/* webpackChunkName: "WatchVideoPresentationPage" */ './pages/VideoPresentationPage'),
    // },
    {
        path: '/file/:fileId/livestream/create',
        name: 'createLivestream',
        component: () => import(/* webpackChunkName: "createLivestreamPage" */ './pages/LivestreamPage'),
    },
    // {
    //     path: '/file/:fileId/selection/:selectionId/livestream/watch',
    //     name: 'watchLivestream',
    //     component: () => import(/* webpackChunkName: "watchLivestreamPage" */ './pages/WatchLivestreamPage'),
    // },
    {
        path: '/file/:fileId/selection/:selectionId/video/watch',
        name: 'watchVideoPresentation',
        component: () =>
            import(/* webpackChunkName: "watchVideoPresentationPage" */ './pages/WatchVideoPresentationPage'),
    },
    {
        path: '/file/:fileId/selection/:selectionId/video/watch/mobile',
        name: 'mobileVideoPresentation',
        component: () =>
            import(/* webpackChunkName: "watchVideoPresentationPage" */ './pages/MobileVideoPresentationPage'),
    },
    {
        path: '/file/:fileId/selection/:selectionId/video/watch/mobile/use-viewer',
        name: 'mobileVideoViewer',
        component: () =>
            import(
                /* webpackChunkName: "watchVideoPresentationPage" */ './pages/MobileVideoPresentationPage/VideoViewer'
            ),
    },
    {
        path: '/join/:linkHash',
        name: 'joinSelection',
        component: () => import(/* webpackChunkName: "joinSelectionPage" */ './pages/JoinSelectionPage'),
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import(/* webpackChunkName: "settingsPage" */ './pages/SettingsPage'),
    },
    { path: '*', redirect: '/files' },
]

const router = new VueRouter({
    routes, // short for `routes: routes`
    // mode: 'history' // remove '#' from urls. To enable this we need some server configuration
    // link here: https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
})

router.beforeEach(async (to, from, next) => {
    // Reset current folder
    if (!['files', 'editFile', 'selection'].includes(to.name)) {
        // If we are not going to a file related path --> reset the current folder
        store.commit('files/SET_CURRENT_FOLDER', null)
    }

    if (to.name == 'login' && from && from.name) {
        store.commit('routes/SET_NEXT_URL', from.fullPath)
    }

    if (to.name == 'verificationCode' && !store.getters['auth/getPasswordRecoveryEmail']) {
        next({ name: 'login' })
    } else if (to.name == 'setNewPassword' && !store.getters['auth/getPasswordRecoverySessionId']) {
        next({ name: 'login' })
    }

    if (to.name == 'watchVideoPresentation' && window.innerWidth < 1000) {
        next({ name: 'mobileVideoPresentation', params: to.params })
    }
    if (to.name == 'mobileVideoPresentation' && window.innerWidth >= 1000) {
        next({ name: 'watchVideoPresentation', params: to.params })
    }

    // ADD USERS TO SELECTION IF THEY COME THROUGH A JOIN LINK
    if (to.name == 'joinSelection' && to.params.linkHash) {
        console.log('join selection')
        next()
    }

    // Check that the user is not going to the login page already
    else if (!to.path.startsWith('/login') && !store.getters['auth/isAuthenticated']) {
        next({
            name: 'login',
        })
    } else {
        next()
    }
})

export default router
