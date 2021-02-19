export default {
    namespaced: true,

    state: {
        showChangelog: false,
        latestChangelogUpdateDate: new Date('Fri Feb 19 2021 19:00:00 GMT+0100 (Central European Standard Time)'),
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
