import axios from 'axios'
import User from '../models/User'

export default {
    namespaced: true,

    state: {
        loading: true,
        users: null,
        addNewUserModalVisible: false,
    },

    getters: {
        loadingUsers: state => state.loading,
        users: state => state.users,
        addNewUserModalVisible: state => state.addNewUserModalVisible,
    },

    actions: {
        async fetchUsers({ commit, state, rootGetters }) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `${process.env.MIX_KOLLEKT_API_URL_BASE}/workspaces/${workspaceId}/users`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    state.users = response.data
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in teams.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        async updateWorkspaceUser({ commit, rootGetters }, userToUpdate) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            commit('updateUser', userToUpdate)

            let succes
            const apiUrl = `${process.env.MIX_KOLLEKT_API_URL_BASE}/workspaces/${workspaceId}/users`

            await axios({
                method: 'post',
                url: apiUrl,
                data: {
                    method: 'Add',
                    users: [userToUpdate],
                },
            })
                .then(response => {
                    succes = true
                    commit('addUsers', usersToAdd)
                })
                .catch(err => {
                    console.log(err.response)
                    succes = false
                })
            return succes
        },
        async addUsersToWorkspace({ commit, rootGetters }, usersToAdd) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            let succes

            const apiUrl = `${process.env.MIX_KOLLEKT_API_URL_BASE}/workspaces/${workspaceId}/users-email`

            // Instantiate a new workspaceUser object, to strip away any added/calculated attributes
            let dataToPost = { users: usersToAdd }
            await axios({
                method: 'post',
                url: apiUrl,
                data: dataToPost,
            })
                .then(response => {
                    console.log(response)
                    succes = true
                    commit('addUsers', usersToAdd)
                })
                .catch(err => {
                    console.log(err.response)
                    succes = false
                })
            return succes
        },
        async removeUsersFromWorkspace({ commit }, { workspaceId, users }) {
            commit('removeUsers', users)
            const apiUrl = `${process.env.MIX_KOLLEKT_API_URL_BASE}/workspaces/${workspaceId}/users`
            let success
            // const usersToPost = users.map(user => {
            //     return { user_id: user.id }
            // })
            await axios
                .post(apiUrl, {
                    method: 'Remove',
                    users: users,
                })
                .then(response => {
                    success = true
                })
                .catch(err => {
                    console.log(err.response)
                    success = false
                })
            return success
        },
        async updateUser({ commit }, user) {
            commit('updateUser', user)

            const apiUrl = `${process.env.MIX_KOLLEKT_API_URL_BASE}/admins/users/${user.id}`
            axios.put(apiUrl, { name: user.name, email: user.email })
        },
        async updateUserPassword({ commit }, user) {
            const apiUrl = `${process.env.MIX_KOLLEKT_API_URL_BASE}/admins/users/${user.id}/change-password`
            axios.post(apiUrl, { password: user.password })
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        addUsers(state, users) {
            state.users = state.users.concat(users)
        },
        updateUser(state, user) {
            // Replace the user with the new
            let oldUser = state.users.find(x => x.id == user.id)
            Object.assign(oldUser, user)
        },
        setAddNewUserModalVisible(state, bool) {
            state.addNewUserModalVisible = bool
        },
        removeUsers(state, users) {
            users.forEach(user => {
                const userIndex = state.users.findIndex(x => x.id == user.id)
                state.users.splice(userIndex, 1)
            })
        },
    },
}
