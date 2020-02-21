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
