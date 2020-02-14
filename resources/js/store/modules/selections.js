import axios from 'axios'
import Selection from '../models/Selection'

export default {
    namespaced: true,

    state: {
        loading: true,
        currentSelectionId: null,
        availableSelectionRoles: [
            {
                name: 'External',
                description: 'Externals have limited rights',
            },
            {
                name: 'Member',
                description: 'Gvies feedback and makes comments',
            },
            {
                name: 'Observer',
                description: 'Can only see data',
            },
            {
                name: 'Owner',
                description: 'Aligns the selection',
            },
        ],
    },

    getters: {
        loadingSelections: state => {
            return state.loading
        },
        currentSelectionId: state => {
            return state.currentSelectionId
        },
        currentSelection: state => {
            return Selection.find(state.currentSelectionId)
        },
        availableSelectionRoles: state => {
            return state.availableSelectionRoles
        },
        isFeedback: (state, getters) => {
            return getters.currentSelection.user_access == 'user'
        },
    },

    actions: {
        async fetchSelections({ commit }, workspace_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/workspace/${workspace_id}/selections`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    Selection.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in Selection.js :')
                    console.log(err.response)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        addUsersToSelection({ commit }, { selection, usersToAdd }) {
            // Commit mutation to state
            commit('addUsersToSelection', { selection, usersToAdd })
            // Send request to API
        },
        removeUserFromSelection({ commit }, { selection, user }) {
            // Commit mutation to state
            commit('removeUserFromSelection', { selection, user })
            // Send request to API
        },
        addTeamsToSelection({ commit }, { selection, teamsToAdd }) {
            // Commit mutation to state
            commit('addTeamsToSelection', { selection, teamsToAdd })
            // Send request to API
        },
        removeTeamFromSelection({ commit }, { selection, team }) {
            // Commit mutation to state
            commit('removeTeamFromSelection', { selection, team })
            // Send request to API
        },
        updateSelection({ commit }, selection) {},
    },

    mutations: {
        setLoading(state, bool) {
            state.loading = bool
        },
        setCurrentSelectionId(state, id) {
            state.currentSelectionId = id
        },
        addUsersToSelection(state, { selection, usersToAdd }) {
            // Make a clone of the user and set their default selection permission level
            const usersToPush = []
            usersToAdd.forEach(user => {
                const userToPush = JSON.parse(JSON.stringify(user))
                userToPush.role = 'Member'
                user.selection_teams = []
                usersToPush.push(userToPush)
            })
            selection.users = selection.users.concat(usersToPush)
        },
        removeUserFromSelection(state, { selection, user }) {
            const userIndex = selection.users.findIndex(x => x.id == user.id)
            selection.users.splice(userIndex, 1)
        },
        addTeamsToSelection(state, { selection, teamsToAdd }) {
            // Add teams to teams array
            selection.teams = selection.teams.concat(teamsToAdd)
            // Add the users from the team to the users array
            const usersToAdd = []
            teamsToAdd.forEach(team => {
                // Make a copy of the team and remove the users property from the copy to avoid a circular reference
                const teamToAdd = JSON.parse(JSON.stringify(team))
                delete teamToAdd.users

                team.users.forEach(user => {
                    // Set a key to indicate that the user was added through a team
                    user.added_by_team = true

                    // Check if the user already exists on the selection
                    const selectionUser = selection.users.find(x => x.id == user.id)

                    if (selectionUser) {
                        // Add the current team to the selection_teams list on the selection user
                        selectionUser.selection_teams.push(teamToAdd)
                    } else {
                        // Check if we are already adding this user now
                        const userToAdd = usersToAdd.find(x => x.id == user.id)
                        if (userToAdd) {
                            // Add the current team to the selection_teams list on the user to add
                            userToAdd.selection_teams.push(teamToAdd)
                        } else {
                            // If the user does not exist on the selection already and is not one of the users we are about to add, add the user
                            // Add the current team to the users selection_teams list
                            user.selection_teams.push(teamToAdd)
                            usersToAdd.push(user)
                        }
                    }
                })
            })
            // Add the new users
            selection.users = selection.users.concat(usersToAdd)
        },
        removeTeamFromSelection(state, { selection, team }) {
            const teamIndex = selection.teams.findIndex(x => x.id == team.id)
            selection.teams.splice(teamIndex, 1)

            // Check if any users new to be removed from the selection
            const usersToRemove = []

            selection.users.forEach(user => {
                if (user.added_by_team) {
                    // Remove the team form the users selection_teams array
                    const teamIndex = user.selection_teams.findIndex(x => x.id == team.id)
                    if (teamIndex >= 0) {
                        user.selection_teams.splice(teamIndex, 1)
                        // Remove the user from the selection if this was the last team in the selection_teams array
                        if (user.selection_teams.length < 1) {
                            usersToRemove.push(user)
                        }
                    }
                }
            })
            usersToRemove.forEach(user => {
                const userIndex = selection.users.findIndex(x => x.id == user.id)
                selection.users.splice(userIndex, 1)
            })
        },
    },
}
