import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        loading: true,
        status: null,
        usersStatus: null,
        teamsStatus: null,
        currentSelection: null,
        selections: [],
        selectionsTree: [],
        availableSelectionRoles: [
            {
                role: 'Member',
                description: 'Gvies feedback and makes comments',
            },
            {
                role: 'Owner',
                description: 'Aligns the selection',
            },
            {
                role: 'Approver',
                description: 'Replies to requests',
            },
        ],
    },

    getters: {
        loadingSelections: state => state.loading,
        selectionsStatus: state => state.status,
        selectionUsersStatus: state => state.usersStatus,
        selectionTeamsStatus: state => state.teamsStatus,
        currentSelection: state => state.currentSelection,
        currentSelectionUsers: state => {
            const selection = state.currentSelection
            const usersTorReturn = []
            if (!selection) return usersTorReturn
            // Get users manually added and from teams
            // Loop through the manually added users to see if they should be removed
            if (selection.users) {
                usersTorReturn.push(...selection.users)
            }
            // Add the team users if any
            if (selection.teams) {
                // Loop through the teams and add their users
                selection.teams.forEach(team => {
                    if (team.users) {
                        // Loop through the users to make sure they are not already added
                        team.users.forEach(teamUser => {
                            if (!usersTorReturn.find(x => x.id == teamUser.id)) {
                                const userToPush = JSON.parse(JSON.stringify(teamUser))
                                userToPush.added_by_team = true
                                userToPush.role = 'Member'
                                usersTorReturn.push(userToPush)
                            }
                        })
                    }
                })
            }
            return usersTorReturn
        },
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
            // Get users for selection
            commit('setUsersStatus', 'loading')
            const apiUrl = `/selections/${selection.id}/users`
            await axios.get(apiUrl).then(response => {
                // Vue.set(selection, 'users', response.data)
                commit('addUsersToSelection', { selection, users: response.data })
            })
            commit('setUsersStatus', 'success')
        },
        async fetchSelectionTeams({ commit }, selection) {
            // Get teams for selection
            commit('setTeamsStatus', 'loading')
            let teams = []
            const apiUrl = `/selections/${selection.id}/teams`
            await axios.get(apiUrl).then(response => {
                teams = response.data
                // Commit mutation to state
                commit('addTeamsToSelection', { selection, teams })
            })
            commit('setTeamsStatus', 'success')
            return teams
        },
        async insertSelection({ commit }, { file, selection }) {
            // Check if we are inserting a master or a child
            let apiUrl = ''
            if (selection.parent_id) {
                apiUrl = `/selections/${selection.parent_id}/children`
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
            commit('addUsersToSelection', {
                selection,
                users: users.map(user => {
                    user.role = 'Member'
                    return user
                }),
            })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/users`
            axios.post(apiUrl, {
                method: 'Add',
                users: users.map(x => {
                    return {
                        id: x.id,
                        role: 'Member',
                    }
                }),
            })
        },
        updateSelectionUsers({ commit }, { selection, users }) {
            // Commit mutation to state
            commit('updateSelectionUsers', { selection, users })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/users`
            axios.post(apiUrl, {
                method: 'Add',
                users: users.map(x => {
                    return {
                        id: x.id,
                        role: x.role,
                    }
                }),
            })
        },
        removeUsersFromSelection({ commit }, { selection, users }) {
            // Commit mutation to state
            commit('removeUsersFromSelection', { selection, users })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/users`
            axios.post(apiUrl, {
                method: 'Remove',
                users: users.map(x => {
                    return {
                        id: x.id,
                    }
                }),
            })
        },
        addTeamsToSelection({ commit }, { selection, teams }) {
            // Commit mutation to state
            commit('addTeamsToSelection', { selection, teams })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/teams`
            axios.post(apiUrl, {
                method: 'Add',
                team_ids: teams.map(x => x.id),
            })
        },
        removeTeamsFromSelection({ commit }, { selection, teams }) {
            // Commit mutation to state
            commit('removeTeamsFromSelection', { selection, teams })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/teams`
            axios.post(apiUrl, {
                method: 'Remove',
                team_ids: teams.map(x => x.id),
            })
        },
    },

    mutations: {
        setLoading(state, bool) {
            state.loading = bool
        },
        setStatus(state, status) {
            state.status = status
        },
        setTeamsStatus(state, status) {
            state.teamsStatus = status
        },
        setUsersStatus(state, status) {
            state.usersStatus = status
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
            // Instantiate the users object as a reactive object if it doesnt already exist
            if (selection.users) {
                selection.users.push(...users)
            } else {
                Vue.set(selection, 'users', users)
            }
        },
        updateSelectionUsers(state, { selection, users }) {
            // Loop through our users
            users.forEach(user => {
                // If the user exists edit it, else add it
                const existingUser = selection.users.find(x => x.id == user.id)
                if (existingUser) {
                    existingUser.role = user.role
                } else {
                    selection.users.push(user)
                }
            })
        },
        removeUsersFromSelection(state, { selection, users }) {
            // Loop through the users and remove them
            users.forEach(user => {
                const userIndex = selection.users.findIndex(x => x.id == user.id)
                selection.users.splice(userIndex, 1)
            })
        },
        addTeamsToSelection(state, { selection, teams }) {
            // Instantiate the teams object as a reactive object if it doesnt already exist
            if (selection.teams) {
                selection.teams.push(...teams)
            } else {
                Vue.set(selection, 'teams', teams)
            }

            // // Add teams to teams array
            // selection.teams = selection.teams.concat(teams)
            // // Add the users from the team to the users array
            // const usersToAdd = []
            // teams.forEach(team => {
            //     // Make a copy of the team and remove the users property from the copy to avoid a circular reference
            //     const teamToAdd = JSON.parse(JSON.stringify(team))
            //     delete teamToAdd.users

            //     team.users.forEach(user => {
            //         // Set a key to indicate that the user was added through a team
            //         user.added_by_team = true

            //         // Check if the user already exists on the selection
            //         const selectionUser = selection.users.find(x => x.id == user.id)

            //         if (selectionUser) {
            //             // Add the current team to the selection_teams list on the selection user
            //             selectionUser.selection_teams.push(teamToAdd)
            //         } else {
            //             // Check if we are already adding this user now
            //             const userToAdd = usersToAdd.find(x => x.id == user.id)
            //             if (userToAdd) {
            //                 // Add the current team to the selection_teams list on the user to add
            //                 userToAdd.selection_teams.push(teamToAdd)
            //             } else {
            //                 // If the user does not exist on the selection already and is not one of the users we are about to add, add the user
            //                 // Add the current team to the users selection_teams list
            //                 user.selection_teams.push(teamToAdd)
            //                 usersToAdd.push(user)
            //             }
            //         }
            //     })
            // })
            // // Add the new users
            // selection.users = selection.users.concat(usersToAdd)
        },
        removeTeamsFromSelection(state, { selection, teams }) {
            teams.forEach(team => {
                const teamIndex = selection.teams.findIndex(x => x.id == team.id)
                selection.teams.splice(teamIndex, 1)
            })
        },
    },
}
