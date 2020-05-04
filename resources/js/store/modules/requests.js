import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        loading: true,
        submitting: false,
    },

    getters: {
        loadingRequests: state => {
            return state.loading
        },
        submittingRequest: state => {
            return state.submitting
        },
    },

    actions: {
        async fetchRequests({ commit }, file_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/file/${file_id}/requests`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    Request.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in requests.js :')
                    console.log(err.response)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        async insertOrUpdateRequest({ commit, dispatch }, { product, request }) {
            // Update our state
            commit('INSERT_OR_UPDATE_REQUEST', { product, request })
            let requestMethod
            let apiUrl
            // check if the provided request should be posted or updates
            if (request.id != null) {
                requestMethod = 'put'
                apiUrl = `/requests/${request.id}`
            } else {
                requestMethod = 'post'
                // Add the new request to our product
                apiUrl = `/selections/${request.selection_id}/products/${product.id}/requests`
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
                    if (!request.id) request.id = response.data.id
                })
                .catch(err => {
                    // On error, set error on the request
                    Vue.set(request, 'error', true)
                    // Alert the user
                    commit(
                        'alerts/SHOW_ALERT',
                        'Error on request. Please try again. If the error persists, please contact Kollekt support',
                        { root: true }
                    )
                })
        },
        async deleteRequest({ commit }, { product, request }) {
            // Delete the request from our state
            commit('deleteRequest', { product, request })

            // Config API endpoint
            const apiUrl = `/requests/${request.id}`
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
        INSERT_OR_UPDATE_REQUEST(state, { product, request }) {
            // First see if the request already exists
            const existingRequestIndex = product.requests.findIndex(x => x.id == request.id)
            if (existingRequestIndex >= 0) {
                const updatedRequest = Object.assign(product.requests[existingRequestIndex], request)
                Vue.set(product.requests, existingRequestIndex, updatedRequest)
            }
            // Else insert the request
            else {
                product.requests.push(request)
            }
        },
        deleteRequest(state, { product, request }) {
            const requestIndex = product.requests.findIndex(x => x.id == request.id)
            product.requests.splice(requestIndex, 1)
        },
        alertError: state => {
            window.alert('Network error. Please check your connection')
        },
    },
}
