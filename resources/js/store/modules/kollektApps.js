import router from '../../router'

export default {
    namespaced: true,
    state: {
        currentApp: () => {
            try {
                return localStorage.getItem('kollektApp') || null
            } catch (e) {
                return null
            }
        },
        apps: [
            {
                name: 'select',
                featureFlag: 'app_select',
                byline: 'Trim Collections',
                isReleased: true,
                logo: {
                    white: '/images/logo/logo_select_white.svg',
                    color: '/images/logo/logo_select_blue.svg',
                    colorOnWhite: '/images/logo/logo_select_blue-on-white.svg',
                    whiteOnColor: '/images/logo/logo_select_white-on-blue.svg',
                },
            },
            {
                name: 'buy',
                featureFlag: 'app_buy',
                byline: 'Multi-brand purchasing',
                isReleased: true,
                logo: {
                    white: '/images/logo/logo_kollekt-buy_white.svg',
                    color: '/images/logo/logo_kollekt-buy_blue.svg',
                    colorOnWhite: '/images/logo/logo_kollekt-buy_blue-on-white.svg',
                    whiteOnColor: '/images/logo/logo_kollekt-buy_white-on-blue.svg',
                },
            },
            {
                name: 'play',
                featureFlag: 'app_play',
                byline: 'Video and Livestream',
                isReleased: false,
                logo: {
                    white: '/images/logo/logo_kollekt-play_white.svg',
                    color: '/images/logo/logo_kollekt-play_blue.svg',
                    colorOnWhite: '/images/logo/logo_kollekt-play_blue-on-white.svg',
                    whiteOnColor: '/images/logo/logo_kollekt-play_white-on-blue.svg',
                },
            },
            {
                name: 'performance',
                featureFlag: 'app_performance',
                byline: 'Datadriven Decisions',
                isReleased: false,
                logo: {
                    white: '/images/logo/logo_kollekt-performance_white.svg',
                    color: '/images/logo/logo_kollekt-performance_blue.svg',
                    colorOnWhite: '/images/logo/logo_kollekt-performance_blue-on-white.svg',
                    whiteOnColor: '/images/logo/logo_kollekt-performance_white-on-blue.svg',
                },
            },
        ],
    },
    getters: {
        getApps: state => state.apps,
        getCurrentApp: (state, getters) => getters.getApps.find(x => x.name == state.currentApp),
        getCurrentAppUsers: (state, getters, rootState, rootGetters) => {
            const users = rootGetters['users/getUsers']
            const currentApp = getters.getCurrentApp
            if (!users || !currentApp) return []
            return users.filter(user => user.apps.find(appRole => appRole.app == currentApp.name))
        },
    },
    actions: {},
    mutations: {
        SET_KOLLEKT_APP(state, app) {
            state.currentApp = app
            try {
                localStorage.setItem('kollektApp', app)
            } catch (e) {}
        },
        NAVIGATE_TO_CURRENT_APP(state) {
            router.push({ name: state.currentApp })
        },
    },
}
