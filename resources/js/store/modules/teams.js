import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        loading: false,
        currentTeam: null,
        currentTeamStatus: 'loading',
        availableTeams: [],
        teams: [],
        availableTeamRoles: [
            {
                role: 'Member',
                description: 'Gives feedback on selections and can make commentsw',
            },
            {
                role: 'Owner',
                description:
                    'The owner aligns selections and can make requests. Also manages the team and can add/remove users',
            },
        ],
    },

    getters: {
        loadingTeams: state => state.loading,
        currentTeamId: state => state.currentTeam.id,
        availableTeams: state => state.availableTeams,
        teams: state => state.teams,
        availableTeamRoles: state => state.availableTeamRoles,
        currentTeam: state => state.currentTeam,
        currentTeamStatus: state => state.currentTeamStatus,
        nextTeam: (state, getters) => {
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
            const available = getters.availableTeams
            const currentId = getters.currentTeam.id
            if (currentId && available.length > 0) {
                const currentIndex = available.findIndex(x => x.id == currentId)
                if (currentIndex != 0) {
                    return available[currentIndex - 1]
                }
            }
        },
    },

    actions: {
        async fetchTeams({ commit }, workspace_id) {
            // Set the state to loading
            if (workspace_id) {
                commit('setLoading', true)

            const apiUrl = `/workspaces/${workspaceId}/teams`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    Vue.set(state, 'teams', response.data)
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
        async fetchTeamUsers({ commit, state }, team) {
            // Set the state to loading
            state.currentTeamStatus = 'loading'
            const apiUrl = `/teams/${team.id}/users`
            await axios
                .get(`${apiUrl}`)
                .then(response => {
                    commit('addUsersToTeam', { team, users: response.data })
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
                    if (!team.id) team.id = response.data.id
                    commit('insertOrUpdateTeam', response.data)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        async deleteTeam({ commit }, team) {
            commit('deleteTeam', team)
            const apiUrl = `/teams/${team.id}`
            let succes
            commit('updateTeam', team)
            await axios
                .put(apiUrl, team)
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
        async deleteTeam({ commit }, team_id) {
            commit('deleteTeam', team_id)
            const apiUrl = `/api/team`
            let succes
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
                    succes = true
                })
                .catch(err => {
                    console.log(err.response)
                    succes = false
                })
            return succes
        },
        async updateTeamUsers({ commit }, { team, users }) {
            const apiUrl = `/teams/${team.id}/users`

            await axios({
                method: 'post',
                url: apiUrl,
                data: {
                    method: 'Add',
                    users: users,
                },
            })
        },
        async removeUsersFromTeam({ commit, dispatch }, { team, users }) {
            console.log(team)
            console.log(users)
            // Update state
            commit('removeUsersFromTeam', { team, users })

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
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        setCurrentTeam(state, team) {
            state.currentTeam = team
        },
        setAvailableTeams(state, teams) {
            state.availableTeams = teams
        },
        insertOrUpdateTeam(state, team) {
            if (team.id && state.teams.find(x => x.id == team.id)) {
                Object.assign(
                    state.teams.find(x => x.id == team.id),
                    team
                )
            } else {
                state.teams.push(team)
            }
        },
        deleteTeam(state, team) {
            const index = state.teams.findIndex(x => x.id == team.id)
            state.teams.splice(index, 1)
        },
        addUsersToTeam(state, { team, users }) {
            if (team.users) {
                Vue.set(team, 'users', team.users.concat(users))
            } else {
                Vue.set(team, 'users', users)
            }
            team.user_count = team.users.length
        },
        removeUsersFromTeam(state, { team, users }) {
            users.forEach(user => {
                const index = team.users.findIndex(x => x.id == user.id)
                team.users.splice(index, 1)
                team.user_count = team.users.length
            })
        },
    },
}
