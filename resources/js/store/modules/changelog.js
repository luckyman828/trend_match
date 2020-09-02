export default {
    namespaced: true,

    state: {
        showChangelog: false,
        latestChangelogUpdateDate: new Date('Mon Aug 31 2020 11:33:50 GMT+0200 (Central European Summer Time)'),
    },

    getters: {
        getShowChangelog: state => state.showChangelog,
        getLatestChangelogUpdateDate: state => state.latestChangelogUpdateDate,
    },

    actions: {},

    mutations: {
        SHOW_CHANGELOG(state, boolean) {
            state.showChangelog = boolean
        },
    },
}
