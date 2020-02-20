import axios from 'axios'
import router from '../../router'

export default {
    namespaced: true,

    state: {
        token: localStorage.getItem('user-token') || '',
        status: '',
        user: null,
    },

    getters: {
        isAuthenticated: state => !!state.token,
        authStatus: state => state.status,
        authUser: state => state.user,
    },

    actions: {
        async login({ commit, state }, { email, password }) {
            state.status = 'loading'
            let success = false

            const apiUrl = `/auth/login`
            await axios
                .post(apiUrl, {
                    email,
                    password,
                })
                .then(response => {
                    // Save the token to our state
                    const token = response.data.token.access_token
                    // Store the token in localstorage
                    localStorage.setItem('user-token', token)
                    // Add the token to future auth requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                    state.token = token
                    // Save the authenticated user
                    commit('setAuthUser', response.data)
                    // return success
                    state.status = 'success'
                    success = true
                })
                .catch(err => {
                    state.status = 'error'
                    success = false
                })
            return success
        },
        async logout({ commit, state }) {
            console.log('log out froms ate')
            // Remember to add actual logging out request here to the API
            localStorage.removeItem('user-token')
            state.token = ''
            // Redirect the user
            router.push({ name: 'login' })
        },
        async getAuthUser({ commit, state }) {
            state.status = 'loading'
            let success = false

            // Include the token in future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`

            const apiUrl = `/auth/me`
            await axios
                .get(apiUrl)
                .then(response => {
                    // Save the authenticated user
                    commit('setAuthUser', response.data)
                    // return success
                    state.status = 'success'
                    success = true
                })
                .catch(err => {
                    state.status = 'error'
                    success = false
                })
            return success
        },
    },

    mutations: {
        setAuthUser(state, user) {
            state.user = user
        },
    },
}
