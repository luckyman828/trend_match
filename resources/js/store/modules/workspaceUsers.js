import axios from 'axios'
import WorkspaceUser from '../models/WorkspaceUser'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingWorkspaceUsers: state => {
            return state.loading
        },
    },

    actions: {
        async fetchWorkspaceUsers({ commit }, workspaceId) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/workspace/${workspaceId}/workspace-users`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    WorkspaceUser.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in workspaceUsers.js :')
                    console.log(err.response)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        async updateWorkspaceUser({ commit }, workspaceUserToUpdate) {
            let succes

            let apiURL = `/api/workspace-user`
            let requestMethod = 'put'

            // Instantiate a new workspaceUser object, to strip away any added/calculated attributes
            let dataToPush = {
                user_id: workspaceUserToUpdate.user_id,
                workspace_id: workspaceUserToUpdate.workspace_id,
                permission_level: workspaceUserToUpdate.permission_level,
            }
            await axios({
                method: requestMethod,
                url: apiURL,
                data: dataToPush,
            })
                .then(response => {
                    console.log(response.data)
                    succes = true
                    commit('updateWorkspaceUser', userToPush)
                })
                .catch(err => {
                    console.log(err.response)
                    succes = false
                })
            return succes
        },
        async addUsersToWorkspace({ commit }, { workspaceId, usersToAdd }) {
            let succes

            let apiURL = `/api/workspace/${workspaceId}/users/add`
            let requestMethod = 'post'

            // Instantiate a new workspaceUser object, to strip away any added/calculated attributes
            let dataToPush = { users_to_add: usersToAdd }
            await axios({
                method: requestMethod,
                url: apiURL,
                data: dataToPush,
            })
                .then(response => {
                    console.log(response.data)
                    succes = true
                    commit('updateWorkspaceUser', userToPush)
                })
                .catch(err => {
                    console.log(err.response)
                    succes = false
                })
            return succes
        },
        async deleteWorkspaceUser({ commit }, { workspaceId, user }) {
            commit('deleteWorkspaceUser', { workspaceId, user })
            const apiUrl = `/api/workspace/${workspaceId}/user`
            let succes
            await axios
                .delete(apiUrl, {
                    data: {
                        user_id: user.id,
                    },
                })
                .then(response => {
                    console.log(response.data)
                    succes = true
                })
                .catch(err => {
                    console.log(err.response)
                    succes = false
                })
            return succes
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        updateWorkspaceUser(state, workspaceUser) {
            WorkspaceUser.insert({ data: workspaceUser })
        },
        deleteWorkspaceUser(state, { workspaceId, userId }) {
            WorkspaceUser.delete(record => {
                return record.workspace_id == workspaceId && record.user_id == userId
            })
        },
    },
}
