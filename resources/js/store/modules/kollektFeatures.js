export default {
    namespaced: true,
    state: {
        featureFlags: ['space_select', 'space_buy', 'dkc_integration', 'bestseller_style_option'],
    },
    getters: {
        getFeatureFlags: state => state.featureFlags,
    },
    actions: {},
    mutations: {},
}
