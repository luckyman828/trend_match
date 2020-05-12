import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        loading: true,
        status: null,
        currentSelectionStatus: null,
        usersStatus: null,
        teamsStatus: null,
        currentSelection: null,
        currentSelectionUsers: null,
        currentPDPSelection: null,
        selections: [],
        currentSelections: [],
        selectionsAvailableForAlignment: [],
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
        currentSelectionStatus: state => state.currentSelectionStatus,
        selectionUsersStatus: state => state.usersStatus,
        selectionTeamsStatus: state => state.teamsStatus,
        currentSelection: state => state.currentSelections[0],
        getCurrentSelections: state => state.currentSelections,
        getSelections: state => state.selections,
        getCurrentPDPSelection: state => state.currentPDPSelection,
        getSelectionsAvailableForAlignment: state => state.selectionsAvailableForAlignment,
        currentSelectionMode: (state, getters) => {
            const selection = getters.currentSelection
            if (selection) {
                return selection.your_role == 'Member'
                    ? 'Feedback'
                    : selection.your_role == 'Owner'
                    ? 'Alignment'
                    : selection.your_role == 'Approver'
                    ? 'Approval'
                    : 'No Access'
            }
        },
        getSelectionCurrentMode: (state, getters) => selection => {
            return selection.your_role == 'Member'
                ? 'Feedback'
                : selection.your_role == 'Owner'
                ? 'Alignment'
                : selection.your_role == 'Approver'
                ? 'Approval'
                : 'No Access'
        },
        currentSelectionModeAction: (state, getters) =>
            getters.currentSelectionMode == 'Feedback' ? 'your_feedback' : 'action',
        getSelectionModeAction: () => selectionMode => (selectionMode == 'Feedback' ? 'your_feedback' : 'action'),
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
                if (map[node.parent_id] != null) {
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
        getAuthUserHasSelectionEditAccess: (state, getters, rootState, rootGetters) => selection => {
            const authUserWorkspaceRole = rootGetters['workspaces/authUserWorkspaceRole']
            return authUserWorkspaceRole == 'Admin' || selection.your_role == 'Owner'
        },
        getAuthUserSelectionWriteAccess: () => selection => {
            return {
                actions: {
                    hasAccess: selection.is_open && selection.your_role != 'Approver',
                    msg: !selection.is_open
                        ? 'Selection is locked'
                        : selection.your_role == 'Approver'
                        ? 'Only selection owners can decide action'
                        : '',
                },
                requests: {
                    hasAccess: selection.is_open && selection.your_role == 'Owner',
                    msg: !selection.is_open ? 'Selection is locked' : 'Only selection owners can make requests',
                },
                comments: {
                    hasAccess: selection.is_open,
                    msg: !selection.is_open && 'Selection is locked',
                },
            }
        },
    },

    actions: {
        async fetchSelections({ commit }, { fileId, addToState = true }) {
            return new Promise(async (resolve, reject) => {
                commit('setLoading', true)
                commit('SET_STATUS', 'loading')
                const apiUrl = `/files/${fileId}/selections/flat`
                let selections
                await axios
                    .get(apiUrl)
                    .then(response => {
                        selections = response.data
                        // Process the selections
                        commit('PROCESS_SELECTIONS', selections)
                        if (addToState) {
                            commit('insertSelections', { selections, method: 'set' })
                        }
                        commit('SET_STATUS', 'success')
                    })
                    .catch(err => {
                        commit('SET_STATUS', 'error')
                    })
                commit('setLoading', false)
                resolve(selections)
            })
        },
        async filterSelectionsByAvailabilityForAlignment({ commit, getters, state, dispatch }, selections) {
            const selectionsToReturn = []
            await Promise.all(
                selections.map(async selection => {
                    const fetchedSelection = await dispatch('fetchSelection', {
                        selectionId: selection.id,
                        addToState: false,
                    })
                    selectionsToReturn.push(fetchedSelection)
                })
            )
            const selectionsFiltered = selectionsToReturn.filter(selection => {
                return (
                    (getters.getAuthUserHasSelectionEditAccess(selection) || selection.is_visible) &&
                    selection.your_role == 'Owner'
                )
            })
            state.selectionsAvailableForAlignment = selectionsFiltered
            return selectionsFiltered.sort((a, b) => {
                if (a.type == 'Master') return -1
                if (b.parent_id == a.id) return -1
            })
        },
        async fetchSelection({ commit }, { selectionId, addToState = true }) {
            commit('SET_CURRENT_SELECTIONS_STATUS', 'loading')

            const apiUrl = `/selections/${selectionId}`
            let selection
            await axios
                .get(apiUrl)
                .then(response => {
                    selection = response.data
                    commit('PROCESS_SELECTIONS', [selection])
                    if (addToState) {
                        commit('SET_CURRENT_SELECTIONS', [selection])
                    }
                    commit('SET_CURRENT_SELECTIONS_STATUS', 'success')
                })
                .catch(err => {
                    commit('SET_CURRENT_SELECTIONS_STATUS', 'error')
                })
            return selection
        },
        async fetchSelectionSettings({ commit, dispatch }, selection) {
            // Get users for selection
            const apiUrl = `/selections/${selection.id}/metadata`
            let settings
            await axios.get(apiUrl).then(response => {
                settings = response.data
                commit('setSelectionSettings', { selection, settings })
            })
            return settings
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
                commit('PROCESS_SELECTIONS', [selection])
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
            console.log(users)
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
        async reAddUsersToSelection({ commit, dispatch }, { selection, users }) {
            // Commit mutation to state
            await commit('addUsersToSelection', {
                selection,
                users: users.map(user => {
                    user.role = 'Member'
                    return user
                }),
            })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/users`
            await axios.post(apiUrl, {
                method: 'Remove',
                users: users.map(user => {
                    return {
                        id: user.id,
                        role: 'Member',
                    }
                }),
            })
            dispatch('calculateSelectionUsers', selection)
        },
        async updateSelectionSettings({ commit, dispatch }, selection) {
            // Send request to API
            const apiUrl = `/selections/${selection.id}/metadata`
            await axios.put(apiUrl, selection.settings).catch(err => {
                dispatch(
                    'alerts/showAlert',
                    'Something went wrong trying to save selection settings. Please try again.',
                    { root: true }
                )
            })
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
            // Find the users to deny and the users to remove
            // Users added through a team have to be denied. Manually added users can simply be removed
            const usersToDeny = []
            const usersToRemove = []
            users.forEach(user => {
                if (user.inherit_from_teams) {
                    usersToDeny.push(user)
                } else {
                    usersToRemove.push(user)
                }
            })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/users`
            if (usersToRemove.length > 0) {
                await axios.post(apiUrl, {
                    method: 'Remove',
                    users: usersToRemove.map(x => {
                        return {
                            id: x.id,
                        }
                    }),
                })
            }
            if (usersToDeny.length > 0) {
                await axios.post(apiUrl, {
                    method: 'Add',
                    users: usersToDeny.map(x => {
                        return {
                            id: x.id,
                            role: 'Denied',
                        }
                    }),
                })
            }
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
            commit('removeTeamsFromSelection', { selection, teams })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/teams`
            await axios.post(apiUrl, {
                method: 'Remove',
                team_ids: teams.map(x => x.id),
            })
            dispatch('calculateSelectionUsers', selection)
        },
        async calculateSelectionUsers({ commit, dispatch }, selection) {
            // This functions finds all the users who have access to the selection and adds them to the users array on the selection
            const newSelection = await dispatch('fetchSelection', { selectionId: selection.id })
            commit('setSelectionUsers', { selection, users: newSelection.users })
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
        async deleteSelection({ commit, dispatch }, selection) {
            await dispatch('deleteAllSelectionDescendants', selection)
            commit('DELETE_SELECTION', selection)
            // Send request to API
            const apiUrl = `/selections/${selection.id}`
            await axios.delete(apiUrl)
        },
        async deleteAllSelectionDescendants({ commit, dispatch }, selection) {
            selection.children.forEach(child => {
                dispatch('deleteAllSelectionDescendants', child)
                commit('DELETE_SELECTION', child)
            })
        },
    },

    mutations: {
        setLoading(state, bool) {
            state.loading = bool
        },
        SET_STATUS(state, status) {
            state.status = status
        },
        SET_CURRENT_SELECTIONS_STATUS(state, status) {
            state.currentSelectionStatus = status
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
        SET_CURRENT_SELECTIONS(state, selections) {
            state.currentSelections = selections
        },
        SET_CURRENT_PDP_SELECTION(state, selection) {
            state.currentPDPSelection = selection
        },
        insertSelections(state, { selections, method }) {
            // Check if we have already instantiated selections
            if (method == 'set') {
                state.selections = selections
            } else {
                state.selections.push(...selections)
            }
        },
        DELETE_SELECTION(state, selection) {
            const index = state.selections.findIndex(x => x.id == selection.id)
            state.selections.splice(index, 1)
        },
        updateSelection(state, selection) {
            const stateSelection = state.selections.find(x => x.id == selection.id)
            if (stateSelection) {
                Object.assign(stateSelection, selection)
            }
        },
        setSelectionSettings(state, { selection, settings }) {
            Vue.set(selection, 'settings', settings)
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
        PROCESS_SELECTIONS(state, selections) {
            selections.map(selection => {
                // Visible
                Object.defineProperty(selection, 'is_visible', {
                    get: () => {
                        // Return true if we are after visible_from, or it isn't set
                        // And before visible_to or it isn't set¨
                        const now = new Date()
                        const from = selection.visible_from && new Date(selection.visible_from)
                        const to = selection.visible_to && new Date(selection.visible_to)
                        return (!from || now > from) && (!to || now < to) // True if no from is set
                    },
                })
                // Locked
                Object.defineProperty(selection, 'is_open', {
                    get: () => {
                        const now = new Date()
                        const from = selection.open_from && new Date(selection.open_from)
                        const to = selection.open_to && new Date(selection.open_to)
                        return (!from || now > from) && (!to || now < to) // True if no from is set
                    },
                })
                // Completed
                Object.defineProperty(selection, 'is_completed', {
                    get: () => {
                        // Return true if we are after visible_from, or it isn't set
                        // And before visible_to or it isn't set¨
                        const now = new Date()
                        const from = selection.completed_at
                        return !!from && now > from
                    },
                })
            })
        },
    },
}
