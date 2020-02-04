import axios from 'axios'
import User from '../models/User'

export default {
    namespaced: true,

    state: {
        loading: true,
        addNewUserModalVisible: false,
    },

    getters: {
        loadingUsers: state => {
            return state.loading
        },
        addNewUserModalVisible: state => {
            return state.addNewUserModalVisible
        },
    },

    actions: {
        async fetchUsers({ commit }, workspace_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/workspace/${workspace_id}/users`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    User.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in users.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        async updateUser({ commit }, userToUpdate) {
            let succes

            let apiURL = `/api/user`
            let requestMethod = 'post'
            if (userToUpdate.id) {
                apiURL = `/api/user/${userToUpdate.id}`
                requestMethod = 'put'
            }

            // Instantiate a new user object, to strip away any added/calculated attributes
            let userToPush = {
                id: userToUpdate.id,
                name: userToUpdate.name,
                email: userToUpdate.email,
                currency: userToUpdate.currency,
                impact: userToUpdate.impact,
            }
            await axios({
                method: requestMethod,
                url: apiURL,
                data: {
                    user: userToPush,
                },
            })
                .then(response => {
                    console.log(response.data)
                    if (!userToUpdate.id) userToUpdate.id = response.data.id
                    succes = true
                    commit('updateUser', userToPush)
                })
                .catch(err => {
                    console.log(err.response)
                    succes = false
                })
            return succes
        },
        async updateUserPassword({ commit }, { user, password }) {
            // Send update request to API
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        updateUser(state, user) {
            User.insert({ data: user })
        },
        setAddNewUserModalVisible(state, bool) {
            state.addNewUserModalVisible = bool
        },
    },
}
