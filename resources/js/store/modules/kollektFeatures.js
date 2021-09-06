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
            'force_ticket_labels',
            'play_shop_bap_qa',
            'play_shop_bonaparte',
            'play_shop_companys',
        ],
    },
    getters: {
        getFeatureFlags: state => state.featureFlags,
    },
    actions: {},
    mutations: {},
}
