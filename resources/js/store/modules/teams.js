import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        loading: false,
        status: null,
        currentTeam: null,
        currentTeamStatus: 'loading',
        availableTeams: [],
        teams: [],
        availableTeamRoles: [
            {
                role: 'Member',
                description: 'Gives feedback on selections and can make comments',
            },
            {
                role: 'Owner',
                description:
                    'The owner aligns selections and can make requests. Also manages the team and can add/remove users',
            },
        ],
        workspaceFetchedFromId: null,
    },

    getters: {
        loadingTeams: state => state.loading,
        getTeamsStatus: state => state.status,
        currentTeamId: state => state.currentTeam.id,
        availableTeams: state => state.availableTeams,
        teams: state => state.teams,
        availableTeamRoles: state => state.availableTeamRoles,
        currentTeam: state => state.currentTeam,
        getCurrentTeam: state => state.currentTeam,
        currentTeamStatus: state => state.currentTeamStatus,
        nextTeam: (state, getters) => {
            if (!getters.currentTeam) return
            const available = getters.availableTeams
            const currentId = getters.currentTeam.id
            if (currentId && available.length > 0) {
                const currentIndex = available.findIndex(x => x.id == currentId)
                if (currentIndex < available.length - 1) {
                    return available[currentIndex + 1]
                }
            }
        },
        prevTeam: (state, getters) => {
            if (!getters.currentTeam) return
            const available = getters.availableTeams
            const currentId = getters.currentTeam.id
            if (currentId && available.length > 0) {
                const currentIndex = available.findIndex(x => x.id == currentId)
                if (currentIndex != 0) {
                    return available[currentIndex - 1]
                }
            }
        },
        getWorkspaceFetchedFromId: state => state.workspaceFetchedFromId,
    },

    actions: {
        async fetchTeams({ commit, state, rootGetters }) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            // Set the state to loading
            commit('setLoading', true)
            commit('SET_TEAMS_STATUS', 'loading')
            commit('SET_WORKSPACE_FETCHED_FROM_ID', workspaceId)

            const apiUrl = `/workspaces/${workspaceId}/teams`

            let tryCount = 3
            let success = false
            while (tryCount-- > 0 && !success) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    Vue.set(state, 'teams', response.data)
                    commit('setLoading', false)
                    commit('SET_TEAMS_STATUS', 'success')
                    success = true
                } catch (err) {
                    console.log('API error in teams.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) {
                        commit('SET_TEAMS_STATUS', 'error')
                        throw err
                    }
                }
            }
        },
        async fetchTeamUsers({ commit, state }, team) {
            // Set the state to loading
            state.currentTeamStatus = 'loading'
            const apiUrl = `/teams/${team.id}/users`
            await axios
                .get(`${apiUrl}`)
                .then(response => {
                    commit('SET_TEAM_USERS', { team, users: response.data })
                    state.currentTeamStatus = 'success'
                })
                .catch(err => {
                    console.log(err)
                    state.currentTeamStatus = 'error'
                })
        },
        async insertOrUpdateTeam({ commit, rootGetters, dispatch }, team) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id

            let teamToPush = {
                title: team.title,
                currency: team.currency,
            }

            let apiUrl = `/workspaces/${workspaceId}/teams`
            let requestMethod = 'post'
            if (team.id) {
                apiUrl = `/teams/${team.id}`
                requestMethod = 'put'
            }

            await axios({
                method: requestMethod,
                url: apiUrl,
                data: teamToPush,
            })
                .then(response => {
                    const wasCreated = !team.id
                    const successMsg = wasCreated ? 'Team created' : 'Team updated'
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: successMsg,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                    if (!team.id) team.id = response.data.id
                    commit('INSERT_OR_UPDATE_TEAM', response.data)
                })
                .catch(err => {
                    console.log(err)
                    // Display message
                    const errMsg = team.id
                        ? 'Error when updating team. Please try again.'
                        : 'Error when creating team. Please try again.'
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: errMsg,
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('insertOrUpdateTeam', team),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
        async deleteTeam({ commit, dispatch }, team) {
            commit('DELETE_TEAM', team)
            const apiUrl = `/teams/${team.id}`
            let success
            await axios({
                method: 'delete',
                url: apiUrl,
            })
                .then(response => {
                    success = true
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Team deleted',
                            iconClass: 'fa-trash',
                            type: 'danger',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    success = false
                    // Re-add the team
                    commit('INSERT_OR_UPDATE_TEAM', team)
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Error when deleting team. Please try again',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('deleteTeam', team),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
            return success
        },
        async addUsersToTeam({ commit, dispatch }, { team, users }) {
            // Make a copy of the users and set their role to 'Member' as default
            const usersCopy = JSON.parse(JSON.stringify(users))
            const usersToPush = usersCopy.map(x => {
                x.role = 'Member'
                return x
            })
            // Format our users for our request body
            const usersToPost = users.map(user => {
                return { id: user.id, role: 'Member' }
            })

            let success
            const apiUrl = `/teams/${team.id}/users`

            // Update the state
            commit('addUsersToTeam', { team, users: usersToPush })
            await axios({
                method: 'post',
                url: apiUrl,
                data: {
                    method: 'Add',
                    users: usersToPost,
                },
            })
                .then(async response => {
                    success = true
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${users.length} user${users.length > 1 ? 's' : ''} added to team`,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    console.log(err)
                    success = false
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Error when adding users to team. Please try again',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('addUsersToTeam', { team, users }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
            return success
        },
        async updateTeamUsers({ commit, dispatch }, { team, users }) {
            const apiUrl = `/teams/${team.id}/users`

            await axios({
                method: 'post',
                url: apiUrl,
                data: {
                    method: 'Add',
                    users: users,
                },
            })
                .then(() => {
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${users.length} user${users.length > 1 ? 's' : ''} updated`,
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
                            msg: 'Error when updating team users. Please try again',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('updateTeamUsers', { team, users }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
        async removeUsersFromTeam({ commit, dispatch }, { team, users }) {
            // Update state
            commit('REMOVE_USERS_FROM_TEAM', { team, users })

            // Update API
            const apiUrl = `/teams/${team.id}/users`
            await axios({
                method: 'post',
                url: apiUrl,
                data: {
                    method: 'Remove',
                    users: users,
                },
            })
                .then(() => {
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${users.length} user${users.length > 1 ? 's' : ''} removed from team`,
                            iconClass: 'fa-check',
                            type: 'success',
                            callback: () => dispatch('addUsersToTeam', { team, users }),
                            callbackLabel: 'undo',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Error when removing users from team. Please try again',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('removeUsersFromTeam', { team, users }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        SET_TEAMS_STATUS(state, status) {
            state.status = status
        },
        SET_CURRENT_TEAM(state, team) {
            state.currentTeam = team
        },
        setAvailableTeams(state, teams) {
            state.availableTeams = teams
        },
        INSERT_OR_UPDATE_TEAM(state, team) {
            if (team.id && state.teams.find(x => x.id == team.id)) {
                Object.assign(state.teams.find(x => x.id == team.id), team)
            } else {
                state.teams.push(team)
            }
        },
        DELETE_TEAM(state, team) {
            const index = state.teams.findIndex(x => x.id == team.id)
            state.teams.splice(index, 1)
        },
        SET_TEAM_USERS(state, { team, users }) {
            Vue.set(team, 'users', users)
        },
        addUsersToTeam(state, { team, users }) {
            if (team.users) {
                Vue.set(team, 'users', team.users.concat(users))
            } else {
                Vue.set(team, 'users', users)
            }
            team.user_count = team.users.length
        },
        REMOVE_USERS_FROM_TEAM(state, { team, users }) {
            for (let i = users.length; i--; ) {
                const user = users[i]
                const index = team.users.findIndex(x => x.id == user.id)
                team.users.splice(index, 1)
                team.user_count = team.users.length
            }
        },
        SET_WORKSPACE_FETCHED_FROM_ID(state, workspaceId) {
            state.workspaceFetchedFromId = workspaceId
        },
    },
}
