import axios from 'axios'
import Vue from 'vue'
import Selection from '../models/Selection'

export default {
    namespaced: true,

    state: {
        loading: true,
        status: true,
        currentSelection: null,
        selections: [],
        selectionsTree: [],
        availableSelectionRoles: [
            {
                role: 'User',
                description: 'Gvies feedback and makes comments',
            },
            {
                name: 'Owner',
                description: 'Aligns the selection',
            },
            {
                name: 'Approver',
                description: 'Replies to requests',
            },
        ],
    },

    getters: {
        loadingSelections: state => state.loading,
        selectionsStatus: state => state.status,
        currentSelection: state => state.currentSelection,
        selections: state => state.selections,
        selectionsTree: state => state.selectionsTree,
        availableSelectionRoles: state => {
            return state.availableSelectionRoles
        },
        isFeedback: (state, getters) => {
            return getters.currentSelection.user_access == 'user'
        },
    },

    actions: {
        async fetchSelections({ commit }, file) {
            commit('setLoading', true)
            const apiUrl = `/files/${file.id}/selections/flat`
            await axios.get(apiUrl).then(response => {
                commit('insertSelections', response.data)
                commit('insertSelectionsAsTree', response.data)
            })
            commit('setLoading', false)
        },
        async fetchSelection({ commit }, selectionId) {
            commit('setStatus', 'loading')

            const apiUrl = `/selections/${selectionId}`
            axios
                .get(apiUrl)
                .then(response => {
                    commit('setCurrentSelection', response.data)
                    commit('setStatus', 'success')
                })
                .catch(err => {
                    commit('setStatus', 'error')
                })
        },
        async fetchSelectionUsers({ commit }, selection) {
            // Get owners for file
            const apiUrl = `/selections/${selection.id}/users`
            await axios.get(apiUrl).then(response => {
                Vue.set(selection, 'users', response.data)
            })
        },
        async fetchSelectionTeams({ commit }, selection) {
            // Get owners for file
            const apiUrl = `/selections/${selection.id}/teams`
            await axios.get(apiUrl).then(response => {
                Vue.set(selection, 'teams', response.data)
            })
        },
        async insertSelection({ commit }, { file, selection }) {
            // Check if we are inserting a master or a child
            let apiUrl = ''
            if (selection.parent_id) {
                apiUrl = `/selection/${selection.parent_id}/children`
            } else {
                apiUrl = `/files/${file.id}/selections`
            }
            await axios.post(apiUrl, selection).then(async response => {
                selection.id = response.data.id
                // commit('insertSelections', { file, selections: [selection] })
            })
        },
        async updateSelection({ commit }, selection) {
            // Assume update
            let apiUrl = `/files/${file.id}/selections`
            let requestMethod = 'put'
            let requestBody = selection
            // Check if we are inserting or updating
            if (!selection.id) {
                // If we are inserting
                commit('insertSelection', selection)
                requestMethod = 'post'
                apiUrl = `/selections`
            } else {
                commit('updateSelection', selection)
            }

            await axios({
                method: requestMethod,
                url: apiUrl,
                data: requestBody,
            }).then(async response => {
                // Set the selections ID if not already set
                if (!selection.id) selection.id = response.data.id
            })
        },
        addUsersToSelection({ commit }, { selection, users }) {
            // Commit mutation to state
            commit('addUsersToSelection', { selection, users })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/users`
            axios.post(apiUrl, {
                method: 'Add',
                user_ids: users.map(x => x.id),
            })
        },
        removeUsersFromSelection({ commit }, { selection, users }) {
            // Commit mutation to state
            commit('removeUsersFromSelection', { selection, users })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/users`
            axios.post(apiUrl, {
                method: 'Remove',
                user_ids: users.map(x => x.id),
            })
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
    },

    mutations: {
        setLoading(state, bool) {
            state.loading = bool
        },
        setStatus(state, status) {
            state.status = status
        },
        setCurrentSelection(state, selection) {
            state.currentSelection = selection
        },
        insertSelections(state, selections) {
            // Check if we have already instantiated selections
            state.selections.push(...selections)
        },
        insertSelectionsAsTree(state, selections) {
            const list = selections
            let map = {},
                node,
                roots = [],
                i
            for (i = 0; i < list.length; i += 1) {
                map[list[i].id] = i // initialize the map
                Vue.set(list[i], 'children', []) // initialize the children
            }
            for (i = 0; i < list.length; i += 1) {
                node = list[i]
                if (node.parent_id !== '0') {
                    // if you have dangling branches check that map[node.parentId] exists
                    list[map[node.parent_id]].children.push(node)
                } else {
                    roots.push(node)
                }
            }
            state.selectionsTree = roots
        },
        updateSelection(state, selection) {
            // const oldFile = state.files.find(x => x.id == file.id)
            // Object.assign(oldFile, file)
        },
        addUsersToSelection(state, { selection, users }) {
            // Make a clone of the user and set their default selection role
            const usersToPush = []
            users.forEach(user => {
                const userToPush = JSON.parse(JSON.stringify(user))
                userToPush.role = 'Member'
                usersToPush.push(userToPush)
            })
            if (selection.users) {
                Vue.set(selection, 'users', selection.users.concat(usersToPush))
            } else {
                Vue.set(selection, 'users', usersToPush)
            }
        },
        removeUsersFromSelection(state, { selection, users }) {
            // Loop through the users and remove them
            users.forEach(user => {
                const userIndex = selection.users.findIndex(x => x.id == user.id)
                selection.users.splice(userIndex, 1)
            })
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
