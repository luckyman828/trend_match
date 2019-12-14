import axios from 'axios'
import Comment from '../models/Comment'
import { uuid } from 'vue-uuid'

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
                    console.log(err.response)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        async createComment({ commit, dispatch }, { comment }) {
            commit('setSubmitting', true)

            let team_id = '0'
            if (comment.team_id) team_id = comment.team_id

            // Save a reference to the temporary id generated for the comment
            const tempId = comment.id

            // Insert the comment in our store with the temp id
            await Comment.insert({ data: comment })

            // Set the comments id to null so we can generate one in the database instead
            comment.id = null
            dispatch('entities/products/updateComments', comment.product_id, { root: true })
            commit('setSubmitting', false)

            let success
            await axios
                .post(`/api/comment`, {
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
                .then(async response => {
                    success = true
                    // Get and set the comment id equal to the id given by the database

                    // Find our comment by its temporary id
                    // Update the ID on the comment
                    await Comment.update({
                        where: tempId,
                        data: { id: response.data.id },
                    })
                    // Delete the temp comment
                    await Comment.delete(tempId)
                    dispatch('entities/products/updateComments', comment.product_id, { root: true })
                })
                .catch(err => {
                    console.log(err.response)
                    success = false
                    commit('alertError')
                    Comment.find(tempId).failed = true
                    dispatch('entities/products/updateComments', comment.product_id, { root: true })
                })

            // commit('setSubmitting', false)
            return success
        },
        async updateComment({ commit, dispatch }, comment) {
            await axios
                .put(`/api/comment/${comment.id}`, {
                    comment: comment,
                })
                .then(async response => {
                    console.log(response.data)
                    // Commit to store
                    await Comment.insert({ data: response.data })
                    // Dispatch an action to update this product
                    dispatch('entities/products/updateComments', comment.product_id, { root: true })
                })
                .catch(err => {
                    console.log(err.response)
                })
        },
        async deleteComment({ commit, dispatch }, id) {
            // Find the comment so we can know what product it belongs to
            const productId = await Comment.find(id).product_id
            await commit('deleteComment', id)

            // Dispatch an action to update this product
            dispatch('entities/products/updateComments', productId, { root: true })

            await axios
                .delete(`/api/comment/${id}`, {
                    data: {
                        id: id,
                    },
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err.response)
                })
        },
        async setComment({ dispatch }, comment) {
            await Comment.insert({ data: comment })
            // Dispatch an action to update this product
            dispatch('entities/products/updateComments', comment.product_id, { root: true })
        },
        async destroyComment({ dispatch }, comment) {
            await Comment.delete(comment.id)
            // Dispatch an action to update this product
            dispatch('entities/products/updateComments', comment.product_id, { root: true })
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
        alertError: state => {
            window.alert('Network error. Please check your connection')
        },
        deleteComment(state, commentId) {
            Comment.delete(commentId)
        },
    },
}
