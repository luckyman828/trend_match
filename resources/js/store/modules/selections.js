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
        usersFlyInVisible: false,
        currentSelections: [],
        selectionsAvailableForAlignment: [],
        availableSelectionRoles: [
            {
                role: 'Member',
                description: "No rights, other than the ones provided by the user's job",
            },
            {
                role: 'Owner',
                description:
                    'Full edit rights over the selection. Can add/remove teams and users from the selection, change selection settings, and create/delete sub-selections.',
            },
        ],
        availableSelectionJobs: [
            {
                role: 'Feedback',
                description: 'Gives feedback and makes comments',
            },
            {
                role: 'Alignment',
                description: 'Aligns the selection',
            },
            {
                role: 'Approval',
                description: 'Replies to requests',
            },
        ],
    },

    getters: {
        loadingSelections: state => state.loading,
        selectionsStatus: state => state.status,
        getSelectionsStatus: state => state.status,
        currentSelectionStatus: state => state.currentSelectionStatus,
        getCurrentSelectionStatus: state => state.currentSelectionStatus,
        getSelectionUsersStatus: state => state.usersStatus,
        getSelectionTeamsStatus: state => state.teamsStatus,
        currentSelection: state => state.currentSelections[0],
        getCurrentSelection: state => state.currentSelections[0],
        getCurrentSelections: state => state.currentSelections,
        getCurrentSelection: state => state.currentSelections[0],
        getMultiSelectionModeIsActive: state => state.currentSelections.length > 1,
        getSelections: state => state.selections,
        getCurrentPDPSelection: state => state.currentPDPSelection,
        getSelectionsAvailableForAlignment: state => state.selectionsAvailableForAlignment,
        getSelectionUsersFlyinIsVisible: state => state.usersFlyInVisible,
        getQuantityModeActive: (state, getters) => {
            return (
                getters.currentSelection &&
                getters.currentSelection.budget > 0 &&
                getters.currentSelectionMode == 'Alignment'
            )
        },
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
        getSelectionById: state => id => state.selections.find(x => x.id == id),
        getCurrentSelectionById: state => id => state.currentSelections.find(x => x.id == id),
        selections: state => state.selections,
        getSelectionsTree: state => {
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
        getSelectionTree: state => selection => {
            const list = state.selections
            let map = {},
                node,
                i,
                nodeToReturn
            for (i = 0; i < list.length; i += 1) {
                map[list[i].id] = i // initialize the map
                Vue.set(list[i], 'children', []) // initialize the children
            }
            for (i = 0; i < list.length; i += 1) {
                node = list[i]
                if (node.id == selection.id) nodeToReturn = node
                if (map[node.parent_id] != null) {
                    // if you have dangling branches check that map[node.parentId] exists
                    list[map[node.parent_id]].children.push(node)
                }
            }
            return nodeToReturn
        },
        availableSelectionRoles: state => {
            return state.availableSelectionRoles
        },
        getAvailableSelectionJobs: state => {
            return state.availableSelectionJobs
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
            console.log('fetch selection')
            commit('SET_CURRENT_SELECTIONS_STATUS', 'loading')
            commit('SET_SELECTION_USERS_STATUS', 'loading')
            commit('SET_SELECTION_TEAMS_STATUS', 'loading')

            const apiUrl = `/selections/${selectionId}`
            let selection
            await axios
                .get(apiUrl)
                .then(response => {
                    selection = response.data
                    commit('PROCESS_SELECTIONS', [selection])
                    commit('UPDATE_SELECTION', selection)
                    if (addToState) {
                        commit('SET_CURRENT_SELECTIONS', [selection])
                    }
                    commit('SET_CURRENT_SELECTIONS_STATUS', 'success')
                    commit('SET_SELECTION_USERS_STATUS', 'success')
                    commit('SET_SELECTION_TEAMS_STATUS', 'success')
                })
                .catch(err => {
                    commit('SET_CURRENT_SELECTIONS_STATUS', 'error')
                    commit('SET_SELECTION_USERS_STATUS', 'error')
                    commit('SET_SELECTION_TEAMS_STATUS', 'error')
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
        async insertSelection({ commit, dispatch }, { file, selection, addToState = true }) {
            // Check if we are inserting a master or a child
            let apiUrl = ''

            if (selection.parent_id == '0' || !selection.parent_id) {
                apiUrl = `/files/${file.id}/selections`
            } else {
                apiUrl = `/selections/${selection.parent_id}/children`
            }
            await axios
                .post(apiUrl, selection)
                .then(async response => {
                    selection.id = response.data.id
                    commit('PROCESS_SELECTIONS', [selection])
                    if (addToState) {
                        commit('insertSelections', { file, selections: [selection] })
                    }
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Selection created',
                            iconClass: 'fa-check',
                            type: 'success',
                            callback: () => showNewSelectionUsersFlyin(),
                            callbackLabel: 'Manage users',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Something went wrong trying to creat the selection. Please try again.',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('insertSelection', { file, selection, addToState }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })

            const showNewSelectionUsersFlyin = () => {
                commit('SET_CURRENT_SELECTIONS', [selection])
                commit('SET_SELECTION_USERS_FLYIN_VISIBLE', true)
            }
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
                commit('UPDATE_SELECTION', selection)
                requestMethod = 'put'
                apiUrl = `/selections/${selection.id}`
            }

            const wasCreated = !selection.id

            await axios({
                method: requestMethod,
                url: apiUrl,
                data: requestBody,
            })
                .then(async response => {
                    // Set the selections ID if not already set
                    if (!selection.id) selection.id = response.data.id

                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `Selection ${wasCreated ? 'created' : 'updated'}`,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `Something went wrong trying to ${
                                wasCreated ? 'create' : 'update'
                            } the selection. Please try again.`,
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('updateSelection', selection),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
        async updateSelectionBudget({ commit, dispatch }, selection) {
            commit('UPDATE_SELECTION', selection)
            const apiUrl = `/selections/${selection.id}/extra-properties`
            if (!selection.budget) selection.budget = 0

            await axios
                .put(apiUrl, {
                    budget: selection.budget,
                })
                .then(async response => {
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `Selection updated`,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `Something went wrong trying to update the selection. Please try again.`,
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('updateSelectionBudget', selection),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
        async addUsersToSelection({ commit, dispatch }, { selection, users, ignoreRole = true }) {
            // Commit mutation to state
            await commit('ADD_USERS_TO_SELECTION', {
                selection,
                users: users.map(user => {
                    if (ignoreRole) user.role = 'Member'
                    return user
                }),
            })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/users`
            await axios
                .post(apiUrl, {
                    method: 'Add',
                    users: users.map(user => {
                        return {
                            id: user.id,
                            role: ignoreRole ? 'Member' : user.role,
                            job: ignoreRole ? 'Feedback' : user.job,
                        }
                    }),
                })
                .then(() => {
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${users.length} user${users.length > 1 ? 's' : ''} added`,
                            iconClass: 'fa-check',
                            type: 'success',
                            callback: () =>
                                dispatch('removeUsersFromSelection', {
                                    selection,
                                    users,
                                }),
                            callbackLabel: 'Undo',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    // Remove users again
                    commit('REMOVE_USERS_FROM_SELECTION', { selection, users })
                    dispatch('calculateSelectionUsers', selection)

                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Something went wrong trying to update selection user(s). Please try again.',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('updateSelectionUsers', { selection, users }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
            dispatch('calculateSelectionUsers', selection)
        },
        // async reAddUsersToSelection({ commit, dispatch }, { selection, users }) {
        //     // Commit mutation to state
        //     await commit('addUsersToSelection', {
        //         selection,
        //         users: users.map(user => {
        //             user.role = 'Member'
        //             return user
        //         }),
        //     })
        //     // Send request to API
        //     const apiUrl = `/selections/${selection.id}/users`
        //     await axios.post(apiUrl, {
        //         method: 'Remove',
        //         users: users.map(user => {
        //             return {
        //                 id: user.id,
        //                 role: 'Member',
        //             }
        //         }),
        //     })
        //     dispatch('calculateSelectionUsers', selection)
        // },
        async updateSelectionSettings({ commit, dispatch }, selection) {
            // Send request to API
            const apiUrl = `/selections/${selection.id}/metadata`
            await axios
                .put(apiUrl, selection.settings)
                .then(() => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Settings updated',
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Something went wrong trying to save selection settings. Please try again.',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('updateSelectionSettings', selection),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
        async updateSelectionUsers({ commit, dispatch }, { selection, users }) {
            // Commit mutation to state
            await commit('updateSelectionUsers', { selection, users })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/users`
            await axios
                .post(apiUrl, {
                    method: 'Add',
                    users: users.map(x => {
                        return {
                            id: x.id,
                            role: x.role,
                        }
                    }),
                })
                .then(() => {
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${users.length} selection user${users.length > 1 ? 's' : ''} updated`,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Something went wrong trying to update selection user(s). Please try again.',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('updateSelectionUsers', { selection, users }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
            // dispatch('calculateSelectionUsers', selection)
        },
        async removeUsersFromSelection({ commit, dispatch }, { selection, users }) {
            // Commit mutation to state
            await commit('REMOVE_USERS_FROM_SELECTION', { selection, users })
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

            // Remove users
            const apiUrl = `/selections/${selection.id}/users`
            if (usersToRemove.length > 0) {
                await axios
                    .post(apiUrl, {
                        method: 'Remove',
                        users: usersToRemove.map(x => {
                            return {
                                id: x.id,
                            }
                        }),
                    })
                    .then(() => {
                        // Display message
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: `${usersToRemove.length} user${usersToRemove.length > 1 ? 's' : ''} removed`,
                                iconClass: 'fa-trash',
                                type: 'danger',
                                callback: () =>
                                    dispatch('addUsersToSelection', {
                                        selection,
                                        users: usersToRemove,
                                        ignoreRole: false,
                                    }),
                                callbackLabel: 'Undo',
                            },
                            { root: true }
                        )
                    })
                    .catch(err => {
                        // Re-add the users
                        commit('ADD_USERS_TO_SELECTION', { selection, users: usersToRemove })
                        dispatch('calculateSelectionUsers', selection)
                        // Display message
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg:
                                    'Something went wrong trying to remove user(s) from the selection. Please try again.',
                                iconClass: 'fa-exclamation-triangle',
                                type: 'warning',
                                callback: () =>
                                    dispatch('removeUsersFromSelection', { selection, users: usersToRemove }),
                                callbackLabel: 'Retry',
                                duration: 0,
                            },
                            { root: true }
                        )
                    })
            }

            // Deny users
            if (usersToDeny.length > 0) {
                await axios
                    .post(apiUrl, {
                        method: 'Add',
                        users: usersToDeny.map(x => {
                            return {
                                id: x.id,
                                role: 'Denied',
                            }
                        }),
                    })
                    .then(() => {
                        // Display message
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: `${usersToDeny.length} team user${usersToDeny.length > 1 ? 's' : ''} excluded`,
                                iconClass: 'fa-ban',
                                type: 'danger',
                                callback: () =>
                                    dispatch('addUsersToSelection', {
                                        selection,
                                        users: usersToDeny,
                                        ignoreRole: false,
                                    }),
                                callbackLabel: 'Undo',
                            },
                            { root: true }
                        )
                    })
                    .catch(err => {
                        // Re-add the users
                        commit('ADD_USERS_TO_SELECTION', { selection, users: usersToDeny })
                        dispatch('calculateSelectionUsers', selection)
                        // Display message
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg:
                                    'Something went wrong trying to exclude team user(s) from the selection. Please try again.',
                                iconClass: 'fa-exclamation-triangle',
                                type: 'warning',
                                callback: () => dispatch('removeUsersFromSelection', { selection, users: usersToDeny }),
                                callbackLabel: 'Retry',
                                duration: 0,
                            },
                            { root: true }
                        )
                    })
            }

            dispatch('calculateSelectionUsers', selection)
        },
        async addTeamsToSelection({ commit, dispatch }, { selection, teams }) {
            // Commit mutation to state
            await commit('ADD_TEAMS_TO_SELECTION', { selection, teams })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/teams`
            await axios
                .post(apiUrl, {
                    method: 'Add',
                    team_ids: teams.map(x => x.id),
                })
                .then(() => {
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${teams.length} team ${teams.length > 1 ? 's' : ''} added`,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    // Commit mutation to state
                    commit('REMOVE_TEAMS_FROM_SELECTION', { selection, teams })
                    dispatch('calculateSelectionUsers', selection)
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Something went wrong trying to add team(s) to the selection. Please try again.',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('addTeamsToSelection', { selection, teams }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
            dispatch('calculateSelectionUsers', selection)
        },
        async removeTeamsFromSelection({ commit, dispatch }, { selection, teams }) {
            // Commit mutation to state
            commit('REMOVE_TEAMS_FROM_SELECTION', { selection, teams })
            // Send request to API
            const apiUrl = `/selections/${selection.id}/teams`
            await axios
                .post(apiUrl, {
                    method: 'Remove',
                    team_ids: teams.map(x => x.id),
                })
                .then(() => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${teams.length} team ${teams.length > 1 ? 's' : ''} removed`,
                            iconClass: 'fa-trash',
                            type: 'danger',
                            callback: () => dispatch('addTeamsToSelection', { selection, teams }),
                            callbackLabel: 'Undo',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    // Re-add the team
                    reAddTeamsToSelection()
                    // Display message
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Something went wrong trying to remove team(s) from the selection. Please try again.',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('removeTeamsFromSelection', { selection, teams }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
            dispatch('calculateSelectionUsers', selection)

            const reAddTeamsToSelection = () => {
                commit('ADD_TEAMS_TO_SELECTION', { selection, teams })
                dispatch('calculateSelectionUsers', selection)
            }
        },
        async calculateSelectionUsers({ commit, dispatch }, selection) {
            console.log('calculate selection users')
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
            await axios
                .delete(apiUrl)
                .then(() => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Selection deleted',
                            iconClass: 'fa-trash',
                            type: 'danger',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Something went wrong trying to delete the selection. Please try again.',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('deleteSelection', selection),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
        async deleteAllSelectionDescendants({ commit, dispatch }, selection) {
            selection.children.forEach(child => {
                dispatch('deleteAllSelectionDescendants', child)
                commit('DELETE_SELECTION', child)
            })
        },
        // async unlockAllSelectionDescendants({ commit, dispatch }, selection) {
        //     selection.open_from = null
        //     selection.open_to = null
        //     dispatch('updateSelection', selection)

        //     selection.children.forEach(childSelection => {
        //         dispatch('unlockAllSelectionDescendants', childSelection)
        //     })
        // },
        // async unhidellSelectionDescendants({ commit, dispatch }, selection) {
        //     selection.visible_from = null
        //     selection.visible_to = null
        //     dispatch('updateSelection', selection)

        //     selection.children.forEach(childSelection => {
        //         dispatch('unlockAllSelectionDescendants', childSelection)
        //     })
        // },
        async openAllSelectionDescendants({ commit, dispatch }, selection) {
            const hasChanged = !selection.is_visible || !selection.is_open
            if (!selection.is_visible) {
                selection.visible_from = null
                selection.visible_to = null
            }
            if (!selection.is_open) {
                selection.open_from = null
                selection.open_to = null
            }
            if (hasChanged) {
                dispatch('updateSelection', selection)
            }

            selection.children.forEach(childSelection => {
                dispatch('openAllSelectionDescendants', childSelection)
            })
        },
        async togglePresenterMode({ getters, dispatch, commit }, selection) {
            const apiUrl = `/selections/${selection.id}/presentation`
            // Assunme success
            let success = true
            if (!selection.is_presenting) {
                await axios
                    .post(apiUrl)
                    .then(() => {
                        // On successful presentation start, unlock / unhide the selection and all of its children
                        if (!selection.is_visible) {
                            selection.visible_from = null
                            selection.visible_to = null
                        }
                        if (!selection.is_open) {
                            selection.open_from = null
                            selection.open_to = null
                        }
                        dispatch('updateSelection', selection)
                        const selectionTree = getters.getSelectionTree(selection)
                        dispatch('openAllSelectionDescendants', selectionTree)
                    })
                    .catch(err => {
                        console.log(err)
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: 'Something went wrong trying to enter presentation mode. Please try again.',
                                type: 'warning',
                                iconClass: 'fa-exclamation-triangle',
                            },
                            { root: true }
                        )
                        success = false
                    })
            } else {
                await axios.delete(apiUrl).catch(err => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Something went wrong trying to stop presentation mode. Please try again.',
                            type: 'warning',
                            iconClass: 'fa-exclamation-triangle',
                        },
                        { root: true }
                    )
                    success = false
                })
            }
            if (!success) return

            // commit('SET_SELECTION_PRESENTATION_MODE_ACTIVE', { selection, isActive: !selection.is_presenting })

            // Clear the current presentation queue if we just exited presentation mode
            if (!selection.is_presenting) {
                commit('presenterQueue/SET_PRESENTER_QUEUE', [], { root: true })
            }
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
        SET_SELECTION_TEAMS_STATUS(state, status) {
            state.teamsStatus = status
        },
        SET_SELECTION_USERS_STATUS(state, status) {
            state.usersStatus = status
        },
        setCurrentSelection(state, selection) {
            state.currentSelection = selection
        },
        SET_CURRENT_SELECTIONS(state, selections) {
            // selections.map(selection => {
            //     Vue.set(selection, 'budget', parseInt(Math.random().toFixed(4) * 10000000))
            // })
            state.currentSelections = selections
        },
        SET_CURRENT_PDP_SELECTION(state, selection) {
            state.currentPDPSelection = selection
        },
        SET_SELECTION_USERS_FLYIN_VISIBLE(state, bool) {
            state.usersFlyInVisible = bool
        },
        insertSelections(state, { selections, method }) {
            // selections.map(selection => {
            //     Vue.set(selection, 'budget', parseInt(Math.random().toFixed(4) * 10000000))
            // })
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
        UPDATE_SELECTION(state, selection) {
            const stateSelection = state.selections.find(x => x.id == selection.id)
            if (stateSelection) {
                // Make users, teams and denied_users reactive
                if (selection.users) Vue.set(stateSelection, 'users', selection.users)
                if (selection.denied_users) Vue.set(stateSelection, 'denied_users', selection.denied_users)
                if (selection.teams) Vue.set(stateSelection, 'teams', selection.teams)
                Object.assign(stateSelection, selection)
            }
        },
        setSelectionSettings(state, { selection, settings }) {
            Vue.set(selection, 'settings', settings)
        },
        ADD_USERS_TO_SELECTION(state, { selection, users }) {
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
        REMOVE_USERS_FROM_SELECTION(state, { selection, users }) {
            // Loop through the users and remove them
            users.forEach(user => {
                const userIndex = selection.users.findIndex(x => x.id == user.id)
                selection.users.splice(userIndex, 1)
            })
        },
        ADD_TEAMS_TO_SELECTION(state, { selection, teams }) {
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
        REMOVE_TEAMS_FROM_SELECTION(state, { selection, teams }) {
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

                // Start process users
                // if (selection.users) {
                //     selection.users.map(user => {
                //         Object.defineProperty(user, 'job', {
                //             get: () => {
                //                 return user.roles.filter(x => !['Owner', 'Member'].includes(x))[0]
                //             },
                //             set: function(value) {
                //                 console.log('set user job', value)
                //                 // Find the existing value
                //                 const currentJobIndex = user.roles.findIndex(job => !['Owner', 'Member'].includes(job))
                //                 if (currentJobIndex >= 0) {
                //                     user.roles.splice(currentJobIndex, 1, value)
                //                 } else {
                //                     user.roles.push(value)
                //                 }
                //                 console.log(user.roles)
                //             },
                //         })
                //     })
                // }

                // End process users
            })
        },
        SET_SELECTION_PRESENTATION_MODE_ACTIVE(state, { selection, isActive }) {
            // Vue.set(selection, 'is_presenting', isActive)
            selection.is_presenting = isActive
        },
    },
}
