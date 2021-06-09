import Vue from 'vue'
import VueRouter from 'vue-router'
import { triggerRouteGuards } from './helpers/routeGuards'
import store from './store'

Vue.use(VueRouter)

// Define route components

const routes = [
    // LOGIN / AUTH ROUTES

    {
        path: '/login',
        name: 'login',
        redirect: 'login/',
        meta: {
            root: 'login',
            isRoot: true,
        },
        component: () => import(/* webpackChunkName: "LoginRoot" */ './pages/Login/'),
        children: [
            {
                path: '/',
                name: 'loginForm',
                meta: {
                    root: 'login',
                },
                component: () => import(/* webpackChunkName: "LoginScreen" */ './pages/Login/LoginPage/LoginScreen'),
            },
            {
                path: 'recover-password',
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
                path: 'verification-code',
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
                path: 'set-new-password',
                name: 'setNewPassword',
                meta: {
                    root: 'login',
                },
                component: () =>
                    import(
                        /* webpackChunkName: "SetNewPasswordScreen" */ './pages/Login/LoginPage/SetNewPasswordScreen'
                    ),
            },
            {
                path: 'join/:linkHash',
                name: 'join',
                meta: {
                    root: 'login',
                },
                component: () => import(/* webpackChunkName: "joinSelectionPage" */ './pages/JoinSelectionPage'),
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
        redirect: 'login/join/:linkHash',
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
        redirect: '/',
        meta: {
            root: 'root',
            isRoot: true,
        },
        children: [
            {
                path: '/',
                name: 'selectApp',
                meta: {
                    isFullscreen: true,
                },
                component: () => import(/* webpackChunkName: "selectApp" */ './pages/ROOT/KollektAppSelectorPage/'),
                // beforeEnter: (to, from, next) => {
                //     const availableApps = store.getters['workspaces/getEnabledApps']
                //     if (!store.getters['auth/getIsSystemAdmin'] && availableApps.length == 1) {
                //         next({ name: availableApps[0].name })
                //     }
                //     next()
                // },
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
            app: 'select',
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
        redirect: 'play/',
        meta: {
            root: 'play',
            app: 'play',
            isRoot: true,
        },
        component: () => import(/* webpackChunkName: "playRoot" */ './pages/PLAYB2C/'),
        children: [
            {
                path: 'find',
                name: 'play.find',
                component: () => import(/* webpackChunkName: "playFind" */ './pages/PLAYB2C/FindPage/'),
            },
            {
                path: 'file/:fileId/video',
                name: 'play.fileVideo',
                component: () => import(/* webpackChunkName: "playFileVideoPage" */ './pages/PLAYB2C/FileVideoPage/'),
            },
            {
                path: 'presentation/:presentationId/edit',
                name: 'play.editPresentation',
                meta: {
                    hideSidebar: true,
                    noScroll: true
                },
                component: () =>
                    import(/* webpackChunkName: "playEditPresentationPage" */ './pages/PLAYB2C/EditPresentationPage/'),
            },
            // {
            //     path: 'home',
            //     name: 'play.home',
            //     component: () => import(/* webpackChunkName: "playHome" */ './pages/PLAYB2C/Home/'),
            // },
            {
                path: 'watch/:presentationId',
                name: 'play.watchPresentation',
                meta: {
                    isFullscreen: true,
                    hideCrisp: true,
                },
                component: () =>
                    import(/* webpackChunkName: "watchPresentationPage" */ './pages/PLAYB2C/WatchPresentationPage/'),
            },
            {
                path: '*',
                redirect: { name: 'play.find' },
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
            app: 'buy',
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

router.beforeEach(async (to, from, next) => {
    // Reset current folder
    if (!['files', 'editFile', 'selection'].includes(to.name)) {
        // If we are not going to a file related path --> reset the current folder
        store.commit('files/SET_CURRENT_FOLDER', null)
    }
    // GUARD SPACES
    const nextRoute = await triggerRouteGuards(to)
    next(nextRoute)
    return

    // Redirect PLAY
    if (to.name == 'watchVideoPresentation' && window.innerWidth < 1000) {
        next({ name: 'mobileVideoPresentation', params: to.params })
    }
    if (to.name == 'mobileVideoPresentation' && window.innerWidth >= 1000) {
        next({ name: 'watchVideoPresentation', params: to.params })
    }
})

router.afterEach((to, from) => {
    // Reset current selections on route leave
    store.commit('selections/SET_CURRENT_SELECTIONS', [])
    store.commit('productFilters/CLEAR_PRODUCT_FILTERS')
    store.commit('productFilters/SET_FILTER_SELECTION_IDS', [])
    store.commit('selectionProducts/SET_SELECTIONS', [])
    store.commit('files/SET_CURRENT_FOLDER', null)
    store.commit('files/SET_CURRENT_PATH_FOLDER', null)

    // PLAY
    store.commit('playPresentation/SET_PRESENTATION', null)
    store.commit('playPresentation/SET_VIDEO', null)
    store.commit('playPresentation/SET_TIMINGS', [])
    store.commit('playPresentation/SET_TIMINGS_READY', false)
})

export default router
