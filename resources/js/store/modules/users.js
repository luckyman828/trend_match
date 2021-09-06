import axios from 'axios'
import Vue from 'vue'
import router from '../../router'

export default {
    namespaced: true,

    state: {
        loading: false,
        users: null,
        addNewUserModalVisible: false,
        status: null,
        workspaceFetchedFromId: null,
    },

    getters: {
        loadingUsers: state => state.loading,
        users: state => state.users,
        getUsers: state => state.users,
        getUsersStatus: state => state.status,
        addNewUserModalVisible: state => state.addNewUserModalVisible,
        getWorkspaceFetchedFromId: state => state.workspaceFetchedFromId,
    },

    actions: {
        async fetchUsers({ commit, dispatch, state, rootGetters }) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            // Set the state to loading
            commit('setLoading', true)
            commit('SET_USER_STATUS', 'loading')
            commit('SET_WORKSPACE_FETCHED_FROM_ID', workspaceId)

            const apiUrl = `/workspaces/${workspaceId}/users`
            axios
                .get(apiUrl)
                .then(async response => {
                    const users = response.data
                    state.users = users
                    await dispatch('initUsers', users)
                    commit('setLoading', false)
                    commit('SET_USER_STATUS', 'success')
                })
                .catch(err => {
                    commit('SET_USER_STATUS', 'error')
                })
        },
        async updateWorkspaceUsers({ commit, rootGetters, dispatch }, usersToUpdate) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            commit('updateUsers', usersToUpdate)

            let success
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
                    success = true
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${usersToUpdate.length > 1 ? usersToUpdate.length + ' ' : ''}User${
                                usersToUpdate.length > 1 ? 's' : ''
                            } updated`,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    success = false
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `Error when updating user(s). Please try again.`,
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('updateWorkspaceUsers', usersToUpdate),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
            return success
        },
        async addUsersToWorkspace({ commit, rootGetters, dispatch }, usersToAdd) {
            return new Promise((resolve, reject) => {
                if (usersToAdd.length <= 0) {
                    resolve()
                    return
                }
                const workspaceId = rootGetters['workspaces/currentWorkspace'].id

                const apiUrl = `/workspaces/${workspaceId}/users-email`

                // Instantiate a new workspaceUser object, to strip away any added/calculated attributes
                let dataToPost = { users: usersToAdd }
                axios({
                    method: 'post',
                    url: apiUrl,
                    data: dataToPost,
                })
                    .then(async response => {
                        const newUsers = response.data.new_users.concat(response.data.existed_users)
                        await dispatch('initUsers', newUsers)

                        commit('ADD_USERS', newUsers)
                        // Display message
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: `${newUsers.length} user${newUsers.length > 1 ? 's' : ''} added`,
                                iconClass: 'fa-check',
                                type: 'success',
                            },
                            { root: true }
                        )
                        resolve(response)
                    })
                    .catch(err => {
                        // Display message
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: `Error when adding user. Please try again.`,
                                iconClass: 'fa-exclamation-triangle',
                                type: 'warning',
                                callback: () => dispatch('addUsersToWorkspace', usersToAdd),
                                callbackLabel: 'Retry',
                                duration: 0,
                            },
                            { root: true }
                        )
                        reject(err)
                    })
            })
        },
        async insertOrUpdateWorkspaceUsers({ rootGetters }, users) {
            const currentWorkspaceId = rootGetters['workspaces/getCurrentWorkspaceId']
            const apiUrl = `workspaces/${currentWorkspaceId}/users`
            await axios.post(apiUrl, {
                method: 'Add',
                users,
            })
        },
        async removeUsersFromWorkspace({ commit, dispatch }, { workspaceId, users }) {
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
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${users.length} user${users.length > 1 ? 's' : ''} removed`,
                            iconClass: 'fa-trash',
                            type: 'danger',
                            callback: () => dispatch('addUsersToWorkspace', users),
                            callbackLabel: 'Undo',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    success = false
                    // Re-add the users
                    commit('ADD_USERS', users)

                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `Error when removing users. Please try again.`,
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('removeUsersFromWorkspace', { workspaceId, users }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
            return success
        },
        async updateUser({ commit, dispatch }, user) {
            commit('updateUsers', [user])

            const apiUrl = `/admins/users/${user.id}`
            axios
                .put(apiUrl, { name: user.name, email: user.email })
                .then(() => {
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `User updated`,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `Error when updating user. Please try again.`,
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('updateUser', user),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
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
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `Password updated`,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                    if (isSelf) router.go()
                })
                .catch(err => {
                    const errMsg = isSelf
                        ? 'Something went wrong. Make sure you entered your old password correctly.'
                        : 'Something went wrong. Please try again.'

                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: errMsg,
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('updateUserPassword', user),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
        async searchForUser({ commit }, query) {
            const apiUrl = `/users?query=${query}`
            let result
            await axios
                .get(apiUrl)
                .then(response => {
                    result = response.data
                })
                .catch(err => {
                    console.log('error in search for users', err)
                })
            return result
        },
        async setUserPassword({ commit, rootGetters, dispatch }, user) {
            const authUser = rootGetters['auth/authUser']
            const apiUrl = `/admins/users/${user.id}/change-password`
            const isSelf = user.id == authUser.id

            await axios
                .post(apiUrl, { password: user.password })
                .then(response => {
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `Password updated`,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                    if (isSelf) router.go()
                })
                .catch(err => {
                    const errMsg = 'Something went wrong. Please try again.'

                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: errMsg,
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('updateUserPassword', user),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
        initUsers({ rootGetters }, users) {
            users.map(user => {
                if (!user.apps) Vue.set(user, 'apps', [])
                Object.defineProperty(user, 'appRole', {
                    get: () => {
                        const currentApp = rootGetters['kollektApps/getCurrentApp']
                        if (!currentApp) return 'None'
                        const appRole = user.apps.find(app => app.name == currentApp.name)
                        return appRole ? appRole.role : 'None'
                    },
                    set(newRole) {
                        const currentApp = rootGetters['kollektApps/getCurrentApp']
                        if (!currentApp) return
                        const appRoleIndex = user.apps.findIndex(app => app.name == currentApp.name)
                        if (!newRole || (newRole == 'None' && appRoleIndex > 0)) {
                            user.apps.splice(appRoleIndex, 1)
                        } else {
                            if (appRoleIndex < 0) {
                                user.apps.push({ app: currentApp.name, role: newRole })
                            } else {
                                user.apps[appRoleIndex].role = newRole
                            }
                        }
                    },
                })
            })
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        SET_USER_STATUS(state, status) {
            state.status = status
        },
        ADD_USERS(state, users) {
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
        SET_WORKSPACE_FETCHED_FROM_ID(state, workspaceId) {
            state.workspaceFetchedFromId = workspaceId
        },
    },
}
