export default {
    namespaced: true,

    state: {
        comments: [],
    },

    getters: {
        getVideoComments: state => state.comments,
    },

    actions: {
        insertVideoComment({ commit }, newComment) {
            newComment.id = Math.round(Math.random() * 10000000)
            commit('INSERT_OR_UPDATE_COMMENT', newComment)
        },
    },

    mutations: {
        INSERT_OR_UPDATE_COMMENT(state, newComment) {
            // Check if the new comment already exists
            const existingComment = state.comments.find(x => x.id == newComment.id)
            if (existingComment) {
                Object.assign(existingComment, newComment)
            } else {
                state.comments.push(newComment)
            }
        },
    },
}
