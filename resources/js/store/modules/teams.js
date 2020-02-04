import axios from 'axios'
import Team from '../models/Team'
import User from '../models/User'
import AuthUser from '../models/AuthUser'

export default {
    namespaced: true,

    state: {
        loading: true,
        currentTeamId: null,
        availableTeamIds: [],
        teams: [],
    },

    getters: {
        loadingTeams: state => {
            return state.loading
        },
        currentTeamId: state => {
            return state.currentTeamId
        },
        availableTeamIds: state => {
            return state.availableTeamIds
        },
        teams: state => {
            return state.teams
        },
        currentTeam: (state, getters) => {
            const teamId = getters.currentTeamId
            const teams = getters.teams
            if (teamId && teams.length) {
                return teams.find(x => x.id == teamId)
            }
        },
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
        async fetchTeams({ commit, dispatch }, workspace_id) {
            // Set the state to loading
            if (workspace_id) {
                commit('setLoading', true)

                const apiUrl = `/api/workspace/${workspace_id}/teams`

                let tryCount = 3
                let succes = false
                while (tryCount-- > 0 && !succes) {
                    try {
                        const response = await axios.get(`${apiUrl}`)
                        Team.create({ data: response.data })
                        commit('setLoading', false)
                        dispatch('instantiateTeams')
                        succes = true
                    } catch (err) {
                        console.log('API error in teams.js :')
                        console.log(err)
                        console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                        if (tryCount <= 0) throw err
                    }
                }
            }
        },
        async createTeam({ commit, dispatch, state }, team) {
            let succes

            let apiURL = `/api/team`
            let requestMethod = 'post'

            // Instantiate a new team to push to the store
            const newTeam = {
                id: null,
                title: team.title,
                currency: team.currency,
                users: [],
                files: [],
            }
            // Update state
            state.teams.push(newTeam)

            await axios({
                method: requestMethod,
                url: apiURL,
                data: {
                    team: team,
                },
            })
                .then(async response => {
                    succes = true

                    // Update the new teams id
                    newTeam.id = response.data.id
                    // Add team to Vuex ORM
                    await commit('updateTeam', response.data)
                })
                .catch(err => {
                    console.log(err)
                    console.log(err.response)
                    succes = false
                })
            return succes
        },
        async updateTeam({ commit }, team) {
            let succes

            let apiURL = `/api/team`
            let requestMethod = 'post'
            if (team.id) {
                apiURL = `/api/team/${team.id}`
                requestMethod = 'put'
            }

            let teamToPush = {
                id: team.id,
                title: team.title,
                currency: team.currency,
                category_scope: team.category_scope,
                workspace_id: team.workspace_id,
            }
            await axios({
                method: requestMethod,
                url: apiURL,
                data: {
                    team: teamToPush,
                },
            })
                .then(response => {
                    console.log(response.data)
                    if (!team.id) team.id = response.data.id
                    succes = true
                    commit('updateTeam', teamToPush)
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
            await axios
                .delete(apiUrl, {
                    data: {
                        team_id: team_id,
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
        async instantiateTeams({ state, rootGetters }) {
            const adminPermissionLevel = rootGetters['persist/adminPermissionLevel']
            const teams = Team.query()
                // .with('users.userTeams')
                .with('userTeams.user')
                .with('teamFiles')
                .with('files')
                .all()
            const authUser = AuthUser.query()
                .with('teams')
                .first()

            // Create user objects for each team that has all the data we want
            teams.forEach(team => {
                team.users = []
                team.userTeams.forEach(userTeam => {
                    if (userTeam.user) {
                        userTeam.user.teamRoleId = userTeam.permission_level
                        team.users.push(userTeam.user)
                    }
                    // userTeam.user.teamRoleId = userTeam.permission_level
                    // team.users.push(userTeam.user)
                })
            })

            if (authUser.role_id >= adminPermissionLevel) {
                state.teams = teams
            } else {
                // Get the users teams
                let userTeams = []
                teams.forEach(team => {
                    if (authUser.teams.find(x => x.id == team.id)) userTeams.push(team)
                })
                state.teams = userTeams
            }
        },
        // async instantiateTeam({ state, rootGetters }, team) {
        //     const newTeam = Team.find(team.id)
        //     state.teams.push(newTeam)
        // },
        async recalcTeamUsers({ state, rootGetters }, teamToRecalc) {
            const team = Team.query()
                // .with('users.userTeams')
                .with('userTeams.user')
                .find(teamToRecalc.id)

            // Create user objects for each team that has all the data we want
            team.users = []
            team.userTeams.forEach(userTeam => {
                if (userTeam.user) {
                    userTeam.user.teamRoleId = userTeam.permission_level
                    team.users.push(userTeam.user)
                }
                // else {
                //     console.log('userTeam lags a user!')
                //     console.log(userTeam)
                // }
            })

            // // Set the team to recalculate to the new team
            teamToRecalc.users = team.users
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        setCurrentTeamId(state, id) {
            state.currentTeamId = id
        },
        setAvailableTeamIds(state, ids) {
            state.availableTeamIds = ids
        },
        updateTeam(state, team) {
            Team.insert({ data: team })
        },
        deleteTeam(state, team_id) {
            const index = state.teams.findIndex(x => x.id == team_id)
            state.teams.splice(index, 1)
            Team.delete(team_id)
        },
    },
}
