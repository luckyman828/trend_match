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
        // Get the actions
        async fetchActions({ commit }, file_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/file/${file_id}/user-products`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    Action.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in actions.js :')
                    console.log(err.response)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },

        async insertOrUpdateAction({ commit, dispatch }, { product, action, selection, user }) {
            // type = action|feedback
            let apiUrl
            let requestBody
            let oldAction
            if (selection.your_role == 'Member') {
                oldAction = product.your_feedback
                apiUrl = `/selections/${selection.id}/feedback`
                requestBody = {
                    selection_feedback: [
                        {
                            product_id: product.id,
                            feedback: action,
                        },
                    ],
                }
            } else if (selection.your_role == 'Owner') {
                oldAction = product.your_action
                apiUrl = `/selections/${selection.id}/actions`
                requestBody = {
                    actions: [
                        {
                            product_id: product.id,
                            action: action,
                        },
                    ],
                }
            }

            // Update state
            commit('insertOrUpdateAction', { product, action, selection, user })

            await axios.post(apiUrl, requestBody).catch(err => {
                // Return the action to the old
                commit('insertOrUpdateAction', { product, action: oldAction, selection, user })
                // Dispatch an error alert
                dispatch(
                    'alerts/showAlert',
                    'Something went wrong. Please try again, or contact Kollekt support, if the problem persists',
                    { root: true }
                )
            })
        },
        async insertOrUpdateActions({ commit, dispatch }, { products, action, selection, user }) {
            // type = action|feedback
            let apiUrl
            let requestBody
            let oldActions
            const productActions = products.map(product => {
                return {
                    product,
                    action,
                }
            })
            if (selection.your_role == 'Member') {
                oldActions = products.map(product => {
                    return {
                        product,
                        action: product.your_feedback,
                    }
                })
                apiUrl = `/selections/${selection.id}/feedback`
                requestBody = {
                    selection_feedback: products.map(product => {
                        return {
                            product_id: product.id,
                            feedback: action,
                        }
                    }),
                }
            } else if (selection.your_role == 'Owner') {
                oldActions = products.map(product => {
                    return {
                        product,
                        action: product.your_action,
                    }
                })
                apiUrl = `/selections/${selection.id}/actions`
                requestBody = {
                    actions: products.map(product => {
                        return {
                            product_id: product.id,
                            action: action,
                        }
                    }),
                }
            }

            // Update state
            commit('insertOrUpdateActions', { productActions, selection, user })

            await axios.post(apiUrl, requestBody).catch(err => {
                // Return the action to the old
                commit('insertOrUpdateActions', { productActions: oldActions, selection, user })
                // Dispatch an error alert
                dispatch(
                    'alerts/showAlert',
                    'Something went wrong. Please try again, or contact Kollekt support, if the problem persists',
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
        alertError: state => {
            window.alert('Network error. Please check your connection')
        },
        insertOrUpdateAction(state, { product, action, selection, user }) {
            if (selection.your_role == 'Member') {
                product.your_feedback = action
                // Check if the action already exists in the products selection_feedback array
                const existingAction = product.selection_feedback.find(
                    x => x.product_id == product.id && x.selection_id == selection.id && x.user_id == user.id
                )
                if (!existingAction) {
                    product.selection_feedback.push({
                        action: action,
                        product_id: product.id,
                        selection: selection,
                        selection_id: selection.id,
                        user_id: user.id,
                        user: user,
                    })
                } else {
                    existingAction.action = action
                }
            }
            if (selection.your_role == 'Owner') {
                Vue.set(product, 'action', action)
                Vue.set(product, 'action_author', user)
                // Check if the action already exists in the products actions array
                const existingAction = product.alignment_actions.find(
                    x => x.product_id == product.id && x.selection_id == selection.id && x.user_id == user.id
                )
                if (!existingAction) {
                    product.alignment_actions.push({
                        action: action,
                        product_id: product.id,
                        selection: selection,
                        selection_id: selection.id,
                        user_id: user.id,
                        user: user,
                    })
                } else {
                    existingAction.action = action
                }
            }
        },
        insertOrUpdateActions(state, { productActions, selection, user }) {
            // Loop through our products and update their actions
            if (selection.your_role == 'Member') {
                productActions.forEach(productAction => {
                    productAction.product.your_feedback = productAction.action
                    // Check if the action already exists in the products selection_feedback array
                    const existingAction = productAction.product.selection_feedback.find(
                        x =>
                            x.product_id == productAction.product.id &&
                            x.selection_id == selection.id &&
                            x.user_id == user.id
                    )
                    if (!existingAction) {
                        productAction.product.selection_feedback.push({
                            action: productAction.action,
                            product_id: productAction.product.id,
                            selection: selection,
                            selection_id: selection.id,
                            user_id: user.id,
                            user: user,
                        })
                    } else {
                        existingAction.action = productAction.action
                    }
                })
            }
            if (selection.your_role == 'Owner') {
                productActions.forEach(productAction => {
                    productAction.product.action = productAction.action
                    Vue.set(productAction.product, 'action', productAction.action)
                    Vue.set(productAction.product, 'action_author', user)
                })
            }
        },
    },
}
