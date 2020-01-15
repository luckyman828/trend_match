import axios from 'axios'
import UserTeam from '../models/UserTeam'
import User from '../models/User'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingUserTeams: state => {
            return state.loading
        },
    },

    actions: {
        async fetchUserTeams({ commit }) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/collection/user-teams`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    UserTeam.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in userTeams.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        async inviteUserToTeam({ commit }, { user, team, authUser }) {
            // Handle the invite in Vuex
            // Check if the user already exists
            const existingUser = User.query()
                .where('email', user.email)
                .first()
            if (existingUser != null) {
                // If the user exists - add them to the team (does not matter if they are already a member of the team)
                commit('addUserToTeam', { user: existingUser, team: team })
            } else {
                // If the user does not exist - add a record to the team_invites store
                commit('entities/teamInvites/addTeamInvite', { email: user.email, team_id: team.id }, { root: true })
            }

            // Handle the invite in the DB via API
            console.log('Sending request to /api/invite-user')
            await axios
                .post(`/api/invite-user`, {
                    user: user,
                    team: team,
                    sender: authUser,
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        async inviteUsersToTeam({ commit }, { users, team, authUser }) {
            // Handle the invite in Vuex
            // Check if the user already exists
            users.forEach(user => {
                const existingUser = User.query()
                    .where('email', user.email)
                    .first()
                if (existingUser != null) {
                    // If the user exists - add them to the team (does not matter if they are already a member of the team)
                    commit('addUserToTeam', { user: existingUser, team: team, permission_level: user.role })
                } else {
                    // If the user does not exist - add a record to the team_invites store
                    commit(
                        'entities/teamInvites/addTeamInvite',
                        { email: user.email, team_id: team.id, permission_level: user.role },
                        { root: true }
                    )
                }
            })

            // Handle the invite in the DB via API
            console.log('Sending request to /api/invite-user')
            await axios
                .post(`/api/invite-users`, {
                    users: users,
                    team: team,
                    sender: authUser,
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        async removeUserFromTeam({ commit }, { user_id, team_id }) {
            // If the user does not exist - add a record to the team_invites store
            commit('removeUser', { user_id: user_id, team_id: team_id })

            // Handle the invite in the DB via API
            console.log('Sending request to /api/invite-user')
            await axios
                .delete(`/api/user-team`, {
                    data: {
                        user_id: user_id,
                        team_id: team_id,
                    },
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        async updateUserTeam({ commit }, userTeamToUpdate) {
            let succes

            let apiURL = `/api/user-team`
            let requestMethod = 'put'

            // Instantiate a new workspaceUser object, to strip away any added/calculated attributes
            let dataToPush = {
                user_id: userTeamToUpdate.user_id,
                team_id: userTeamToUpdate.team_id,
                permission_level: userTeamToUpdate.permission_level,
            }
            await axios({
                method: requestMethod,
                url: apiURL,
                data: dataToPush,
            })
                .then(response => {
                    console.log(response.data)
                    succes = true
                    commit('updateUserTeam', userTeamToUpdate)
                })
                .catch(err => {
                    console.log(err.response)
                    succes = false
                })
            return succes
        },
        async addUsersToTeam({ commit, dispatch }, payload) {
            // payload is expected to have keys: team, and userIdsToAdd
            const team = payload.team
            const userIdsToAdd = payload.userIdsToAdd

            let succes

            let apiURL = `/api/team/add-users`
            let requestMethod = 'post'

            // Update the state
            await commit('addUsersToTeam', { team, userIdsToAdd })
            dispatch('entities/teams/recalcTeamUsers', team, { root: true })

            // Instantiate a new eamUser object, to strip away any added/calculated attributes
            let dataToPush = {
                team_id: team.id,
                user_ids: userIdsToAdd,
            }
            await axios({
                method: requestMethod,
                url: apiURL,
                data: dataToPush,
            })
                .then(async response => {
                    console.log(response.data)
                    succes = true
                })
                .catch(err => {
                    console.log('There is an error in userTeams')
                    console.log(err)
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

        addUserToTeam(state, { user, team, permission_level }) {
            UserTeam.insert({
                data: {
                    user_id: user.id,
                    team_id: team.id,
                    permission_level: permission_level,
                },
            })
        },

        removeUser(state, { user_id, team_id }) {
            UserTeam.delete(x => {
                return x.user_id == user_id && x.team_id == team_id
            })
        },
        updateUserTeam(state, userTeam) {
            UserTeam.insert({ data: userTeam })
        },
        addUsersToTeam(state, payload) {
            // payload is expected to have keys: team, and userIdsToAdd
            const team = payload.team
            const userIdsToAdd = payload.userIdsToAdd
            let data = []

            userIdsToAdd.forEach(userId => {
                const userTeamData = {
                    team_id: team.id,
                    user_id: userId,
                    permission_level: 1,
                }
                data.push(userTeamData)
            })

            UserTeam.insert({
                data: data,
            })
        },
    },
}
