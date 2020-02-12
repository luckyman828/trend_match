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
        async insertOrUpdateComment({ commit }, { product, comment }) {
            let requestMethod = 'post'
            // check if the provided comment should be posted or updates
            let newComment
            if (comment.id != null) {
                requestMethod = 'put'
                // Update the comment on the product
                await Comment.insert({ data: comment }).then(response => {
                    newComment = response.comments[0]
                    comment = newComment
                })
            } else {
                requestMethod = 'post'
                // Add the new comment to our product
                await Comment.create({ data: comment }).then(response => {
                    newComment = response.comments[0]
                    product.comments.push(newComment)
                })
            }

            newComment.id = 15

            // Config API endpoint
            const apiUrl = `${process.env.MIX_KOLLEKT_API_URL_BASE}/comment`
            const requestHeaders = {
                'X-Kollekt-App-Key': process.env.MIX_KOLLEKT_API_KEY,
            }

            // Assume success
            let success = true

            // await axios({
            //     method: requestMethod,
            //     url: apiUrl,
            //     data: {
            //         comment,
            //     },
            //     headers: requestHeaders,
            // })
            //     .then(async response => {
            //         // Get and set the comment id equal to the id given by the database
            //         newComment.id = response.data.id
            //     })
            //     .catch(err => {
            //         console.log(err.response)
            //         success = false
            //         commit('alertError')
            //         newComment.failed = true
            //     })

            return success
        },
        async deleteComment({ commit, dispatch }, { product, comment }) {
            // Delete the comment from our state
            const commentIndex = product.comments.findIndex(x => x.id == comment.id)
            product.comments.splice(commentIndex, 1)

            // Config API endpoint
            const apiUrl = `${process.env.MIX_KOLLEKT_API_URL_BASE}/comment`
            const requestHeaders = {
                'X-Kollekt-App-Key': process.env.MIX_KOLLEKT_API_KEY,
            }
            let requestMethod = 'delete'

            // Assume success
            let success = true

            // await axios({
            //     method: requestMethod,
            //     url: apiUrl,
            //     data: {
            //         comment,
            //     },
            //     headers: requestHeaders,
            // })
            //     .then(async response => {
            //         // Get and set the comment id equal to the id given by the database
            //         newComment.id = response.data.id
            //     })
            //     .catch(err => {
            //         console.log(err.response)
            //         success = false
            //         commit('alertError')
            //         newComment.failed = true
            //     })
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
