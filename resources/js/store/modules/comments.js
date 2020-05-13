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
                    // console.log('API error in comments.js :')
                    // console.log(err.response)
                    // console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        async insertOrUpdateComment({ commit, dispatch }, { product, comment }) {
            // Update our state
            commit('INSERT_OR_UPDATE_COMMENT', { product, comment })
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
                    Vue.set(comment, 'error', false)
                    // If the comment already had an ID -> it got updated give the user a confirmation message
                    // const wasCreated = !comment.id
                    // if (!wasCreated) {
                    //     commit(
                    //         'alerts/SHOW_SNACKBAR',
                    //         {
                    //             msg: `Comment ${wasCreated ? 'created' : 'updated'}`,
                    //             iconClass: 'fa-check',
                    //             type: 'success',
                    //         },
                    //         { root: true }
                    //     )
                    // }

                    // Set the given ID to the comment if we were posting a new comment
                    // if (!comment.id) comment.id = response.data.id
                    if (!comment.id) Object.assign(comment, response.data)
                })
                .catch(err => {
                    // On error, set error on the comment
                    Vue.set(comment, 'error', true)
                    // Alert the user
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg:
                                'Error on comment. Please try again. If the error persists, please contact Kollekt support',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('insertOrUpdateComment', { product, comment }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
        async deleteComment({ commit, dispatch }, { product, comment }) {
            // Delete the comment from our state
            commit('DELETE_COMMENT', { product, commentId: comment.id })

            // Config API endpoint
            const apiUrl = `/comments/${comment.id}`
            await axios
                .delete(apiUrl)
                .then(() => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `Comment deleted`,
                            iconClass: 'fa-trash',
                            type: 'danger',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    // Re-add the comment
                    commit('INSERT_OR_UPDATE_COMMENT', { product, comment })
                    // Alert the user
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg:
                                'Error when trying to delete comment. Please try again. If the error persists, please contact Kollekt support',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('deleteComment', { product, comment }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
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
        INSERT_OR_UPDATE_COMMENT(state, { product, comment }) {
            // First see if the comment already exists
            console.log('insert comment')
            console.log(product)
            const existingCommentIndex = product.comments.findIndex(x => x.id == comment.id)
            if (existingCommentIndex >= 0) {
                const updatedComment = Object.assign(product.comments[existingCommentIndex], comment)
                Vue.set(product.comments, existingCommentIndex, updatedComment)
            }
            // Else insert the comment
            else {
                product.comments.push(comment)
            }
        },
        DELETE_COMMENT(state, { product, commentId }) {
            const commentIndex = product.comments.findIndex(x => x.id == commentId)
            product.comments.splice(commentIndex, 1)
        },
        alertError: state => {
            window.alert('Network error. Please check your connection')
        },
    },
}
