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
        async createRequest({ commit }, { request }) {
            commit('setSubmitting', true)

            const response = await axios.post(`/api/request`, {
                product_id: request.product_id,
                task_id: request.task_id,
                team_id: request.team_id,
                user_id: request.user_id,
                body: request.body,
            })

            // Get and set the request id equal to the id given by the database
            request.id = response.data.id
            commit('addRequest', { request: request })
            commit('setSubmitting', false)
        },
        async updateRequest({ commit }, { request }) {
            commit('setSubmitting', true)

            await axios.put(`/api/request`, {
                id: request.id,
                product_id: request.product_id,
                task_id: request.task_id,
                team_id: request.team_id,
                user_id: request.user_id,
                body: request.body,
            })

            commit('updateRequest', { request: request })
            commit('setSubmitting', false)
        },
        async insertOrUpdateRequest({ commit }, { product, request }) {
            let requestMethod = 'post'
            // check if the provided comment should be posted or updates
            let newRequest
            if (comment.id != null) {
                requestMethod = 'put'
                // Update the comment on the product
                await Request.insert({ data: request }).then(response => {
                    newRequest = response.requests[0]
                    request = newRequest
                })
            } else {
                requestMethod = 'post'
                // Add the new comment to our product
                await Request.create({ data: request }).then(response => {
                    newRequest = response.requests[0]
                    product.requests.push(newRequest)
                })
            }

            // Config API endpoint
            const apiUrl = `${process.env.MIX_KOLLEKT_API_URL_BASE}/request`
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
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        setSubmitting(state, bool) {
            state.submitting = bool
        },
        addRequest: (state, { request }) => {
            // Submit new request
            Request.insert({
                data: request,
            })
        },
        updateRequest: (state, { request }) => {
            // update request
            Request.update({
                where: request.id,
                data: request,
            })
        },
    },
}
