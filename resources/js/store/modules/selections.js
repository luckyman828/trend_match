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
        currentSelectionUsers: null,
        selections: [],
        availableSelectionRoles: [
            {
                role: 'Member',
                description: 'Gives feedback and makes comments',
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
        currentSelectionMode: state => {
            if (state.currentSelection) {
                return state.currentSelection.your_role == 'Member'
                    ? 'Feedback'
                    : state.currentSelection.your_role == 'Owner'
                    ? 'Alignment'
                    : state.currentSelection.your_role == 'Approver'
                    ? 'Approval'
                    : 'No Access'
            }
        },
        currentSelectionModeAction: (state, getters) =>
            getters.currentSelectionMode == 'Feedback' ? 'your_feedback' : 'action',
        selections: state => state.selections,
        selectionsTree: state => {
            const list = state.selections
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
                if (node.parent_id != 0) {
                    // if you have dangling branches check that map[node.parentId] exists
                    list[map[node.parent_id]].children.push(node)
                } else {
                    roots.push(node)
                }
            }
            return roots
        },
        availableSelectionRoles: state => {
            return state.availableSelectionRoles
        },
        isFeedback: (state, getters) => {
            return getters.currentSelection.user_access == 'user'
        },
    },

    actions: {
        async fetchSelections({ commit }, { file, addToState = true }) {
            commit('setLoading', true)
            const apiUrl = `/files/${file.id}/selections/flat`
            let selections
            await axios.get(apiUrl).then(response => {
                selections = response.data
                if (addToState) {
                    commit('insertSelections', { selections, method: 'set' })
                }
            })
            commit('setLoading', false)
            return selections
        },
        async fetchSelection({ commit }, { selectionId, addToState = true }) {
            commit('setStatus', 'loading')

            const apiUrl = `/selections/${selectionId}`
            let selection
            await axios
                .get(apiUrl)
                .then(response => {
                    selection = response.data
                    if (addToState) {
                        commit('setCurrentSelection', selection)
                    }
                    commit('setStatus', 'success')
                })
                .catch(err => {
                    commit('setStatus', 'error')
                })
            return selection
        },
        async fetchSelectionUsers({ commit, dispatch }, selection) {
            // Get users for selection
            commit('setUsersStatus', 'loading')
            const apiUrl = `/selections/${selection.id}/users`
            await axios.get(apiUrl).then(response => {
                // Vue.set(selection, 'users', response.data)
                commit('addUsersToSelection', { selection, users: response.data })
            })
            commit('setUsersStatus', 'success')
        },
        async fetchSelectionTeams({ commit, dispatch }, selection) {
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
        async insertSelection({ commit, dispatch }, { file, selection, addToState = true }) {
            // Check if we are inserting a master or a child
            let apiUrl = ''

            if (selection.parent_id == '0' || !selection.parent_id) {
                apiUrl = `/files/${file.id}/selections`
            } else {
                apiUrl = `/selections/${selection.parent_id}/children`
            }
            await axios.post(apiUrl, selection).then(async response => {
                selection.id = response.data.id
                if (addToState) {
                    commit('insertSelections', { file, selections: [selection] })
                }
            })
        },
        async updateSelection({ commit, dispatch }, selection) {
            // Assume update
            let apiUrl = ''
            let requestMethod = 'put'
            let requestBody = selection
            // Check if we are inserting or updating
            if (!selection.id) {
                // If we are inserting
                commit('insertSelection', selection)
                requestMethod = 'post'
                apiUrl = `/files/${file.id}/selections`
            } else {
                commit('updateSelection', selection)
                requestMethod = 'put'
                apiUrl = `/selections/${selection.id}`
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
        async addUsersToSelection({ commit, dispatch }, { selection, users, ignoreRole = true }) {
            // Commit mutation to state
            await commit('addUsersToSelection', {
                selection,
                users: users.map(user => {
                    if (ignoreRole) user.role = 'Member'
                    return user
                }),
            })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/users`
            await axios.post(apiUrl, {
                method: 'Add',
                users: users.map(user => {
                    return {
                        id: user.id,
                        role: ignoreRole ? 'Member' : user.role,
                    }
                }),
            })
            dispatch('calculateSelectionUsers', selection)
        },
        async updateSelectionUsers({ commit, dispatch }, { selection, users }) {
            // Commit mutation to state
            await commit('updateSelectionUsers', { selection, users })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/users`
            await axios.post(apiUrl, {
                method: 'Add',
                users: users.map(x => {
                    return {
                        id: x.id,
                        role: x.role,
                    }
                }),
            })
            dispatch('calculateSelectionUsers', selection)
        },
        async removeUsersFromSelection({ commit, dispatch }, { selection, users }) {
            // Commit mutation to state
            await commit('removeUsersFromSelection', { selection, users })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/users`
            await axios.post(apiUrl, {
                method: 'Remove',
                users: users.map(x => {
                    return {
                        id: x.id,
                    }
                }),
            })
            dispatch('calculateSelectionUsers', selection)
        },
        async addTeamsToSelection({ commit, dispatch }, { selection, teams }) {
            // Commit mutation to state
            await commit('addTeamsToSelection', { selection, teams })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/teams`
            await axios.post(apiUrl, {
                method: 'Add',
                team_ids: teams.map(x => x.id),
            })
            dispatch('calculateSelectionUsers', selection)
        },
        async removeTeamsFromSelection({ commit, dispatch }, { selection, teams }) {
            // Commit mutation to state
            await commit('removeTeamsFromSelection', { selection, teams })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/teams`
            await axios.post(apiUrl, {
                method: 'Remove',
                team_ids: teams.map(x => x.id),
            })
            dispatch('calculateSelectionUsers', selection)
        },
        async calculateSelectionUsers({ commit, dispatch }, selection) {
            console.log('Calculate all selection users')
            console.log(selection)
            // This functions finds all the users who have access to the selection and adds them to the users array on the selection
            await dispatch('fetchSelection', { selectionId: selection.id })

            // const usersToReturn = selection.users || []
            // console.log(usersToReturn)
            // Add the team users if any
            // if (selection.teams) {
            //     // Loop through the teams and add their users

            //     // Make sure we have fetched the users of each team
            //     await Promise.all(
            //         selection.teams.map(async team => {
            //             if (!team.users) {
            //                 await dispatch('teams/fetchTeamUsers', team, { root: true })
            //             }
            //         })
            //     )
            //     selection.teams.forEach(team => {
            //         console.log(team)
            //         // Loop through the users to make sure they are not already added
            //         team.users.forEach(teamUser => {
            //             // Check if the user is already added to the selection
            //             const selectionUser = usersToReturn.find(x => x.id == teamUser.id)
            //             const theUser = selectionUser || JSON.parse(JSON.stringify(teamUser))

            //             // Update the teams inherit_from_team array
            //             if (!theUser.inherit_from_team) Vue.set(theUser, 'inherit_from_team', [team])
            //             else {
            //                 theUser.inherit_from_team.push(team)
            //             }

            //             // Add the user to be returned if not already added
            //             if (!selectionUser) {
            //                 theUser.role = 'Member'
            //                 usersToReturn.push(theUser)
            //             }
            //         })
            //     })
            // }
            // // Loop through the manually added users to see if they should be removed
            // const usersToRemove = []
            // usersToReturn.forEach(user => {
            //     console.log(user)
            //     // Check if the user was added through a team and if this team is still available
            //     if (user.inherit_from_team) {
            //         // Check if the team the user was inherited from, is still on the selection
            //         let removeUser = true
            //         user.inherit_from_team.forEach(team => {
            //             if (selection.teams.find(x => x.id == team.id)) {
            //                 removeUser = false
            //             }
            //         })
            //         if (removeUser) {
            //             usersToRemove.push(removeUser)
            //         }
            //     }
            // })
            // // Loop through the usersToRemove and remove them
            // usersToRemove.forEach(user => {
            //     const userIndex = usersToReturn.findIndex(x => x.id == user.id)
            //     usersToReturn.splice(userIndex, 1)
            // })

            // commit('setSelectionUsers', { selection, users: usersToReturn })
            // return usersToReturn
        },
        async createSelectionTree({ commit }, selections) {
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
                if (node.parent_id != 0) {
                    // if you have dangling branches check that map[node.parentId] exists
                    list[map[node.parent_id]].children.push(node)
                } else {
                    roots.push(node)
                }
            }
            return roots
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
            // Update the current selection if we already have one
            state.currentSelection = selection
        },
        insertSelections(state, { selections, method }) {
            // Check if we have already instantiated selections
            if (method == 'set') {
                state.selections = selections
            } else {
                state.selections.push(...selections)
            }
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
            selection.team_count = selection.teams.length
            // Check if the current selection also exists in our selections array. Then update that as well
            const stateSelection = state.selections.find(x => x.id == selection.id)
            if (stateSelection) stateSelection.team_count = selection.teams.length
        },
        removeTeamsFromSelection(state, { selection, teams }) {
            teams.forEach(team => {
                const teamIndex = selection.teams.findIndex(x => x.id == team.id)
                selection.teams.splice(teamIndex, 1)
            })
            selection.team_count = selection.teams.length
            // Check if the current selection also exists in our selections array. Then update that as well
            const stateSelection = state.selections.find(x => x.id == selection.id)
            if (stateSelection) stateSelection.team_count = selection.teams.length
        },
        setSelectionUsers(state, { selection, users }) {
            Vue.set(selection, 'users', users)
            Vue.set(selection, 'user_count', users.length)
            // Also update the selection if it exists in our state
            const stateSelection = state.selections.find(x => x.id == selection.id)
            if (stateSelection) {
                Vue.set(stateSelection, 'users', users)
                Vue.set(stateSelection, 'user_count', users.length)
            }
        },
    },
}
