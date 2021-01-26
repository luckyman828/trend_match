import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        loading: true,
        submitting: false,
        currentRequestThread: null,
        availableRequestLabels: ['color_added', 'color_removed', 'price_wish', 'add_delivery', 'change_delivery'],
        // availableRequestLabels: ['Color added', 'Color removed', 'Price wish', 'Add delivery', 'Change delivery'],
    },

    getters: {
        loadingRequests: state => {
            return state.loading
        },
        submittingRequest: state => {
            return state.submitting
        },
        getCurrentRequestThread: state => state.currentRequestThread,
        getRequestThreadVisible: state => !!state.currentRequestThread,
        getAvailableRequestLabels: state => state.availableRequestLabels,
    },

    actions: {
        async fetchRequests({ commit }, file_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/file/${file_id}/requests`

            let tryCount = 3
            let success = false
            while (tryCount-- > 0 && !success) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    Request.create({ data: response.data })
                    commit('setLoading', false)
                    success = true
                } catch (err) {
                    // console.log('API error in requests.js :')
                    // console.log(err.response)
                    // console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        async insertOrUpdateRequest({ commit, dispatch }, { selectionInput, request }) {
            // Update our state
            dispatch('initRequests', [request])
            commit('INSERT_OR_UPDATE_REQUEST', { selectionInput, request })
            let requestMethod
            let apiUrl
            // check if the provided request should be posted or updates
            if (request.id != null) {
                requestMethod = 'put'
                apiUrl = `/requests/${request.id}`
            } else {
                requestMethod = 'post'
                // Add the new request to our product
                apiUrl = `/selections/${selectionInput.selection_id}/products/${selectionInput.product_id}/requests`
            }

            await axios({
                method: requestMethod,
                url: apiUrl,
                // data: request,
                data: {
                    content: request.content,
                    type: request.type,
                    labels: request.labels,
                },
            })
                .then(response => {
                    // Set the given ID to the request if we were posting a new request
                    if (!request.id) {
                        request.id = response.data.id
                    } else {
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: 'Request updated',
                                iconClass: 'fa-check',
                                type: 'success',
                            },
                            { root: true }
                        )
                    }
                })
                .catch(err => {
                    // On error, set error on the request
                    Vue.set(request, 'error', true)
                    // Show error message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg:
                                'Error on request. Please try again. If the error persists, please contact Kollekt support.',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('insertOrUpdateRequest', { selectionInput, request }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
        async deleteRequest({ commit }, { selectionInput, request }) {
            // Delete the request from our state
            commit('DELETE_REQUEST', { selectionInput, request })

            // Config API endpoint
            const apiUrl = `/requests/${request.id}`
            await axios.delete(apiUrl).then(() => {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: 'Request deleted',
                        iconClass: 'fa-trash',
                        type: 'danger',
                    },
                    { root: true }
                )
            })
        },
        async insertOrUpdateRequestComment({ commit }, { request, comment }) {
            let apiUrl = `/requests/${request.id}/discussions`
            let requestMethod = 'post'
            if (comment.id) {
                apiUrl = `/discussions/${comment.id}`
                requestMethod = 'put'
            } else {
                commit('INSERT_OR_UPDATE_REQUEST_COMMENT', { request, comment })
            }

            await axios({
                method: requestMethod,
                url: apiUrl,
                // data: request,
                data: {
                    content: comment.content,
                },
            }).then(response => {
                if (!comment.id) {
                    comment.id = response.data.id
                } else {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Comment updated',
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                }
            })
        },
        async deleteRequestComment({ commit, dispatch }, { request, comment }) {
            const apiUrl = `/discussions/${comment.id}`
            await axios
                .delete(apiUrl)
                .then(response => {
                    commit('DELETE_REQUEST_COMMENT', { request, comment })
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Comment deleted',
                            iconClass: 'fa-trash',
                            type: 'danger',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Error trying to delete comment. Please try again',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('deleteRequestComment', { request, comment }),
                            callbackLabel: 'Retry',
                        },
                        { root: true }
                    )
                })
        },
        async updateRequestStatus({ commit, rootGetters }, { request, status }) {
            const apiUrl = `/requests/${request.id}/status`
            const authUser = rootGetters['auth/authUser']

            // Save that we just read the request thread
            const date = new Date()
            date.setSeconds(date.getSeconds() + 10)

            commit('SET_REQUEST_STATUS', { request, status, user: authUser })
            axios
                .put(apiUrl, {
                    status,
                })
                .then(response => {})
        },
        initRequests({ rootGetters }, requests) {
            requests.map(request => {
                if (request.hasBeenInitialized) return

                if (!request.discussions) Vue.set(request, 'discussions', [])

                Vue.set(request, 'lastReadAt', localStorage.getItem(`request-${request.id}-readAt`))
                Object.defineProperty(request, 'product', {
                    get: function() {
                        return rootGetters['products/products'].find(x => x.id == request.product_id)
                    },
                })
                Object.defineProperty(request, 'hasUnreadAlignerComment', {
                    get: function() {
                        if (request.status != 'Open' || request.type != 'Ticket' || request.selection.type == 'Normal')
                            return false
                        return (
                            request.discussions.length <= 0 ||
                            (request.discussions[request.discussions.length - 1].role != 'Approver' &&
                                request.discussions[request.discussions.length - 1].role)
                        )
                    },
                })
                Object.defineProperty(request, 'hasUnreadApproverComment', {
                    get: function() {
                        return (
                            (request.status != 'Open' &&
                                (!request.lastReadAt ||
                                    DateTime.fromISO(request.lastReadAt, { zone: 'utc' }).ts <
                                        DateTime.fromISO(request.status_updated_at, { zone: 'utc' }).ts)) ||
                            (request.status == 'Open' &&
                                request.discussions.length > 0 &&
                                request.discussions[request.discussions.length - 1].role == 'Approver')
                        )
                    },
                })

                request.hasBeenInitialized = true
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
        INSERT_OR_UPDATE_REQUEST(state, { selectionInput, request }) {
            // First see if the request already exists
            const existingRequestIndex = selectionInput.rawSelectionInput.requests.findIndex(x => x.id == request.id)
            if (existingRequestIndex >= 0) {
                const existingRequest = selectionInput.rawSelectionInput.requests[existingRequestIndex]
                const discussions = existingRequest.discussions
                const author = request.author ? request.author : existingRequest.author
                const author_id = request.author ? request.author_id : existingRequest.author_id
                const updatedRequest = Object.assign(existingRequest, request)
                // Dont touch the discussions or the author
                updatedRequest.discussions = discussions
                updatedRequest.author = author
                updatedRequest.author_id = author_id
                Vue.set(selectionInput.rawSelectionInput.requests, existingRequestIndex, updatedRequest)
            }
            // Else insert the request
            else {
                selectionInput.rawSelectionInput.requests.push(request)
            }
        },
        DELETE_REQUEST(state, { selectionInput, request }) {
            const requestIndex = selectionInput.rawSelectionInput.requests.findIndex(x => x.id == request.id)
            selectionInput.rawSelectionInput.requests.splice(requestIndex, 1)
            // Check if the request is the current request
            if (state.currentRequestThread && state.currentRequestThread.id == request.id) {
                state.currentRequestThread = null
            }
        },
        SET_CURRENT_REQUEST_THREAD(state, request) {
            state.currentRequestThread = request
        },
        INSERT_OR_UPDATE_REQUEST_COMMENT(state, { request, comment }) {
            const existingIndex = request.discussions.findIndex(x => x.id == comment.id)
            if (existingIndex >= 0) {
                const updatedComment = Object.assign(request.discussions[i], comment)
                Vue.set(request.discussions, existingIndex, updatedComment)
            } else {
                request.discussions.push(comment)
            }
        },
        DELETE_REQUEST_COMMENT(state, { request, comment }) {
            const commentId = comment.id ? comment.id : comment.discussion_id
            const index = request.discussions.findIndex(x => x.id == commentId)
            request.discussions.splice(index, 1)
        },
        SET_REQUEST_STATUS(state, { request, status, user }) {
            request.status = status
            request.status_updated_at = new Date().toISOString()
            if (user) {
                request.status_updated_by_user = user
            }
        },
        SET_REQUEST_READ(state, request) {
            const date = new Date()
            // Add a delay to avoid scenarios where the update time set by the API is later than the time set for our recent read
            const delay = 3
            date.setSeconds(date.getSeconds(date) + delay)

            request.lastReadAt = date.toISOString()
            localStorage.setItem(`request-${request.id}-readAt`, date.toISOString())
        },
    },
}
