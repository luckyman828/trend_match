export default {
    namespaced: true,

    state: {
        showChangelog: false,
        latestChangelogUpdateDate: new Date('Tue Jan 06 2021 12:40:30 GMT+0100 (Central European Standard Time)'),
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
