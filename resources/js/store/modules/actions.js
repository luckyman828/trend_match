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
        async insertOrUpdateActions({ commit, dispatch }, { products, action, selection, user }) {
            // type = action|feedback
            let apiUrl
            let requestBody
            let oldActions
            const productActions = products.map(product => {
                return {
                    product,
                    action: {
                        action,
                        product_id: product.id,
                        selection,
                        selection_id: selection.id,
                        user_id: user.id,
                        user: user,
                    },
                }
            })
            if (selection.your_role == 'Member') {
                oldActions = products.map(product => {
                    return {
                        product,
                        action: {
                            action: product.your_feedback,
                            product_id: product.id,
                            selection,
                            selection_id: selection.id,
                            user_id: user.id,
                            user: user,
                        },
                    }
                })
                apiUrl = `/selections/${selection.id}/feedback`
                requestBody = {
                    feedbacks: products.map(product => {
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
                        action: {
                            action: product.action,
                            product_id: product.id,
                            selection,
                            selection_id: selection.id,
                            user_id: user.id,
                            user: user,
                        },
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
            commit('INSERT_OR_UPDATE_ACTIONS', {
                productActions,
                type: selection.your_role == 'Member' ? 'Feedback' : 'Alignment',
            })

            await axios.post(apiUrl, requestBody).catch(err => {
                // Return the action to the old
                console.log('there is an error!')
                console.log(oldActions)
                commit('INSERT_OR_UPDATE_ACTIONS', {
                    productActions: oldActions,
                    type: selection.your_role == 'Member' ? 'Feedback' : 'Alignment',
                })
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
        INSERT_OR_UPDATE_ACTIONS(state, { productActions, type, currentSelectionId }) {
            console.log('insert or update actions', productActions, type, currentSelectionId)
            // Loop through our products and update their actions
            productActions.forEach(productAction => {
                const product = productAction.product
                const action = productAction.action

                // Feedback
                if (type == 'Feedback') {
                    product.your_feedback = action.action
                    // Check if the action already exists in the products feedbacks array
                    const existingAction = product.feedbacks.find(
                        x => x.selection_id == action.selection_id && x.user_id == action.user_id
                    )
                    if (!existingAction) {
                        productAction.product.feedbacks.push(action)
                    } else {
                        existingAction.action = action.action
                    }
                }

                // Alignment
                if (type == 'Alignment') {
                    const existingAction = product.actions.find(x => x.selection_id == action.selection_id)
                    if (!existingAction) {
                        productAction.product.actions.push(action)
                    } else {
                        existingAction.action = action.action
                    }

                    // If is self
                    if (!currentSelectionId || action.selection_id == currentSelectionId) {
                        Vue.set(product, 'action', action.action)
                        Vue.set(product, 'action_author', action.user)
                    }
                }
            })
        },
        // INSERT_OR_UPDATE_ACTIONS(state, { productActions, selection, user, type, currentSelectionId }) {
        //     console.log('insert or update actions', productActions, selection, user, type)
        //     // Loop through our products and update their actions
        //     if (type == 'Feedback') {
        //         productActions.forEach(productAction => {
        //             productAction.product.your_feedback = productAction.action
        //             // Check if the action already exists in the products feedbacks array
        //             const existingAction = productAction.product.feedbacks.find(
        //                 x =>
        //                     x.product_id == productAction.product.id &&
        //                     x.selection_id == selection.id &&
        //                     x.user_id == user.id
        //             )
        //             if (!existingAction) {
        //                 productAction.product.feedbacks.push({
        //                     action: productAction.action,
        //                     product_id: productAction.product.id,
        //                     selection: selection,
        //                     selection_id: selection.id,
        //                     user_id: user.id,
        //                     user: user,
        //                 })
        //             } else {
        //                 existingAction.action = productAction.action
        //             }
        //         })
        //     }
        //     if (type == 'Alignment') {
        //         productActions.forEach(productAction => {
        //             console.log('setting product action')
        //             const existingAction = productAction.product.actions.find(
        //                 x => x.product_id == productAction.product.id && x.selection_id == selection.id
        //             )
        //             if (!existingAction) {
        //                 productAction.product.actions.push({
        //                     action: productAction.action,
        //                     product_id: productAction.product.id,
        //                     selection: selection,
        //                     selection_id: selection.id,
        //                     user_id: user.id,
        //                     user: user,
        //                 })
        //             } else {
        //                 existingAction.action = productAction.action
        //             }

        //             // If is self
        //             if (!currentSelectionId || selection.id == currentSelectionId) {
        //                 Vue.set(productAction.product, 'action', productAction.action)
        //                 Vue.set(productAction.product, 'action_author', user)
        //             }
        //         })
        //     }
        // },
        UPDATE_ACTIONS(state, { product, action, selection, user, type }) {
            if (type == 'Feedback') {
                const existingAction = product.feedbacks.find(
                    x => x.selection_id == selection.id && x.user_id == user.id
                )
                if (!!existingAction) {
                    existingAction.action = action
                }
            }
            if (type == 'Alignment') {
                const existingAction = product.actions.find(x => x.selection_id == selection.id)
                if (!!existingAction) {
                    existingAction.action = action
                }
            }
        },
    },
}
