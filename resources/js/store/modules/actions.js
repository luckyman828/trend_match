import axios from 'axios'

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
        async updateActions({ commit, dispatch, rootGetters }, { actions, newAction }) {
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
                actions: actions.map(action => {
                    return {
                        product_id: action.product_id,
                        action: newAction,
                        variants: action.variants,
                    }
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
                    actions.forEach((action, index) => {
                        commit(
                            'products/SET_ACTIONS',
                            {
                                actions: oldActions,
                                products: rootGetters['products/products'],
                            },
                            { root: true }
                        )
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
            commit('products/SET_ACTIONS', { actions, products: rootGetters['products/products'] }, { root: true })

            const apiUrl = `/selections/${actions[0].selection_id}/actions`
            const requestBody = {
                actions: actions.map(action => {
                    return {
                        product_id: action.product_id,
                        action: action.action,
                        variants: action.variants,
                    }
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
                    return {
                        product_id: action.product_id,
                        feedback: newAction,
                        variants: action.variants,
                    }
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
                    return {
                        product_id: action.product_id,
                        feedback: action.action,
                        variants: action.variants,
                    }
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
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        // UPDATE_ACTIONS(state, { actions, newAction, products, user }) {
        //     // DESC: Sets all actions to the value of new action
        //     actions.forEach(action => {
        //         // Find the actions product
        //         const product = products.find(product => product.id == action.product_id)
        //         // If we didn't find the product, simply update the actions action
        //         if (!product) {
        //             action.action = newAction
        //             action.user = user
        //             return
        //         }
        //         // Loop through the products selectionInput and update the action in all of them (sync)
        //         product.selectionInputList.forEach(selectionInput => {
        //             const selectionAction = selectionInput.actions.find(x => x.selection_id == action.selection_id)
        //             if (selectionAction) {
        //                 selectionAction.action = newAction
        //                 selectionAction.user = user
        //                 // Update variant actions - if the product is OUT no variant can be IN
        //                 if (newAction == 'Out') {
        //                     action.variants.map(variant => {
        //                         variant.feedback = 'Out'
        //                         variant.quantity = 0
        //                     })
        //                 }
        //             }
        //         })
        //     })
        // },
        // SET_ACTIONS(state, { actions, products }) {
        //     // DESC: Sets all actions matching the provided actions equal to the actions provided
        //     actions.forEach(action => {
        //         // Find the actions product
        //         const product = products.find(product => product.id == action.product_id)
        //         // Loop through the products selectionInput and update the action in all of them (sync)
        //         product.selectionInputList.forEach(selectionInput => {
        //             const selectionAction = selectionInput.actions.find(x => x.selection_id == action.selection_id)
        //             if (selectionAction) {
        //                 Object.assign(selectionAction, action)
        //             }
        //         })
        //     })
        // },
        // UPDATE_FEEDBACKS(state, { actions, newAction, products, user }) {
        //     actions.forEach(action => {
        //         // Find the actions product
        //         const product = products.find(product => product.id == action.product_id)
        //         // If we didn't find the product, simply update the actions action
        //         if (!product) {
        //             action.action = newAction
        //             action.user = user
        //             return
        //         }
        //         // Loop through the products selectionInput and update the action in all of them (sync)
        //         product.selectionInputList.forEach(selectionInput => {
        //             const selectionAction = selectionInput.feedbacks.find(
        //                 x => x.selection_id == action.selection_id && x.user_id == action.user_id
        //             )
        //             if (selectionAction) {
        //                 selectionAction.action = newAction
        //                 selectionAction.user = user
        //                 // Update variant actions - if the product is OUT no variant can be IN
        //                 if (newAction == 'Out') {
        //                     action.variants.map(variant => {
        //                         variant.feedback = 'Out'
        //                         variant.quantity = 0
        //                     })
        //                 }
        //             }
        //         })
        //     })
        // },
        // SET_FEEDBACKS(state, { actions, products }) {
        //     actions.forEach(action => {
        //         // Find the actions product
        //         const product = products.find(product => product.id == action.product_id)
        //         // Loop through the products selectionInput and update the action in all of them (sync)
        //         product.selectionInputList.forEach(selectionInput => {
        //             const selectionAction = selectionInput.feedbacks.find(
        //                 x => x.selection_id == action.selection_id && x.user_id == action.user_id
        //             )
        //             if (selectionAction) {
        //                 Object.assign(selectionAction, action)
        //             }
        //         })
        //     })
        // },
    },
}
