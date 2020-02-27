import axios from 'axios'
import Vue from 'vue'
import Team from '../models/Team'
import User from '../models/User'
import AuthUser from '../models/AuthUser'

export default {
    namespaced: true,

    state: {
        loading: false,
        currentTeam: null,
        currentTeamStatus: 'loading',
        availableTeamIds: [],
        teams: null,
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
        currentTeamId: state => state.currentTeamId,
        availableTeamIds: state => state.availableTeamIds,
        teams: state => state.teams,
        availableTeamRoles: state => state.availableTeamRoles,
        currentTeam: state => state.currentTeam,
        currentTeamStatus: state => state.currentTeamStatus,
        // currentTeam: (state, getters) => {
        //     const teamId = getters.currentTeamId
        //     const teams = getters.teams
        //     if (teamId && teams.length) {
        //         return teams.find(x => x.id == teamId)
        //     }
        // },
        nextTeamId: (state, getters) => {
            const availableIds = getters.availableTeamIds
            const currentId = getters.currentTeamId
            if (currentId && availableIds.length > 0) {
                const currentIndex = availableIds.findIndex(x => x == currentId)
                if (currentIndex < availableIds.length - 1) {
                    return availableIds[currentIndex + 1]
                }
            }
        },
        prevTeamId: (state, getters) => {
            const availableIds = getters.availableTeamIds
            const currentId = getters.currentTeamId
            if (currentId && availableIds.length > 0) {
                const currentIndex = availableIds.findIndex(x => x == currentId)
                if (currentIndex != 0) {
                    return availableIds[currentIndex - 1]
                }
            }
        },
    },

    actions: {
        async fetchTeams({ commit, state, rootGetters }) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/workspaces/${workspaceId}/teams`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    state.teams = response.data
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
            let succes

            let teamToPush = {
                title: team.title,
                currency: team.currency,
            }

            let apiUrl = `/workspaces/${workspaceId}/teams`
            let requestMethod = 'post'
            if (team.id) {
                apiUrl = `/teams/${team.id}`
                requestMethod = 'put'
            } else {
                // Get a unique id for the new team
                // const newId = await dispatch('persist/useUid', null, { root: true })
                // // team.id = newId
                // console.log(newId)
            }

            await axios({
                method: requestMethod,
                url: apiUrl,
                data: teamToPush,
            })
                .then(response => {
                    if (!team.id) team.id = response.data.id
                    succes = true
                    commit('updateTeam', teamToPush)
                })
                .catch(err => {
                    console.log(err)
                    console.log(err.response)
                    succes = false
                })
            return succes
        },
        async deleteTeam({ commit }, team) {
            commit('deleteTeam', team)
            const apiUrl = `/teams/${team.id}`
            let succes
            await axios({
                method: 'delete',
                url: apiUrl,
            })
                .then(response => {
                    succes = true
                })
                .catch(err => {
                    console.log(err.response)
                    succes = false
                })
            return succes
        },
        async addUsersToTeam({ commit, dispatch }, { team, users }) {
            // Make a copy of the users and set their role to 'Member' as default
            const usersCopy = JSON.parse(JSON.stringify(users))
            const usersToPush = usersCopy.map(x => {
                x.role = 'Member'
                return x
            })
            console.log(usersToPush)
            // Format our users for our request body
            const usersToPost = users.map(user => {
                return { id: user.id, role: 'Member' }
            })

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
                    console.log(err)
                    succes = false
                })
            return succes
        },
        async updateTeamUser({ commit }, { team, user }) {
            const apiUrl = `/teams/${team.id}/users`

            await axios({
                method: 'post',
                url: apiUrl,
                data: {
                    method: 'Add',
                    users: [user],
                },
            })
        },
        async removeUserFromTeam({ commit, dispatch }, { team, user }) {
            // Update state
            commit('removeUserFromTeam', { team, user })

            // Update API
            const apiUrl = `/teams/${team.id}/users`
            await axios({
                method: 'post',
                url: apiUrl,
                data: {
                    method: 'Remove',
                    users: [user],
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
        setAvailableTeamIds(state, ids) {
            state.availableTeamIds = ids
        },
        updateTeam(state, team) {},
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
        removeUserFromTeam(state, { team, user }) {
            const index = team.users.find(x => x.id == user.id)
            team.users.splice(index, 1)
            team.user_count = team.users.length
        },
    },
}
