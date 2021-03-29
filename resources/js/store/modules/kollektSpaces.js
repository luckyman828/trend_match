import router from '../../router'

export default {
    namespaced: true,
    state: {
        currentSpace: localStorage.getItem('kollektSpace') || null,
        spaces: [
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
        getSpaces: state => state.spaces,
        getCurrentSpace: (state, getters) => getters.getSpaces.find(x => x.name == state.currentSpace),
    },
    actions: {},
    mutations: {
        SET_KOLLEKT_SPACE(state, space) {
            state.currentSpace = space
            localStorage.setItem('kollektSpace', space)
        },
        NAVIGATE_TO_CURRENT_SPACE(state) {
            router.push({ name: state.currentSpace })
        },
    },
}
