import axios from 'axios'
import Team from '../models/Team'
import User from '../models/User'
import AuthUser from '../models/AuthUser'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingTeams: state => {
            return state.loading
        },
        teams: (state, getters, rootState, rootGetters) => {
            if (!rootGetters['persist/loadingInit']) {
                const adminPermissionLevel = rootGetters['persist/adminPermissionLevel']
                const teams = Team.query()
                    .with('users.role')
                    .with('invites')
                    .with('teamFiles')
                    .with('files')
                    .with('phases')
                    .all()
                const authUser = AuthUser.query()
                    .with('teams')
                    .first()

                if (authUser.role_id >= adminPermissionLevel) return teams
                else {
                    // Get the users teams
                    let userTeams = []
                    teams.forEach(team => {
                        if (authUser.teams.find(x => x.id == team.id)) userTeams.push(team)
                    })
                    return userTeams
                }
            }
        },
    },

    actions: {
        async fetchTeams({ commit }, workspace_id) {
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
        async createTeam({ commit }, { name, workspace_id }) {
            const team = {
                title: name,
                workspace_id: workspace_id,
                id: null,
            }
            const apiUrl = `/api/workspace/${workspace_id}/team`
            let succes
            await axios
                .post(apiUrl, team)
                .then(response => {
                    console.log(response.data)
                    team.id = response.data.id
                    succes = true
                })
                .catch(err => {
                    console.log(err)
                    succes = false
                })

            commit('updateTeam', team)

            return succes
        },
        async updateTeam({ commit }, team) {
            const apiUrl = `/api/team`
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
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        updateTeam(state, team) {
            Team.insert({
                data: team,
            })
        },
        deleteTeam(state, team_id) {
            Team.delete(team_id)
        },
    },
}
