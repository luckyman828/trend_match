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
                // Manually find the teams and the users belonging to each team.
                // This is only necessary because I cannot make the Vuex ORM realtionship work
                // If you can make it work, please be my guest
                const adminPermissionLevel = rootGetters['persist/adminPermissionLevel']
                const teams = Team.query()
                    .with('users.role')
                    .with('invites')
                    .with('teamFiles')
                    .with('files')
                    .with('phases')
                    .all()
                const users = User.query()
                    .with('teams')
                    .with('role')
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
        // teams: (state, getters, rootState, rootGetters) => {
        //     if (!rootGetters['persist/loadingInit']) {
        //         // Manually find the teams and the users belonging to each team.
        //         // This is only necessary because I cannot make the Vuex ORM realtionship work
        //         // If you can make it work, please be my guest
        //         const adminPermissionLevel = rootGetters['persist/adminPermissionLevel']
        //         const teams = Team.query()
        //             .with('users')
        //             .with('invites')
        //             .with('teamFiles')
        //             .with('files')
        //             .with('phases')
        //             .all()
        //         const users = User.query()
        //             .with('teams')
        //             .with('role')
        //             .all()
        //         const authUser = AuthUser.query()
        //             .with('teams')
        //             .first()
        //         // Loop through the users and sort them between the teams
        //         users.forEach(user => {
        //             // First check that the user has a team and that the team has an id
        //             if (user.teams[0] != null) {
        //                 if ('id' in user.teams[0]) {
        //                     // If we have a team with an id
        //                     // Set the users role
        //                     user.teams.forEach(userTeam => {
        //                         // Loop through each of the users teams and add the user
        //                         // Find the corresponding team
        //                         const foundTeam = teams.find(team => team.id == userTeam.id)
        //                         // Check that the user doesnt already exist in this team
        //                         if (!foundTeam.users.includes(user))
        //                             // Push the user to the team if the user is not already a member
        //                             foundTeam.users.push(user)
        //                     })
        //                 }
        //             }
        //         })
        //         if (authUser.role_id >= adminPermissionLevel) return teams
        //         else {
        //             // Get the users teams
        //             let userTeams = []
        //             teams.forEach(team => {
        //                 if (authUser.teams.find(x => x.id == team.id)) userTeams.push(team)
        //             })
        //             return userTeams
        //         }
        //     }
        // },
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
            const data = {
                title: name,
            }
            const apiUrl = `/api/workspace/${workspace_id}/team`

            let succes
            let team_id = null
            // Handle the invite in the DB via API
            await axios
                .post(apiUrl, data)
                .then(response => {
                    console.log(response.data)
                    team_id = response.data.id
                    succes = true
                })
                .catch(err => {
                    console.log(err)
                    succes = false
                })

            commit('createTeam', { name: name, workspace_id: workspace_id, team_id: team_id })

            return succes
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        createTeam(state, { name, workspace_id, team_id }) {
            Team.insert({
                data: {
                    id: team_id,
                    title: name,
                    workspace_id: workspace_id,
                },
            })
            console.log(name + workspace_id + team_id)
        },
    },
}
