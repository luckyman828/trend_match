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
            // Complete the product if it was IN but now is OUT
            let productsToComplete = []
            if (newAction == 'Out') {
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
                    console.log('then')
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
    },
}
