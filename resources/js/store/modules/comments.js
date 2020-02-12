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
            if (comment.id != null) {
                requestMethod = 'put'
                commit('updateComment', { product, comment })
            } else {
                requestMethod = 'post'
                // Add the new comment to our product
                commit('insertComment', { product, comment })
            }

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
        async deleteComment({ commit }, { product, comment }) {
            // Delete the comment from our state
            commit('deleteComment', { product, comment })

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
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        setSubmitting(state, bool) {
            state.submitting = bool
        },
        updateComment: async (state, { product, comment }) => {
            // If a product has been provided. use that, else find the product from our state
            const commentProduct = product
                ? product
                : this.state.entities.products.products.find(x => x.id == comment.product_id)
            // Find the index of the comment and replace it
            const commentIndex = commentProduct.comments.findIndex(x => x.id == comment.id)
            commentProduct.comments[commentIndex] = comment
        },
        insertComment: async (state, { product, comment }) => {
            // If a product has been provided. use that, else find the product from our state
            const commentProduct = product
                ? product
                : this.state.entities.products.products.find(x => x.id == comment.product_id)
            commentProduct.comments.push(comment)
        },
        deleteComment(state, { product, comment }) {
            // If a product has been provided. use that, else find the product from our state
            const commentProduct = product
                ? product
                : this.state.entities.products.products.find(x => x.id == comment.product_id)

            const commentIndex = commentProduct.comments.findIndex(x => x.id == comment.id)
            commentProduct.comments.splice(commentIndex, 1)
        },
        alertError: state => {
            window.alert('Network error. Please check your connection')
        },
    },
}
