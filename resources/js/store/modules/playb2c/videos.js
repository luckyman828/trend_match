export default {
    namespaced: true,

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

            videos = [
                {
                    id: 12345678,
                    name: 'Summer 2021',
                    thumbnail:
                        'https://images.pexels.com/photos/936094/pexels-photo-936094.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                },
                {
                    id: 22345678,
                    name: 'Main Autumn 2021',
                    thumbnail:
                        'https://images.pexels.com/photos/2705753/pexels-photo-2705753.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                },
            ]
            commit('SET_VIDEOS', videos)

            return videos
        },
        async insertVideo({ commit }, { name, thumbnail }) {
            let newVideo = { id: null, name, thumbnail }

            // Send request
            commit('INSERT_VIDEO', newVideo)

            return newVideo
        },
    },
    mutations: {
        SET_VIDEOS(state, videos) {
            state.videos = videos
        },
        INSERT_VIDEO(state, newVideo) {
            state.videos.push(newVideo)
        },
    },
}
