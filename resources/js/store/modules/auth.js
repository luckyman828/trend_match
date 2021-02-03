import axios from 'axios'
import router from '../../router'

export default {
    namespaced: true,

    state: {
        token: '',
        status: '',
        user: null,
        passwordRecoveryEmail: null,
        passwordRecoverySessionId: null,
        backgroundImage: null,
        logo: null,
        workspaceName: null,
    },

    getters: {
        isAuthenticated: state => !!state.token,
        authStatus: state => state.status,
        authUser: state => state.user,
        getIsSystemAdmin: state => state.user && state.user.role == 'Admin',
        getAuthUserToken: state => state.token,
        getPasswordRecoveryEmail: state => state.passwordRecoveryEmail,
        getPasswordRecoverySessionId: state => state.passwordRecoverySessionId,
        getLoginBackgroundImage: state => state.backgroundImage,
        getLoginLogo: state => state.logo,
        getLoginWorkspaceName: state => state.workspaceName,
    },

    actions: {
        async login({ commit, state }, { email, password }) {
            commit('SET_AUTH_STATUS', 'loading')
            let success = false

            const apiUrl = `/auth/login`
            await axios
                .post(apiUrl, {
                    email,
                    password,
                })
                .then(response => {
                    const token = response.data.token.access_token
                    const user = response.data
                    commit('ON_SUCCESFUL_LOGIN', { token, user })
                    success = true
                })
                .catch(err => {
                    success = false
                    commit('SET_AUTH_STATUS', 'error')
                })

            return success
        },
        async logout({ commit, state, getters }) {
            // Remember to add actual logging out request here to the API
            localStorage.removeItem('user-token')
            localStorage.removeItem('workspace-index')
            commit('RESET_STATE', null, { root: true })
            // Redirect the user
            router.push({ name: 'login' })
        },
        async recoverPassword({ commit, state }, email) {
            let success
            commit('SET_PASSWORD_RECOVERY_EMAIL', email)

            const apiUrl = `/auth/recover-password`
            await axios
                .post(apiUrl, {
                    email,
                })
                .then(response => {
                    // return success
                    success = true
                })
                .catch(err => {
                    console.log('error', err)
                    success = false
                })
            return success
        },
        async verifyRecoveryCode({ commit, state }, code) {
            let success

            const apiUrl = `/auth/verify-code`
            await axios
                .post(apiUrl, {
                    email: state.passwordRecoveryEmail,
                    code,
                })
                .then(response => {
                    commit('SET_PASSWORD_RECOVERY_SESSION_ID', response.data.session_id)
                    success = true
                })
                .catch(err => {
                    console.log('error', err)
                    success = false
                })
            return success
        },
        async setNewPassword({ commit, state }, password) {
            let success

            const apiUrl = `/auth/reset-password`
            await axios
                .post(apiUrl, {
                    session_id: state.passwordRecoverySessionId,
                    password,
                })
                .then(response => {
                    // Save the token to our state
                    success = true
                })
                .catch(err => {
                    console.log('error', err)
                    success = false
                })
            return success
        },
        async getAuthUser({ commit, state }) {
            state.status = 'loading'
            let response
            let error

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
                    response = response
                })
                .catch(err => {
                    state.status = 'error'
                    error = err
                })
            if (error) throw error
            else return response
        },
    },

    mutations: {
        setAuthUser(state, user) {
            state.user = user
        },
        SET_AUTH_STATUS(state, status) {
            state.status = status
        },
        SET_PASSWORD_RECOVERY_EMAIL(state, email) {
            state.passwordRecoveryEmail = email
        },
        SET_PASSWORD_RECOVERY_SESSION_ID(state, id) {
            state.passwordRecoverySessionId = id
        },
        ON_SUCCESFUL_LOGIN(state, { token, user }) {
            // Set the status of our login to success
            state.status = 'success'
            // Store the token in localstorage
            localStorage.setItem('user-token', token)
            // Add the token to future auth requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            // Save the token to our state
            state.token = token
            // Save the authenticated user
            state.user = user
        },
        SET_BACKGROUND_IMAGE(state, imageUrl) {
            state.backgroundImage = imageUrl
        },
        SET_LOGO(state, imageUrl) {
            state.logo = imageUrl
        },
        SET_WORKSPACE_NAME(state, name) {
            state.workspaceName = name
        },
    },
}
