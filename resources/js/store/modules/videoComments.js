import axios from 'axios'

export default {
    namespaced: true,

    state: {
        comments: [],
        nextCursor: null,
    },

    getters: {
        getVideoComments: state => state.comments,
        getMoreCommentsAvailable: state => !!state.nextCursor,
        getNextCursor: state => state.nextCursor,
    },

    actions: {
        async insertVideoComment({ commit }, { video, newComment }) {
            const apiUrl = `videos/${video.id}/chat`
            await axios
                .put(apiUrl, {
                    content: newComment.content,
                })
                .then(response => {
                    newComment.id = response.data.id
                    commit('INSERT_OR_UPDATE_COMMENT', newComment)
                })
        },
        async fetchVideoComments({ commit, state }, { video, cursor = null }) {
            let apiUrl = `videos/${video.id}/chat?take=10`
            if (cursor) apiUrl += `&cursor=${cursor}`

            let comments = []
            await axios.get(apiUrl).then(response => {
                comments = response.data.data
                commit('INSERT_VIDEO_COMMENTS', comments)
                commit('SET_NEXT_CURSOR', response.data.meta.next)
            })
            return comments
        },
    },

    mutations: {
        INSERT_VIDEO_COMMENTS(state, comments) {
            state.comments.unshift(...comments.reverse())
        },
        INSERT_OR_UPDATE_COMMENT(state, newComment) {
            // Check if the new comment already exists
            const existingComment = state.comments.find(x => x.id == newComment.id)
            if (existingComment) {
                Object.assign(existingComment, newComment)
            } else {
                state.comments.push(newComment)
            }
        },
        SET_NEXT_CURSOR(state, nextCursor) {
            state.nextCursor = nextCursor
        },
    },
}
