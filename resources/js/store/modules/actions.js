import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingActions: state => {
            return state.loading
        },
    },

    actions: {
        async updateAlignments({ commit, rootGetters }, alignments) {
            const apiUrl = `/selections/${alignments[0].selection_id}/actions`
            await axios
                .post(apiUrl, {
                    actions: alignments.map(x => {
                        x.user_id = rootGetters['auth/authUser'].id
                        const action = Object.assign({}, x)
                        action.variants = x.variants.filter(variantAction => variantAction.feedback != 'None')
                        return action
                    }),
                })
                .then(response => {
                    if (alignments.length > 1) {
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: `Updated ${actions.length} actions`,
                                iconClass: 'fa-check',
                                type: 'success',
                            },
                            { root: true }
                        )
                    }
                })
                .catch(err => {
                    console.log('error in update alignments', err)
                })
        },
        async updateActions({ commit, dispatch, rootGetters }, { actions, newAction }) {
            // Complete the product if it was IN but now is OUT
            const selection = rootGetters['selections/getCurrentSelection']
            let productsToComplete = []
            if (newAction == 'Out' && selection.settings.ticket_level != 'None' && selection.type == 'Master') {
                actions.map(action => {
                    if (['In', 'Focus'].includes(action.action)) {
                        const product = rootGetters['products/products'].find(x => x.id == action.product_id)
                        if (product) productsToComplete.push(product)
                    }
                })
            }

            // Save the old actions
            const oldActions = JSON.parse(JSON.stringify(actions))
            const authUser = rootGetters['auth/authUser']

            // Update the action
            commit(
                'products/UPDATE_ACTIONS',
                {
                    actions,
                    newAction,
                    user: authUser,
                },
                { root: true }
            )

            const apiUrl = `/selections/${actions[0].selection_id}/actions`
            const requestBody = {
                actions: actions,
            }

            axios
                .post(apiUrl, requestBody)
                .then(response => {
                    if (productsToComplete.length > 0) {
                        dispatch(
                            'products/setProductsCompleted',
                            {
                                selectionId: actions[0].selection_id,
                                products: productsToComplete,
                                shouldBeCompleted: true,
                            },
                            { root: true }
                        )
                    }
                    if (actions.length > 1) {
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: `Updated ${actions.length} actions`,
                                iconClass: 'fa-check',
                                type: 'success',
                                callback: async () => {
                                    // Restore the actions
                                    await dispatch('setActions', oldActions)
                                    commit(
                                        'alerts/SHOW_SNACKBAR',
                                        {
                                            msg: `Restored ${actions.length} actions`,
                                            iconClass: 'fa-check',
                                            type: 'success',
                                        },
                                        { root: true }
                                    )
                                },
                                callbackLabel: 'Undo',
                            },
                            { root: true }
                        )
                    }
                })
                .catch(err => {
                    console.log('eror', err, err.response)
                    actions.forEach((action, index) => {
                        commit('products/SET_ACTIONS', oldActions, { root: true })
                    })

                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg:
                                'Something went wrong. Please try again, or contact Kollekt support, if the problem persists',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('updateActions', { actions, newAction }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
        async setActions({ commit, dispatch, rootGetters }, actions) {
            // Update the action
            commit('products/SET_ACTIONS', actions, { root: true })

            const apiUrl = `/selections/${actions[0].selection_id}/actions`
            const requestBody = {
                actions: actions,
            }

            axios.post(apiUrl, requestBody).catch(err => {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg:
                            'Something went wrong. Please try again, or contact Kollekt support, if the problem persists',
                        iconClass: 'fa-exclamation-triangle',
                        type: 'warning',
                        callback: () => dispatch('setActions', { actions }),
                        callbackLabel: 'Retry',
                        duration: 0,
                    },
                    { root: true }
                )
            })
        },
        async updateFeedbacks({ commit, dispatch, rootGetters }, { actions, newAction }) {
            // Save the old actions
            const oldActions = JSON.parse(JSON.stringify(actions))
            const authUser = rootGetters['auth/authUser']

            // Update the action
            commit(
                'products/UPDATE_FEEDBACKS',
                {
                    actions,
                    newAction,
                    user: authUser,
                },
                { root: true }
            )

            const apiUrl = `/selections/${actions[0].selection_id}/feedback`
            const requestBody = {
                feedbacks: actions.map(action => {
                    action.feedback = action.action
                    return action
                }),
            }

            axios
                .post(apiUrl, requestBody)
                .then(response => {
                    if (actions.length > 1) {
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: `Updated ${actions.length} actions`,
                                iconClass: 'fa-check',
                                type: 'success',
                                callback: async () => {
                                    // Restore the actions
                                    await dispatch('setFeedbacks', oldActions)
                                    commit(
                                        'alerts/SHOW_SNACKBAR',
                                        {
                                            msg: `Restored ${actions.length} actions`,
                                            iconClass: 'fa-check',
                                            type: 'success',
                                        },
                                        { root: true }
                                    )
                                },
                                callbackLabel: 'Undo',
                            },
                            { root: true }
                        )
                    }
                })
                .catch(err => {
                    actions.forEach((action, index) => {
                        commit('products/SET_FEEDBACKS', oldActions, { root: true })
                    })

                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg:
                                'Something went wrong. Please try again, or contact Kollekt support, if the problem persists',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('updateFeedbacks', { actions, newAction }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
        async setFeedbacks({ commit, dispatch, rootGetters }, actions) {
            // Update the action
            commit('products/SET_FEEDBACKS', actions, { root: true })

            const apiUrl = `/selections/${actions[0].selection_id}/feedback`

            const requestBody = {
                feedbacks: actions.map(action => {
                    action.feedback = action.action
                    return action
                }),
            }

            axios.post(apiUrl, requestBody).catch(err => {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg:
                            'Something went wrong. Please try again, or contact Kollekt support, if the problem persists',
                        iconClass: 'fa-exclamation-triangle',
                        type: 'warning',
                        callback: () => dispatch('setFeedbacks', { actions }),
                        callbackLabel: 'Retry',
                        duration: 0,
                    },
                    { root: true }
                )
            })
        },
        async updateCurrentProductAction({ rootGetters }, product) {
            const actionObject = Object.assign({}, product.yourActionObject)
            actionObject.feedback = actionObject.action
            const selectionMode = rootGetters['selections/getCurrentSelectionMode']
            const inputModeUrl = selectionMode == 'Feedback' ? 'feedback' : 'actions'
            const actionKey = selectionMode == 'Feedback' ? 'feedback' : 'action'
            const data = {}
            data[`${actionKey}s`] = [actionObject]
            const apiUrl = `/selections/${actionObject.selection_id}/${inputModeUrl}`
            axios.post(apiUrl, data)
        },
        async initActions({ rootGetters, dispatch }, { actions, type }) {
            actions.map(async action => {
                if (!action.quantity_details) Vue.set(action, 'quantity_details', [])
                if (!action.variants) Vue.set(action, 'variants', [])
                if (!action.labels) Vue.set(action, 'labels', [])

                // if (!action.feedback) {
                //     Object.defineProperty(action, 'feedback', {
                //         get: function() {
                //             return action.action
                //         },
                //         set: function(value) {
                //             action.action = value
                //         },
                //     })
                // }

                Object.defineProperty(action, 'user', {
                    get: function() {
                        // Check if the user is anonymized
                        const currentSelection = rootGetters['selections/getCurrentSelection']
                        const currentSelectionRole = currentSelection.your_role
                        const anonymizeLevel =
                            type == 'action'
                                ? currentSelection.settings.anonymize_action
                                : currentSelection.settings.anonymize_feedback
                        const anonymized =
                            anonymizeLevel == 'None' || (anonymizeLevel == 'Owner' && currentSelectionRole == 'Member')

                        const user = rootGetters['selectionProducts/getSelectionUsers'].find(
                            user => user.id == action.user_id
                        )
                        if (anonymized) {
                            const anonymizedClone = Object.assign({}, user)
                            anonymizedClone.name = 'Anonymous'
                            return anonymizedClone
                        }
                        return user
                    },
                })
                Object.defineProperty(action, 'selection', {
                    get: function() {
                        // Check if the user is anonymized
                        const currentSelection = rootGetters['selections/getCurrentSelection']
                        const currentSelectionRole = currentSelection.your_role
                        const anonymizeLevel =
                            type == 'action'
                                ? currentSelection.settings.anonymize_action
                                : currentSelection.settings.anonymize_feedback
                        const anonymized =
                            anonymizeLevel == 'None' || (anonymizeLevel == 'Owner' && currentSelectionRole == 'Member')

                        const selection = rootGetters['selectionProducts/getSelections'].find(
                            selection => selection.id == action.selection_id
                        )
                        if (anonymized) {
                            const anonymizedClone = Object.assign({}, selection)
                            anonymizedClone.name = 'Anonymous'
                            return anonymizedClone
                        }
                        return selection
                    },
                })
                await dispatch('initVariantActions', { productAction: action, variantActions: action.variants })
            })
        },
        async initVariantActions({}, { productAction, variantActions }) {
            variantActions.map(variantAction => {
                Object.defineProperty(variantAction, 'productAlignment', {
                    get: () => productAction,
                })
            })
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
    },
}
