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
            'select_always_show_alignment_input',
            'select_always_show_feedback_input',
        ],
    },
    getters: {
        getFeatureFlags: state => state.featureFlags,
    },
    actions: {},
    mutations: {},
}
