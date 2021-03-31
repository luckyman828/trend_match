export default {
    namespaced: true,
    state: {
        featureFlags: [
            'app_select',
            'app_buy',
            'app_play',
            'app_performance',
            'dkc_integration',
            'bestseller_style_option',
            'select_show_input_from_alignment',
        ],
    },
    getters: {
        getFeatureFlags: state => state.featureFlags,
    },
    actions: {},
    mutations: {},
}
