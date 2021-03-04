import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

Vue.use(VueRouter)

// Define route components

const routes = [
    {
        path: '/login',
        name: 'login',
        meta: {
            root: 'login',
        },
        component: () => import(/* webpackChunkName: "LoginScreen" */ './pages/LoginPage/LoginScreen'),
    },
    {
        path: '/login/recover-password',
        name: 'recoverPassword',
        meta: {
            root: 'login',
        },
        component: () =>
            import(/* webpackChunkName: "RecoverPasswordScreen" */ './pages/LoginPage/RecoverPasswordScreen'),
    },
    {
        path: '/login/verification-code',
        name: 'verificationCode',
        meta: {
            root: 'login',
        },
        component: () =>
            import(/* webpackChunkName: "VerificationCodeScreen" */ './pages/LoginPage/VerificationCodeScreen'),
    },
    {
        path: '/login/set-new-password',
        name: 'setNewPassword',
        meta: {
            root: 'login',
        },
        component: () =>
            import(/* webpackChunkName: "SetNewPasswordScreen" */ './pages/LoginPage/SetNewPasswordScreen'),
    },
    {
        path: '/file/:fileId/edit',
        name: 'editFile',
        meta: {
            root: 'select',
        },
        component: () => import(/* webpackChunkName: "EditFilePage" */ './pages/EditFilePage'),
    },
    {
        path: '/files',
        name: 'files',
        meta: {
            root: 'select',
        },
        component: () => import(/* webpackChunkName: "FilesPage" */ './pages/FilesPage'),
    },
    {
        path: '/teams',
        name: 'teams',
        meta: {
            root: 'select',
        },
        component: () => import(/* webpackChunkName: "TeamsPage" */ './pages/TeamsPage'),
    },
    {
        path: '/users',
        name: 'users',
        meta: {
            root: 'select',
        },
        component: () => import(/* webpackChunkName: "UsersPage" */ './pages/UsersPage'),
    },
    {
        path: '/file/:fileId/selection/:selectionId',
        name: 'selection',
        meta: {
            root: 'select',
        },
        component: () => import(/* webpackChunkName: "SelectionPage" */ './pages/SelectionPage'),
    },
    {
        path: '/file/:fileId/video/edit',
        name: 'editVideoPresentation',
        meta: {
            root: 'select',
            hideCrisp: true,
        },
        component: () =>
            import(/* webpackChunkName: "EditVideoPresentationPage" */ './pages/EditVideoPresentationPage'),
    },
    {
        path: '/file/:fileId/livestream/create',
        name: 'createLivestream',
        meta: {
            root: 'select',
            hideCrisp: true,
        },
        component: () => import(/* webpackChunkName: "createLivestreamPage" */ './pages/CreateLivestreamPage'),
    },
    {
        path: '/file/:fileId/selection/:selectionId/video/watch',
        name: 'watchVideoPresentation',
        meta: {
            root: 'select',
            isFullscreen: true,
            hideCrisp: true,
        },
        component: () =>
            import(/* webpackChunkName: "watchVideoPresentationPage" */ './pages/WatchVideoPresentationPage'),
    },
    {
        path: '/file/:fileId/selection/:selectionId/video/watch/mobile',
        name: 'mobileVideoPresentation',
        meta: {
            root: 'select',
            isFullscreen: true,
            hideCrisp: true,
        },
        component: () =>
            import(/* webpackChunkName: "watchVideoPresentationPage" */ './pages/MobileVideoPresentationPage'),
    },
    {
        path: '/join/:linkHash',
        name: 'joinSelection',
        meta: {
            root: 'select',
        },
        component: () => import(/* webpackChunkName: "joinSelectionPage" */ './pages/JoinSelectionPage'),
    },
    {
        path: '/settings',
        name: 'settings',
        meta: {
            root: 'select',
        },
        component: () => import(/* webpackChunkName: "settingsPage" */ './pages/SettingsPage'),
    },
    {
        path: '/system-admin',
        name: 'systemAdmin',
        meta: {
            root: 'select',
        },
        component: () => import(/* webpackChunkName: "settingsPage" */ './pages/SystemAdminPage'),
    },
    {
        path: '/file/:fileId/result',
        name: 'results',
        meta: {
            root: 'select',
            isFullscreen: true,
            hideCrisp: true,
        },
        component: () => import(/* webpackChunkName: "resultsPage" */ './pages/ResultsPage'),
    },
    {
        path: '/file/:fileId/live-results',
        name: 'liveResults',
        meta: {
            root: 'select',
            isFullscreen: true,
            hideCrisp: true,
        },
        component: () => import(/* webpackChunkName: "liveResultsPage" */ './pages/LiveResultsPage'),
    },

    // Root Routes
    {
        path: '/',
        name: 'selectSpace',
        component: () => import(/* webpackChunkName: "selectSpace" */ './pages/ProductSpaceSelectorPage/'),
    },

    // SELECT Routes
    {
        path: '/select',
        name: 'select',
        redirect: 'files',
        children: [
            {
                path: '*',
                redirect: '/files',
            },
        ],
    },

    // PLAY Routes
    {
        path: '/play',
        name: 'play',
        component: () => import(/* webpackChunkName: "playRoot" */ './pages/PLAYB2C/'),
        children: [
            {
                path: 'home',
                name: 'playHome',
                component: () => import(/* webpackChunkName: "playHome" */ './pages/PLAYB2C/Home/'),
            },
            {
                path: 'watch/:videoId',
                name: 'watchVideo',
                meta: {
                    isFullscreen: true,
                    hideCrisp: true,
                },
                component: () => import(/* webpackChunkName: "watchVideoPage" */ './pages/PLAYB2C/WatchVideoPage/'),
            },
            {
                path: '*',
                redirect: 'home',
            },
        ],
    },

    // BUY Routes
    {
        path: '/buy',
        name: 'buy',
        redirect: 'buy/',
        component: () => import(/* webpackChunkName: "buyRoot" */ './pages/BUY/'),
        children: [
            {
                path: 'files',
                name: 'buy.files',
                component: () => import(/* webpackChunkName: "buyFiles" */ './pages/BUY/FilesPage/'),
            },
            {
                path: 'users',
                name: 'buy.users',
                component: () => import(/* webpackChunkName: "buyUsers" */ './pages/BUY/UsersPage/'),
            },
            {
                path: '*',
                redirect: 'files',
            },
        ],
    },
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

    // if (to.name == 'login' && from && from.name) {
    //     store.commit('routes/SET_NEXT_URL', from.fullPath)
    // }

    if (to.path.startsWith('/login') && store.getters['auth/isAuthenticated']) {
        next({ name: 'files' })
        return
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
        next()
    }

    // Check that the user is not going to the login page already
    else if (!to.path.startsWith('/login') && !store.getters['auth/isAuthenticated']) {
        store.commit('routes/SET_NEXT_URL', to.fullPath)
        next({
            name: 'login',
        })
    } else {
        next()
    }
})

router.afterEach((to, from) => {
    // Reset current selections on route leave
    // const selectionRouteNames = ['selection', 'createLivestream']
    // if (selectionRouteNames.includes(from.name)) {
    store.commit('selections/SET_CURRENT_SELECTIONS', [])
    // }
})

export default router
