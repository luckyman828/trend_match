import axios from 'axios'
import Request from '../models/Request'

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
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        async insertOrUpdateRequest({ commit }, { product, request }) {
            let requestMethod = 'post'
            // check if the provided request should be posted or updates
            if (request.id != null) {
                requestMethod = 'put'
                commit('updateRequest', { product, request })
            } else {
                requestMethod = 'post'
                // Add the new request to our product
                commit('insertRequest', { product, request })
            }

            request.id = 15

            // Config API endpoint
            const apiUrl = `/request`
            const requestHeaders = {
                'X-Kollekt-App-Key': process.env.MIX_KOLLEKT_API_KEY,
            }

            // Assume success
            let success = true

            // await axios({
            //     method: requestMethod,
            //     url: apiUrl,
            //     data: {
            //         request,
            //     },
            //     headers: requestHeaders,
            // })
            //     .then(async response => {
            //         // Get and set the request id equal to the id given by the database
            //         newRequest.id = response.data.id
            //     })
            //     .catch(err => {
            //         console.log(err.response)
            //         success = false
            //         commit('alertError')
            //         newRequest.failed = true
            //     })

            return success
        },
        async deleteRequest({ commit }, { product, request }) {
            // Delete the request from our state
            commit('deleteRequest', { product, request })

            // Config API endpoint
            const apiUrl = `/request`
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
            //         request,
            //     },
            //     headers: requestHeaders,
            // })
            //     .then(async response => {
            //         // Get and set the request id equal to the id given by the database
            //         newRequest.id = response.data.id
            //     })
            //     .catch(err => {
            //         console.log(err.response)
            //         success = false
            //         commit('alertError')
            //         newRequest.failed = true
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
        updateRequest: async (state, { product, request }) => {
            // If a product has been provided. use that, else find the product from our state
            const requestProduct = product
                ? product
                : this.state.entities.products.products.find(x => x.id == request.product_id)
            // Find the index of the request and replace it
            const requestIndex = requestProduct.requests.findIndex(x => x.id == request.id)
            requestProduct.requests[requestIndex] = request
        },
        insertRequest: async (state, { product, request }) => {
            // If a product has been provided. use that, else find the product from our state
            const requestProduct = product
                ? product
                : this.state.entities.products.products.find(x => x.id == request.product_id)
            requestProduct.requests.push(request)
        },
        deleteRequest(state, { product, request }) {
            // If a product has been provided. use that, else find the product from our state
            const requestProduct = product
                ? product
                : this.state.entities.products.products.find(x => x.id == request.product_id)

            const requestIndex = requestProduct.requests.findIndex(x => x.id == request.id)
            requestProduct.requests.splice(requestIndex, 1)
        },
    },
}
