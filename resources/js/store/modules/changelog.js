export default {
    namespaced: true,

    state: {
        showChangelog: false,
    },

    getters: {
        getShowChangelog: state => state.showChangelog,
    },

    actions: {},

    mutations: {
        SHOW_CHANGELOG(state, boolean) {
            state.showChangelog = boolean
        },
    },
}
