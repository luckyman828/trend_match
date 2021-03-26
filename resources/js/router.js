import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

Vue.use(VueRouter)

// Define route components

const routes = [
    // LOGIN / AUTH ROUTES

    {
        path: '/login',
        name: 'loginRoot',
        redirect: 'login/',
        meta: {
            root: 'login',
            isRoot: true,
        },
        component: () => import(/* webpackChunkName: "LoginScreen" */ './pages/Login/'),
        children: [
            {
                path: '/login',
                name: 'login',
                meta: {
                    root: 'login',
                },
                component: () => import(/* webpackChunkName: "LoginScreen" */ './pages/Login/LoginPage/LoginScreen'),
            },
            {
                path: '/login/recover-password',
                name: 'recoverPassword',
                meta: {
                    root: 'login',
                },
                component: () =>
                    import(
                        /* webpackChunkName: "RecoverPasswordScreen" */ './pages/Login/LoginPage/RecoverPasswordScreen'
                    ),
            },
            {
                path: '/login/verification-code',
                name: 'verificationCode',
                meta: {
                    root: 'login',
                },
                component: () =>
                    import(
                        /* webpackChunkName: "VerificationCodeScreen" */ './pages/Login/LoginPage/VerificationCodeScreen'
                    ),
            },
            {
                path: '/login/set-new-password',
                name: 'setNewPassword',
                meta: {
                    root: 'login',
                },
                component: () =>
                    import(
                        /* webpackChunkName: "SetNewPasswordScreen" */ './pages/Login/LoginPage/SetNewPasswordScreen'
                    ),
            },
        ],
    },

    // SELECT REDIRECT ROUTES
    {
        path: '/files',
        redirect: 'select/files',
    },
    {
        path: '/file/:fileId/edit',
        redirect: 'select/file/:fileId/edit',
    },
    {
        path: '/teams',
        redirect: 'select/teams',
    },
    {
        path: '/users',
        redirect: 'select/users',
    },
    {
        path: '/file/:fileId/selection/:selectionId',
        redirect: 'select/file/:fileId/selection/:selectionId',
    },
    {
        path: '/file/:fileId/video/edit',
        redirect: 'select/file/:fileId/video/edit',
    },
    {
        path: '/file/:fileId/livestream/create',
        redirect: 'select/file/:fileId/livestream/create',
    },
    {
        path: '/file/:fileId/selection/:selectionId/video/watch',
        redirect: 'select/file/:fileId/selection/:selectionId/video/watch',
    },
    {
        path: '/file/:fileId/selection/:selectionId/video/watch/mobile',
        redirect: 'select/file/:fileId/selection/:selectionId/video/watch/mobile',
    },
    {
        path: '/join/:linkHash',
        redirect: 'select/join/:linkHash',
    },
    {
        path: '/settings',
        redirect: 'select/settings',
    },
    {
        path: '/system-admin',
        redirect: 'select/system-admin',
    },
    {
        path: '/file/:fileId/result',
        redirect: 'select/file/:fileId/result',
    },
    {
        path: '/file/:fileId/live-results',
        redirect: 'select/file/:fileId/live-results',
    },

    // Root Routes
    {
        path: '/',
        name: 'root',
        component: () => import(/* webpackChunkName: "rootRoot" */ './pages/ROOT/'),
        children: [
            {
                path: '/',
                name: 'selectSpace',
                meta: {
                    isFullscreen: true,
                },
                component: () => import(/* webpackChunkName: "selectSpace" */ './pages/ROOT/ProductSpaceSelectorPage/'),
                beforeEnter: (to, from, next) => {
                    const availableSpaces = store.getters['workspaces/getEnabledSpaces']
                    if (!store.getters['auth/getIsSystemAdmin'] && availableSpaces.length == 1) {
                        next({ name: availableSpaces[0].name })
                    }
                    next()
                },
            },
            {
                path: 'settings/:workspaceId',
                name: 'workspaceSettings',
                component: () => import(/* webpackChunkName: "settingsPage" */ './pages/ROOT/SettingsPage'),
            },
            {
                path: 'system-admin',
                name: 'systemAdmin',
                component: () => import(/* webpackChunkName: "settingsPage" */ './pages/ROOT/SystemAdminPage'),
            },
        ],
    },

    // SELECT Routes
    {
        path: '/select',
        name: 'select',
        redirect: 'select/',
        meta: {
            root: 'select',
            space: 'select',
            isRoot: true,
        },
        component: () => import(/* webpackChunkName: "buyRoot" */ './pages/SELECT/'),
        children: [
            {
                path: 'files',
                name: 'files',
                meta: {
                    root: 'select',
                },
                component: () => import(/* webpackChunkName: "FilesPage" */ './pages/FilesPage'),
            },
            {
                path: 'file/:fileId/edit',
                name: 'editFile',
                meta: {
                    root: 'select',
                },
                component: () => import(/* webpackChunkName: "EditFilePage" */ './pages/EditFilePage'),
            },
            {
                path: 'teams',
                name: 'teams',
                meta: {
                    root: 'select',
                },
                component: () => import(/* webpackChunkName: "TeamsPage" */ './pages/TeamsPage'),
            },
            {
                path: 'users',
                name: 'users',
                meta: {
                    root: 'select',
                },
                component: () => import(/* webpackChunkName: "UsersPage" */ './pages/UsersPage'),
            },
            {
                path: 'file/:fileId/selection/:selectionId',
                name: 'selection',
                meta: {
                    root: 'select',
                },
                component: () => import(/* webpackChunkName: "SelectionPage" */ './pages/SelectionPage'),
            },
            {
                path: 'file/:fileId/video/edit',
                name: 'editVideoPresentation',
                meta: {
                    root: 'select',
                    hideCrisp: true,
                },
                component: () =>
                    import(/* webpackChunkName: "EditVideoPresentationPage" */ './pages/EditVideoPresentationPage'),
            },
            {
                path: 'file/:fileId/livestream/create',
                name: 'createLivestream',
                meta: {
                    root: 'select',
                    hideCrisp: true,
                },
                component: () => import(/* webpackChunkName: "createLivestreamPage" */ './pages/CreateLivestreamPage'),
            },
            {
                path: 'file/:fileId/selection/:selectionId/video/watch',
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
                path: 'file/:fileId/selection/:selectionId/video/watch/mobile',
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
                path: 'join/:linkHash',
                name: 'joinSelection',
                meta: {
                    root: 'select',
                },
                component: () => import(/* webpackChunkName: "joinSelectionPage" */ './pages/JoinSelectionPage'),
            },
            {
                path: 'file/:fileId/result',
                name: 'results',
                meta: {
                    root: 'select',
                    isFullscreen: true,
                    hideCrisp: true,
                },
                component: () => import(/* webpackChunkName: "resultsPage" */ './pages/ResultsPage'),
            },
            {
                path: 'file/:fileId/live-results',
                name: 'liveResults',
                meta: {
                    root: 'select',
                    isFullscreen: true,
                    hideCrisp: true,
                },
                component: () => import(/* webpackChunkName: "liveResultsPage" */ './pages/LiveResultsPage'),
            },
            {
                path: '*',
                redirect: 'files',
            },
        ],
    },

    // PLAY Routes
    {
        path: '/play',
        name: 'play',
        meta: {
            root: 'play',
            space: 'play',
            isRoot: true,
        },
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
        meta: {
            root: 'buy',
            space: 'buy',
            isRoot: true,
        },
        component: () => import(/* webpackChunkName: "buyRoot" */ './pages/BUY/'),
        children: [
            {
                path: 'files',
                name: 'buy.files',
                component: () => import(/* webpackChunkName: "buyFiles" */ './pages/BUY/FilesPage/'),
            },
            {
                path: 'file/:fileId/edit',
                name: 'buy.editFile',
                component: () =>
                    import(/* webpackChunkName: "buyEditFileProductsPage" */ './pages/BUY/EditFileProductsPage/'),
            },
            {
                path: 'selection/:selectionId',
                name: 'buy.selection',
                component: () => import(/* webpackChunkName: "buySelectionPage" */ './pages/BUY/SelectionPage/'),
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

const onRedirectSpace = next => {
    // Tell the user they are getting redirected
    store.commit('alerts/SHOW_SNACKBAR', {
        type: 'info',
        icon: 'far fa-info-circle',
        msg: "Redirected: You don' have access to this route.",
    })
    // Redirect to a space the user has access to
    const availableSpaces = store.getters['workspaces/getEnabledSpaces']
    if (availableSpaces.length > 0) next({ name: availableSpaces[0].name })
    else next('/')
}

router.beforeEach(async (to, from, next) => {
    // Make sure we are done initing before we start applying guards
    const initDone = store.getters['persist/getInitDone']
    if (!initDone) {
        await new Promise(resolve => {
            const tester = setInterval(() => {
                if (store.getters['persist/getInitDone']) {
                    resolve()
                    clearInterval(tester)
                }
            }, 100)
        })
    }

    // Reset current folder
    if (!['files', 'editFile', 'selection'].includes(to.name)) {
        // If we are not going to a file related path --> reset the current folder
        store.commit('files/SET_CURRENT_FOLDER', null)
    }

    // GUARD SPACES
    // Find if the current root route
    const root = to.matched[0]
    console.log('to', root, to)
    if (
        root.meta &&
        root.meta.space &&
        !store.getters['workspaces/getEnabledSpaces'].find(space => space.name == root.meta.space)
    ) {
        onRedirectSpace(next)
    }
    // END GUARD SPACES

    // AUTH
    if (to.path.startsWith('/login') && store.getters['auth/isAuthenticated']) {
        next({ name: 'files' })
        return
    }

    if (to.name == 'verificationCode' && !store.getters['auth/getPasswordRecoveryEmail']) {
        next({ name: 'login' })
    } else if (to.name == 'setNewPassword' && !store.getters['auth/getPasswordRecoverySessionId']) {
        next({ name: 'login' })
    }
    // END AUTH

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
