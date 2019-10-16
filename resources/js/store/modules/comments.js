import axios from 'axios'
import Comment from '../models/Comment'

export default {
    namespaced: true,

    state: {
        loading: true,
        submitting: false,
    },

    getters: {
        loadingComments: state => {
            return state.loading
        },
        submittingComment: state => {
            return state.submitting
        },
    },

    actions: {
        async fetchComments({ commit }, file_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/file/${file_id}/comments`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    Comment.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in comments.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        async createComment({ commit }, { comment }) {
            commit('setSubmitting', true)

            let team_id = '0'
            if (comment.team_id) team_id = comment.team_id

            const response = await axios.post(`/api/comment`, {
                id: comment.id,
                user_id: comment.user_id,
                product_id: comment.product_id,
                task_id: comment.task_id,
                team_id: team_id,
                phase_id: comment.phase,
                comment_body: comment.comment,
                important: comment.important,
                is_request: comment.is_request,
            })

            // Get and set the comment id equal to the id given by the database
            comment.id = response.data.id
            commit('setComment', { comment: comment })

            console.log(response.data)
            commit('setSubmitting', false)
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        setSubmitting(state, bool) {
            state.submitting = bool
        },
        setComment: (state, { comment }) => {
            // Submit new comment
            Comment.insert({
                data: comment,
            })
        },
    },
}
