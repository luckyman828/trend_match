import axios from 'axios'
import router from '../../router'

export default {
    namespaced: true,

    state: {
        loading: true,
        status: null,
        currentSelectionStatus: null,
        usersStatus: null,
        teamsStatus: null,
        currentSelection: null,
        currentSelectionId: null,
        currentSelectionUsers: null,
        currentPDPSelection: null,
        selections: [],
        usersFlyInVisible: false,
        currentSelections: [],
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
            {
                role: 'Approver',
                description: 'Replies to requests',
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
        currentSelectionRealRole: null,
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
        getCurrentSelectionId: state => state.currentSelectionId,
        getCurrentSelection: state => state.currentSelections[0],
        getCurrentSelections: state => state.currentSelections,
        getDisplayUnreadBullets: (state, getters) => {
            return getters.getTicketModeActive && getters.getCurrentSelectionMode != 'Feedback'
        },
        getSelectionChapter: (state, getters, rootState, rootGetters) => selection => {
            if (selection.type == 'Chapter') return selection
            if (selection.parent_chapter) {
                return selection.parent_chapter
            }
            if (!selection.chapterId) return
            const allSelections = rootGetters['selectionProducts/getSelections'].concat(getters.getSelections)
            return allSelections.find(x => x.id == selection.chapterId)
        },
        getCurrentSelection: state => state.currentSelections[0],
        getMultiSelectionModeIsActive: state => state.currentSelections.length > 1,
        getSelections: state => state.selections,
        getCurrentPDPSelection: state => state.currentPDPSelection,
        getSelectionsAvailableForAlignment: state =>
            state.selections
                .filter(x => x.your_job == 'Alignment')
                .sort((a, b) => {
                    return a.product_set_identifier > b.product_set_identifier ? 1 : -1
                }),
        getSelectionsAvailableForPresentation: state =>
            state.selections
                .filter(x => x.your_role == 'Owner')
                .sort((a, b) => {
                    return a.product_set_identifier > b.product_set_identifier ? 1 : -1
                }),
        getSelectionUsersFlyinIsVisible: state => state.usersFlyInVisible,
        getQuantityModeActive: (state, getters) => {
            return (
                getters.currentSelection &&
                getters.currentSelection.budget > 0 &&
                getters.currentSelectionMode != 'Approval'
            )
        },
        getTicketModeActive: (state, getters) => {
            return getters.currentSelection.settings && getters.currentSelection.settings.ticket_level != 'None'
        },
        getCurrentTicketMode: (state, getters) =>
            getters.currentSelection.settings && getters.currentSelection.settings.ticket_level,
        currentSelectionMode: (state, getters) => {
            const selection = getters.currentSelection
            if (selection) return getters.getSelectionCurrentMode(selection)
        },
        getCurrentSelectionMode: (state, getters) => getters.currentSelectionMode,
        getSelectionCurrentMode: (state, getters) => selection => {
            return selection.your_job
            return selection.your_roles.includes('Member')
                ? 'Feedback'
                : selection.your_roles.includes('Approver')
                ? 'Approval'
                : selection.your_roles.includes('Owner')
                ? 'Alignment'
                : 'No Access'
        },
        currentSelectionModeAction: (state, getters) =>
            getters.currentSelectionMode == 'Feedback' ? 'your_feedback' : 'action',
        getCurrentSelectionModeAction: (state, getters) => getters.currentSelectionModeAction,
        getCurrentActionKey: (state, getters) => getters.currentSelectionModeAction,
        getCurrentSelectionModeQty: (state, getters) =>
            getters.currentSelectionMode == 'Feedback' ? 'your_quantity' : 'quantity',
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
        getAuthUserSelectionWriteAccess: (state, getters) => (selection, product) => {
            let actionAccess = true
            let commentAccess = true
            let requestAccess = true
            let actionMsg = ''
            let commentMsg = ''
            let requestMsg = ''

            if (getters.getViewingAsObserver) {
                actionAccess = false
                commentAccess = false
                requestAccess = false
                actionMsg = 'Viewing as observer'
                commentMsg = 'Viewing as observer'
                requestMsg = 'Viewing as observer'
            } else if (!selection.is_open) {
                actionAccess = false
                commentAccess = false
                requestAccess = false
                actionMsg = 'Selection is locked'
                commentMsg = 'Selection is locked'
                requestMsg = 'Selection is locked'
            } else if (product && product.is_completed) {
                actionAccess = false
                requestAccess = false
                actionMsg = 'Product has been marked as complete'
                requestMsg = 'Product has been marked as complete'
            } else {
                if (selection.your_role != 'Owner') {
                    requestAccess = false
                    requestMsg = 'Only selection owners can make requests'
                }
                if (selection.your_role == 'Approver') {
                    actionAccess = false
                    actionMsg = 'Only selection owners can decide action'
                }
            }
            return {
                actions: {
                    hasAccess: actionAccess,
                    msg: actionMsg,
                },
                comments: {
                    hasAccess: commentAccess,
                    msg: commentMsg,
                },
                requests: {
                    hasAccess: requestAccess,
                    msg: requestMsg,
                },
            }

            // return {
            //     actions: {
            //         hasAccess: selection.is_open && selection.your_role != 'Approver',
            //         msg: !selection.is_open
            //             ? 'Selection is locked'
            //             : selection.your_role == 'Approver'
            //             ? 'Only selection owners can decide action'
            //             : '',
            //     },
            //     requests: {
            //         hasAccess: selection.is_open && selection.your_role == 'Owner',
            //         msg: !selection.is_open ? 'Selection is locked' : 'Only selection owners can make requests',
            //     },
            //     comments: {
            //         hasAccess: selection.is_open,
            //         msg: !selection.is_open && 'Selection is locked',
            //     },
            // }
        },
        getSelectionsAvailableForInputFiltering: (state, getters, rootState, rootGetters) => {
            return rootGetters['selectionProducts/getSelections']
            // const products = rootGetters['products/getProducts']
            // const activeSelections = getters.getCurrentSelections
            // const availableSelections = []
            // products.forEach(product => {
            //     // Find the selection input available
            //     const selectionInputListFiltered = product.selectionInputList.filter(
            //         selectionInput => !!activeSelections.find(selection => selection.id == selectionInput.selection_id)
            //     )

            //     selectionInputListFiltered.forEach(selectionInput => {
            //         // Loop through the products feedback
            //         selectionInput.rawSelectionInput.feedbacks.forEach(feedback => {
            //             const existsInArray = availableSelections.find(
            //                 selection => selection.id == feedback.selection_id
            //             )
            //             if (!existsInArray) availableSelections.push(feedback.selection)
            //         })
            //         // Loop through the products alignment
            //         selectionInput.rawSelectionInput.alignments.forEach(action => {
            //             const existsInArray = availableSelections.find(selection => selection.id == action.selection_id)
            //             if (!existsInArray) availableSelections.push(action.selection)
            //         })
            //         // Loop through the products comments
            //         selectionInput.rawSelectionInput.comments.forEach(comment => {
            //             const existsInArray = availableSelections.find(
            //                 selection => selection.id == comment.selection_id
            //             )
            //             if (!existsInArray) availableSelections.push(comment.selection)
            //         })
            //         // Loop through the products requests
            //         selectionInput.rawSelectionInput.requests.forEach(request => {
            //             const existsInArray = availableSelections.find(
            //                 selection => selection.id == request.selection_id
            //             )
            //             if (!existsInArray) availableSelections.push(request.selection)
            //         })
            //     })
            // })
            // return availableSelections
        },
        getSelectionPresentationGroups: state => {
            const groupIds = []
            state.selections.map(selection => {
                if (!groupIds.find(x => x == selection.presentation_id)) {
                    groupIds.push(selection.presentation_id)
                }
            })
            return groupIds
        },
        getCurrentSelectionRealRole: state => state.currentSelectionRealRole,
        getViewingAsObserver: (state, getters) =>
            !getters.currentSelection ||
            !getters.currentSelection.your_role ||
            (getters.getCurrentSelectionRealRole &&
                getters.currentSelection.your_role != getters.getCurrentSelectionRealRole),
    },

    actions: {
        async fetchSelections({ commit, dispatch }, { fileId, addToState = true }) {
            return new Promise(async (resolve, reject) => {
                commit('SET_LOADING', true)
                commit('SET_STATUS', 'loading')
                const apiUrl = `/files/${fileId}/selections/flat`
                let selections
                await axios
                    .get(apiUrl)
                    .then(async response => {
                        selections = response.data
                        // Process the selections
                        await dispatch('initSelections', selections)
                        if (addToState) {
                            commit('insertSelections', { selections, method: 'set' })
                        }
                        commit('SET_STATUS', 'success')
                    })
                    .catch(err => {
                        commit('SET_STATUS', 'error')
                    })
                commit('SET_LOADING', false)
                resolve(selections)
            })
        },
        async fetchSelection({ commit, dispatch }, { selectionId, addToState = true }) {
            commit('SET_CURRENT_SELECTIONS_STATUS', 'loading')
            commit('SET_SELECTION_USERS_STATUS', 'loading')
            commit('SET_SELECTION_TEAMS_STATUS', 'loading')

            const apiUrl = `/selections/${selectionId}`
            let selection
            await axios
                .get(apiUrl)
                .then(response => {
                    selection = response.data
                    dispatch('initSelections', [selection])
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
                    Object.assign(selection, response.data)
                    dispatch('initSelections', [selection])
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
                            msg: 'Something went wrong trying to create the selection. Please try again.',
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
                            // job: ignoreRole ? 'Feedback' : user.job,
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
        async updateSelectionSettings({ commit, dispatch }, { selections }) {
            // Send request to API
            const apiUrl = `/selections/update-metadata`
            await axios
                .post(apiUrl, {
                    update_requests: selections.map(selection => {
                        return {
                            selection_id: selection.id,
                            metadata: selection.settings,
                        }
                    }),
                })
                .then(() => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `Settings updated for ${
                                selections.length > 1 ? `${selections.length} selections` : 'selection'
                            }`,
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
            await dispatch('calculateSelectionUsers', selection)
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
                            msg: `${teams.length} team${teams.length > 1 ? 's' : ''} removed`,
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
                if (node.parent_id != 0 && map[node.parent_id] != null) {
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
        // Function that loops through all the children in the provided selection tree and sets their properties based on the provided properties array
        async UPDATE_SELECTION_DESCENDANTS({ commit, dispatch }, { selectionTree, properties }) {
            selectionTree.children.forEach(child => {
                dispatch('UPDATE_SELECTION_DESCENDANTS', { selectionTree: child, properties })
                properties.forEach(property => {
                    Vue.set(child, property.name, property.value)
                })
            })
        },
        async startPresentation({ commit }, { selections }) {
            // console.log('start presentation', selections)
            const apiUrl = `/presentation`
            let presentation
            await axios
                .post(apiUrl, {
                    selection_ids: selections.map(selection => selection.id),
                })
                .then(response => {
                    presentation = response.data
                    commit('presentation/SET_CURRENT_PRESENTATION_ID', response.data.presentation_id, { root: true })
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `Presentation started for ${selections.length} selection${
                                selections.length > 1 ? 's' : ''
                            }`,
                            iconClass: 'fa-presentation',
                            type: 'info',
                        },
                        { root: true }
                    )
                    commit('presentation/INSERT_PRESENTATION', presentation, { root: true })
                })
            return presentation
        },
        async stopPresentation({ commit }, { presentationId }) {
            // console.log('stop presentation', presentationId)
            const apiUrl = `/presentation/${presentationId}`
            await axios.delete(apiUrl).then(response => {
                commit('presentation/SET_CURRENT_PRESENTATION_ID', null, { root: true })
            })
        },
        async togglePresenterMode({ getters, dispatch, commit }, selection) {
            const apiUrl = `/selections/${selection.id}/presentation`
            const selectionTree = getters.getSelectionTree(selection)
            // Assunme success
            let success = true
            if (!selection.is_presenting) {
                // START PRESENTATION
                await axios
                    .post(apiUrl, {
                        sub_selection_ids: subSelectionList,
                    })
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
                        dispatch('openAllSelectionDescendants', selectionTree)
                        dispatch('UPDATE_SELECTION_DESCENDANTS', {
                            selectionTree: selectionTree,
                            properties: [{ name: 'presentation_inherit_from', value: selection.id }],
                        })
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
                // END PRESENTATION
                await axios
                    .delete(apiUrl)
                    .then(() => {
                        dispatch('UPDATE_SELECTION_DESCENDANTS', {
                            selectionTree: selectionTree,
                            properties: [{ name: 'presentation_inherit_from', value: 0 }],
                        })
                    })
                    .catch(err => {
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
                commit('presentationQueue/SET_PRESENTER_QUEUE', [], { root: true })
            }
        },
        async sendSelectionLink({ commit, dispatch }, { selectionList }) {
            // Do something
            await Promise.all(
                selectionList.map(async selection => {
                    const apiUrl = `/selections/${selection.id}/invite-members`
                    await axios.post(apiUrl, {
                        user_ids: [],
                    })
                })
            )
                .then(response => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `Invite link sent for ${selectionList.length} selections!`,
                            type: 'info',
                            iconClass: 'fa-paper-plane',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Something went wrong trying to send an invite link. Please try again.',
                            type: 'warning',
                            iconClass: 'fa-exclamation-triangle',
                        },
                        { root: true }
                    )
                })
        },
        async sendLinkToSelectionUsers({ commit, dispatch }, { selection, users }) {
            // Do something
            // console.log('Send selection link to selection users!', selection, users)
            users.map(user => {
                Vue.set(user, 'selectionLinkSent', true)
            })
            const apiUrl = `/selections/${selection.id}/invite-members`
            await axios
                .post(apiUrl, {
                    user_ids: users.map(user => user.id),
                })
                .then(response => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Invite link sent!',
                            type: 'info',
                            iconClass: 'fa-paper-plane',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Something went wrong trying to send an invite link. Please try again.',
                            type: 'warning',
                            iconClass: 'fa-exclamation-triangle',
                        },
                        { root: true }
                    )
                })
        },
        async joinSelectionViaLink({ commit }, { captchaToken, selectionId, email }) {
            const apiUrl = '/join-selection-via-link'
            const axiosInstance = axios.create({
                baseURL: 'api',
            })

            let joinResponse = false
            await axiosInstance.post(apiUrl, { captchaToken, selectionId, email }).then(response => {
                joinResponse = response.data
            })

            return joinResponse
        },
        async getSelectionLink({}, { selectionId, openDashboard }) {
            const apiUrl = `selections/${selectionId}/shorten-code${openDashboard ? '?open_app=false' : ''}`
            // let linkCode
            let link
            await axios.get(apiUrl).then(response => {
                // linkCode = response.data.message
                link = response.data.magic_link
            })

            // const linkBase = `${location.origin}/#/join/`
            // return linkBase + linkCode
            return link
        },
        async fetchPublicSelectionInfo({}, linkHash) {
            const apiUrl = `selections/public-info?code=${linkHash}`
            let selectionInfo
            await axios.get(apiUrl).then(response => {
                selectionInfo = response.data
            })
            return selectionInfo
        },
        async joinSelection({}, selectionId) {
            const apiUrl = `selections/join/${selectionId}`
            let joinResponse
            await axios.post(apiUrl).then(response => {
                joinResponse = response.data
            })
            return joinResponse
        },
        async initSelections({ getters, rootGetters }, selections) {
            selections.map(selection => {
                const chapterSetIndex = selection.product_set_identifier.lastIndexOf(':')
                const chatperId =
                    chapterSetIndex >= 0 ? selection.product_set_identifier.slice(chapterSetIndex + 1) : null
                Vue.set(selection, 'chapterId', chatperId)

                if (!selection.your_roles) {
                    Vue.set(selection, 'your_roles', [])
                }
                if (!selection.your_role) {
                    Vue.set(selection, 'your_role', selection.your_roles[0])
                }

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

                // Visible
                Object.defineProperty(selection, 'presentation', {
                    get: () => {
                        if (!selection.presentation_id) return
                        const presentations = rootGetters['presentation/getPresentations']
                        return presentations.find(x => x.id == selection.presentation_id)
                    },
                })

                Object.defineProperty(selection, 'chapter', {
                    get: () => {
                        return getters.getSelectionChapter(selection)
                    },
                })
                // Object.defineProperty(selection, 'chapterName', {
                //     get: () => {
                //         return selection.chapter ? selection.chapter.name : ''
                //     },
                // })
            })
        },
        async fetchChapterRules({ commit, dispatch }, { selection }) {
            const apiUrl = `selections/${selection.id}/chapter`
            let chapterRules
            await axios
                .get(apiUrl)
                .then(response => {
                    chapterRules = response.data
                })
                .catch(err => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Something went wrong trying to fetch chapter settings. Please try again.',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('fetchChapterRules', { selection }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
            return chapterRules
        },
        async updateChapterRules({ commit }, { selection, chapterRules, combinator, linkedChapterId }) {
            const rulesToPush = [...chapterRules]

            // Handle Chapter link
            if (parseInt(linkedChapterId)) {
                // Add chapter link
                const linkApiUrl = `selections/${selection.id}/chapter/link/${linkedChapterId}`
                selection.linked_chapter_id = linkedChapterId
                await axios.put(linkApiUrl)
            } else if (parseInt(selection.linked_chapter_id)) {
                const linkApiUrl = `selections/${selection.id}/chapter/link`
                selection.linked_chapter_id = null
                await axios.delete(linkApiUrl)
            }

            const apiUrl = `selections/${selection.id}/chapter`
            const apiMethod = chapterRules.length > 0 ? 'put' : 'delete'

            await axios({
                method: apiMethod,
                url: apiUrl,
                data: {
                    rules: rulesToPush,
                    relation: combinator,
                },
            }).then(response => {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: 'Chapter rules updated.',
                        iconClass: 'fa-check',
                        type: 'success',
                    },
                    { root: true }
                )
            })
        },
        async importSelectionInput(
            { commit, dispatch, rootGetters },
            { destinationSelection, sourceSelection, sourceUser, importOptions }
        ) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            const apiUrl = `workspaces/${workspaceId}/convert-user-inputs`

            const actions = Object.keys(importOptions)
                .map(optionKey => {
                    const isEnabled = importOptions[optionKey]
                    return isEnabled ? optionKey : null
                })
                .filter(x => !!x)

            await axios
                .post(apiUrl, {
                    user_id: sourceUser ? sourceUser.id : null,
                    source_selection_id: sourceSelection.id,
                    destination_selection_id: destinationSelection.id,
                    actions,
                    is_copy: true,
                })
                .then(response => {
                    const showCallback = router.currentRoute.name == 'selection'
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Input imported',
                            iconClass: 'fa-check',
                            type: 'success',
                            callbackLabel: showCallback ? 'Refresh changes' : null,
                            callback: () => {
                                showCallback && router.go()
                            },
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: 'Something went wrong, trying to import input',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callbackLabel: 'Retry',
                            callback: () =>
                                dispatch('importSelectionInput', {
                                    destinationSelection,
                                    sourceSelection,
                                    sourceUser,
                                    importOptions,
                                }),
                        },
                        { root: true }
                    )
                })
        },
    },

    mutations: {
        SET_LOADING(state, bool) {
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
            const stateSelections = []
            const selectionsArraySelection = state.selections.find(x => x.id == selection.id)
            if (selectionsArraySelection) stateSelections.push(selectionsArraySelection)
            const currentSelection = state.currentSelections.find(x => x.id == selection.id)
            if (currentSelection) stateSelections.push(currentSelection)
            if (stateSelections.length > 0) {
                stateSelections.map(stateSelection => {
                    // Make users, teams and denied_users reactive
                    if (selection.users) Vue.set(stateSelection, 'users', selection.users)
                    if (selection.denied_users) Vue.set(stateSelection, 'denied_users', selection.denied_users)
                    if (selection.teams) Vue.set(stateSelection, 'teams', selection.teams)
                    if (selection.children) Vue.set(stateSelection, 'children', selection.children)
                    // Object.assign(stateSelection, selection)
                })
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
        SET_SELECTION_PRESENTATION_MODE_ACTIVE(state, { selection, isActive, presentationGroupId }) {
            // Vue.set(selection, 'is_presenting', isActive)
            selection.is_presenting = isActive
            selection.presentation_id = presentationGroupId
        },
        SET_CURRENT_SELECTION_ID(state, selectionId) {
            state.currentSelectionId = selectionId
        },
        SET_CURRENT_SELECTION_REAL_ROLE(state, role) {
            state.currentSelectionRealRole = role
        },
    },
}
