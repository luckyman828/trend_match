import router from '../../router'

export default {
    namespaced: true,
    state: {
        currentSpace: localStorage.getItem('kollektSpace') || null,
        spaces: [
            {
                name: 'select',
                byline: 'Trim Collections',
                logo: '/images/logo/logo_select_blue-on-white.svg',
            },
            {
                name: 'buy',
                byline: 'Multi-brand purchasing',
                logo: '/images/logo/logo_kollekt-buy_white-on-blue.svg',
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
