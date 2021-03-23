import router from '../../router'

export default {
    namespaced: true,
    state: {
        currentSpace: localStorage.getItem('kollektSpace') || null,
        spaces: [
            {
                name: 'select',
                byline: 'Trim Collections',
                logo: '/images/kollekt_logo_00_1024x1024-color.svg',
            },
            {
                name: 'buy',
                byline: 'Multi-brand purchasing',
                logo: '/images/logo/kollekt-buy-logo.png',
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
