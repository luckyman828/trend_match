import axios from 'axios'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingActions: (state) => {
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

        async insertOrUpdateAction({ commit, dispatch, rootGetters }, { product, action, selection, user }) {
            console.log('Update action for: ' + selection.name)
            const type =
                selection.your_role == 'Member' ? 'Feedback' : selection.your_role == 'Owner' ? 'Alignment' : ''
            let apiUrl
            let requestBody
            let oldAction
            if (type == 'Feedback') {
                oldAction = product.your_feedback
                apiUrl = `/selections/${selection.id}/feedback`
                requestBody = {
                    feedbacks: [
                        {
                            product_id: product.id,
                            feedback: action,
                        },
                    ],
                }
            } else if (type == 'Alignment') {
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
            commit('insertOrUpdateAction', { product, action, selection, user, type, authorIsAuthUser: true })

            await axios.post(apiUrl, requestBody).catch((err) => {
                // Return the action to the old
                commit('insertOrUpdateAction', {
                    product,
                    action: oldAction,
                    selection,
                    user,
                    type,
                    authorIsAuthUser: true,
                })
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
            const productActions = products.map((product) => {
                return {
                    product,
                    action,
                }
            })
            if (selection.your_role == 'Member') {
                oldActions = products.map((product) => {
                    return {
                        product,
                        action: product.your_feedback,
                    }
                })
                apiUrl = `/selections/${selection.id}/feedback`
                requestBody = {
                    feedbacks: products.map((product) => {
                        return {
                            product_id: product.id,
                            feedback: action,
                        }
                    }),
                }
            } else if (selection.your_role == 'Owner') {
                oldActions = products.map((product) => {
                    return {
                        product,
                        action: product.your_action,
                    }
                })
                apiUrl = `/selections/${selection.id}/actions`
                requestBody = {
                    actions: products.map((product) => {
                        return {
                            product_id: product.id,
                            action: action,
                        }
                    }),
                }
            }

            // Update state
            commit('insertOrUpdateActions', { productActions, selection, user })

            await axios.post(apiUrl, requestBody).catch((err) => {
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
        alertError: (state) => {
            window.alert('Network error. Please check your connection')
        },
        insertOrUpdateAction(state, { product, action, selection, user, type, authorIsAuthUser }) {
            console.log('Insert or Update action')
            console.log(action)
            if (type == 'Feedback') {
                if (authorIsAuthUser) product.your_feedback = action
                // Check if the action already exists in the products feedbacks array
                const existingAction = product.feedbacks.find(
                    (x) => x.product_id == product.id && x.selection_id == selection.id && x.user_id == user.id
                )
                if (!existingAction) {
                    product.feedbacks.push({
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
            if (type == 'Alignment') {
                Vue.set(product, 'action', action)
                Vue.set(product, 'action_author', user)
                // Check if the action already exists in the products actions array
                const existingAction = product.actions.find(
                    (x) => x.product_id == product.id && x.selection_id == selection.id
                )
                if (!existingAction) {
                    product.actions.push({
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
                productActions.forEach((productAction) => {
                    productAction.product.your_feedback = productAction.action
                    // Check if the action already exists in the products feedbacks array
                    const existingAction = productAction.product.feedbacks.find(
                        (x) =>
                            x.product_id == productAction.product.id &&
                            x.selection_id == selection.id &&
                            x.user_id == user.id
                    )
                    if (!existingAction) {
                        productAction.product.feedbacks.push({
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
                productActions.forEach((productAction) => {
                    productAction.product.action = productAction.action
                    Vue.set(productAction.product, 'action', productAction.action)
                    Vue.set(productAction.product, 'action_author', user)
                })
            }
        },
        UPDATE_ACTIONS(state, { product, action, selection, user, type }) {
            console.log('Update actions')
            if (type == 'Feedback') {
                const existingAction = product.feedbacks.find(
                    (x) => x.selection_id == selection.id && x.user_id == user.id
                )
                if (!!existingAction) {
                    existingAction.action = action
                }
            }
            if (type == 'Alignment') {
                // console.log('Update alignment actions for: ' + selection.name)
                const existingAction = product.actions.find((x) => x.selection_id == selection.id)
                if (!!existingAction) {
                    console.log('new action: ' + action)
                    existingAction.action = action
                }
            }
        },
    },
}
