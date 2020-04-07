import axios from 'axios'
import router from '../../router'

export default {
    namespaced: true,

    state: {
        loading: false,
        users: null,
        addNewUserModalVisible: false,
    },

    getters: {
        loadingUsers: state => {
            return state.loading
        },
    },

    actions: {
        async fetchUsers({ commit }, workspace_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/workspaces/${workspaceId}/users`
            axios.get(apiUrl).then(response => {
                state.users = response.data
                commit('setLoading', false)
            })
        },
        async updateWorkspaceUsers({ commit, rootGetters }, usersToUpdate) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            commit('updateUsers', usersToUpdate)

            let succes
            const apiUrl = `/workspaces/${workspaceId}/users`

            await axios({
                method: 'post',
                url: apiUrl,
                data: {
                    method: 'Add',
                    users: usersToUpdate,
                },
            })
                .then(response => {
                    succes = true
                    // commit('addUsers', usersToAdd)
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

            const apiUrl = `/workspaces/${workspaceId}/users-email`

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
                    commit('addUsers', response.data)
                })
                .catch(err => {
                    console.log(err.response)
                    succes = false
                })
            return succes
        },
        async removeUsersFromWorkspace({ commit }, { workspaceId, users }) {
            commit('removeUsers', users)
            const apiUrl = `/workspaces/${workspaceId}/users`
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
            commit('updateUsers', [user])

            const apiUrl = `/admins/users/${user.id}`
            axios.put(apiUrl, { name: user.name, email: user.email })
        },
        async updateUserPassword({ commit, rootGetters, dispatch }, user) {
            const authUser = rootGetters['auth/authUser']
            let isSelf
            let apiUrl
            let data
            // Self
            if (authUser.id == user.id) {
                isSelf = true
                apiUrl = `/auth/change-password`
                data = {
                    new_password: user.password,
                    old_password: user.oldPassword,
                }
            }
            // Another user
            else {
                apiUrl = `/admins/users/${user.id}/change-password`
                data = { password: user.password }
            }
            await axios
                .post(apiUrl, data)
                .then(response => {
                    if (isSelf) router.go()
                })
                .catch(err => {
                    const errMsg = isSelf
                        ? 'Something went wrong. Make sure you entered your old password correctly.'
                        : 'Something went wrong'
                    dispatch('alerts/showAlert', errMsg, { root: true })
                })
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
        updateUsers(state, users) {
            // Replace the user with the new
            users.forEach(user => {
                let oldUser = state.users.find(x => x.id == user.id)
                Object.assign(oldUser, user)
            })
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
