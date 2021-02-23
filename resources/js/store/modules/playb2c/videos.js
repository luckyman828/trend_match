export default {
    state: {
        videos: [],
        statusCode: null,
    },
    getters: {
        getVideos: state => state.videos,
        getStatusCode: state => state.statusCode,
    },
    actions: {
        async fetchWorkspaceVideos({ commit }) {
            let videos = []

            return (videos = [])
        },
    },
    mutations: {},
}
