import axios from 'axios'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingCommentVotes: state => {
            return state.loading
        },
    },

    actions: {
        async fetchCommentVotes({ commit }, file_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/file/${file_id}/comment-votes`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    CommentVote.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in commentVotes.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }

            // console.log(`Getting comments from ${apiUrl}`)
            // const response = await axios.get(`${apiUrl}`) //Get the data from the api
            // .catch(err => {
            //   console.log('API error in commentVotes.js :')
            //   console.log(err)
            // })
            // CommentVote.create({ data: response.data })
            // commit('setLoading', false)
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
    },
}
