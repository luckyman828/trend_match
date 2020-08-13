import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        loading: true,
        submitting: false,
        currentRequestThread: null,
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
            console.log(selectionInput, request.content)
            // Update our state
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
                    is_important: false,
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
        insertOrUpdateRequestComment({ commit }, { request, comment }) {
            commit('INSERT_REQUEST_COMMENT', { request, comment })
        },
        async resolveRequest({ commit, rootGetters }, request) {
            commit('RESOLVE_REQUEST', { request, resolve: !request.isResolved, user: rootGetters['auth/authUser'] })

            const apiUrl = `/requests/${request.id}/complete`
            await axios.put(apiUrl).then(() => {
                if (request.isResolved) {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Request resolved',
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                }
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
            console.log('insert or update request', request)
            // First see if the request already exists
            const existingRequestIndex = selectionInput.rawSelectionInput.requests.findIndex(x => x.id == request.id)
            if (existingRequestIndex >= 0) {
                const updatedRequest = Object.assign(
                    selectionInput.rawSelectionInput.requests[existingRequestIndex],
                    request
                )
                Vue.set(selectionInput.rawSelectionInput.requests, existingRequestIndex, updatedRequest)
            }
            // Else insert the request
            else {
                console.log('push new request', request.content)
                selectionInput.rawSelectionInput.requests.push(request)

                Vue.set(request, 'comments', [])

                Object.defineProperty(request, 'isResolved', {
                    get: function() {
                        return !!request.completed_at
                    },
                })
                Object.defineProperty(request, 'hasUnreadAlignerComment', {
                    get: function() {
                        return (
                            !request.isResolved &&
                            (request.comments.length <= 0 ||
                                request.comments[request.comments.length - 1].role != 'Approver')
                        )
                    },
                })
                Object.defineProperty(request, 'hasUnreadApproverComment', {
                    get: function() {
                        return (
                            !request.isResolved &&
                            request.comments.length > 0 &&
                            request.comments[request.comments.length - 1].role == 'Approver'
                        )
                    },
                })
            }
        },
        DELETE_REQUEST(state, { selectionInput, request }) {
            const requestIndex = selectionInput.rawSelectionInput.requests.findIndex(x => x.id == request.request_id)
            selectionInput.rawSelectionInput.requests.splice(requestIndex, 1)
            // Check if the request is the current request
            if (state.currentRequestThread && state.currentRequestThread.id == request.request_id) {
                state.currentRequestThread = null
                console.log(state.currentRequestThread)
            }
        },
        SET_CURRENT_REQUEST_THREAD(state, request) {
            state.currentRequestThread = request
        },
        INSERT_REQUEST_COMMENT(state, { request, comment }) {
            if (!request.comments) Vue.set(request, 'comments', []) // TEMP CODE
            request.comments.push(comment)
        },
        RESOLVE_REQUEST(state, { request, resolve, user }) {
            if (resolve) {
                request.completed_at = new Date()
                request.completed_by_user = user
            } else {
                request.completed_at = null
                request.completed_by_user = null
            }
        },
        // UPDATE_REQUEST_COMMENT(state, {comment})
    },
}
