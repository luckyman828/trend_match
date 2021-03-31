import router from '../../router'

export default {
    namespaced: true,
    state: {
        currentApp: localStorage.getItem('kollektApp') || null,
        apps: [
            {
                name: 'select',
                featureFlag: 'space_select',
                byline: 'Trim Collections',
                logo: {
                    white: '/images/logo/logo_select_white.svg',
                    color: '/images/logo/logo_select_blue.svg',
                    colorOnWhite: '/images/logo/logo_select_blue-on-white.svg',
                    whiteOnColor: '/images/logo/logo_select_white-on-blue.svg',
                },
            },
            {
                name: 'buy',
                featureFlag: 'space_buy',
                byline: 'Multi-brand purchasing',
                logo: {
                    white: '/images/logo/logo_kollekt-buy_white.svg',
                    color: '/images/logo/logo_kollekt-buy_blue.svg',
                    colorOnWhite: '/images/logo/logo_kollekt-buy_blue-on-white.svg',
                    whiteOnColor: '/images/logo/logo_kollekt-buy_white-on-blue.svg',
                },
            },
        ],
    },
    getters: {
        getApps: state => state.apps,
        getCurrentApp: (state, getters) => getters.getApps.find(x => x.name == state.currentApp),
    },
    actions: {},
    mutations: {
        SET_KOLLEKT_APP(state, app) {
            state.currentApp = app
            localStorage.setItem('kollektApp', app)
        },
        NAVIGATE_TO_CURRENT_APP(state) {
            router.push({ name: state.currentApp })
        },
    },
}
