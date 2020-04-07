import axios from 'axios'
import Vue from 'vue'

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
        async insertOrUpdateComment({ commit, dispatch }, { product, comment }) {
            // Update our state
            commit('insertOrUpdateComment', { product, comment })
            let requestMethod
            let apiUrl
            // check if the provided comment should be posted or updates
            if (comment.id != null) {
                requestMethod = 'put'
                apiUrl = `/comments/${comment.id}`
            } else {
                requestMethod = 'post'
                // Add the new comment to our product
                apiUrl = `/selections/${comment.selection_id}/products/${product.id}/comments`
            }

            await axios({
                method: requestMethod,
                url: apiUrl,
                // data: comment,
                data: {
                    content: comment.content,
                    is_important: false,
                },
            })
                .then(response => {
                    // Set the given ID to the comment if we were posting a new comment
                    // if (!comment.id) comment.id = response.data.id
                    if (!comment.id) Object.assign(comment, response.data)
                })
                .catch(err => {
                    // On error, set error on the comment
                    Vue.set(comment, 'error', true)
                    // Alert the user
                    dispatch(
                        'alerts/showAlert',
                        'Error on comment. Please try again. If the error persists, please contact Kollekt support',
                        { root: true }
                    )
                })
        },
        async deleteComment({ commit }, { product, comment }) {
            // Delete the comment from our state
            commit('deleteComment', { product, comment })

            // Config API endpoint
            const apiUrl = `/comments/${comment.id}`
            await axios.delete(apiUrl)
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
        insertOrUpdateComment(state, { product, comment }) {
            // First see if the comment already exists
            const existingCommentIndex = product.comments.findIndex(x => x.id == comment.id)
            if (existingCommentIndex >= 0) {
                Vue.set(product.comments, existingCommentIndex, comment)
            }
            // Else insert the comment
            else {
                product.comments.push(comment)
            }
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
        deleteComment(state, commentId) {
            Comment.delete(commentId)
        },
    },
}
