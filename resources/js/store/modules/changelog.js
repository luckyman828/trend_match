export default {
    namespaced: true,

    state: {
        showChangelog: false,
        latestChangelogUpdateDate: new Date('Wed Jun 16 2021 12:11:00 GMT+0200 (Central European Summer Time)'),
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
