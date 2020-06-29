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
                    // console.log('API error in actions.js :')
                    // console.log(err.response)
                    // console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        async insertOrUpdateActions({ commit, rootGetters }, { products, action, selection, user }) {
            const selectionMode = rootGetters['selections/currentSelectionMode']
            const authUser = rootGetters['auth/authUser']

            let apiUrl
            let requestBody
            let oldActions

            if (selectionMode == 'Alignment') {
                apiUrl = `/selections/${selection.id}/actions`
                requestBody = {
                    actions: products.map(product => {
                        return {
                            product_id: product.id,
                            action: action,
                            variants: product.variants.map(variant => {
                                return {
                                    id: variant.id,
                                    feedback: action,
                                    quantity: action,
                                }
                            }),
                        }
                    }),
                }
            } else if (selectionMode == 'Feedback') {
                apiUrl = `/selections/${selection.id}/feedback`
                requestBody = {
                    feedbacks: products.map(product => {
                        return {
                            product_id: product.id,
                            feedback: action,
                            variants: product.variants.map(variant => {
                                return {
                                    id: variant.id,
                                    feedback: action,
                                }
                            }),
                        }
                    }),
                }
            } else return
        },
        async insertOrUpdateActions({ commit, dispatch, rootGetters }, { products, selectionInput, action, user }) {
            console.log('insert or update actions', products, action, selectionInput, user)
            // productSelectionInputPairs = [product, selectionInput]

            // type = action|feedback
            let apiUrl
            let requestBody
            let oldActions

            // Shape products for request
            console.log('init product actions', products)
            const productActions = productSelectionInputPairList.map(productSelectionInputPair => {
                const product = productSelectionInputPairList.product
                const selectionInput = productSelectionInputPairList.selectionInput
                console.log('product actions', product)
                // Return the products shaped for the request body
                return {
                    product,
                    action: {
                        action,
                        selection: selectionInput.selection,
                        selection_id: selectionInput.selection_id,
                        user_id: user.id,
                        user: user,
                        variants: selectionInput.variants.map(variant => {
                            return {
                                id: variant.id,
                                feedback: action,
                                quantity: action == 'Out' ? 0 : variant.quantity,
                            }
                        }),
                    },
                }
            })

            // Save old actions
            if (selection.your_role == 'Member') {
                products.map(product => {
                    // Loop through all the variants. If their action is None, then give them a default action
                    product.variants.forEach(variant => {
                        // if (variant.your_feedback == 'None') {
                        variant.your_feedback = action
                        // }
                        // if (action == 'None') {
                        //     variant.your_feedback = 'None'
                        // }
                    })
                })

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
                            variants: product.variants.map(variant => {
                                return {
                                    id: variant.id,
                                    feedback: action,
                                }
                            }),
                        }
                    }),
                }
            } else if (selection.your_role == 'Owner') {
                products.map(product => {
                    // Loop through all the variants. If their action is None, then give them a default action
                    product.variants.forEach(variant => {
                        // if (variant.action == 'None') {
                        variant.action = action
                        // }
                    })
                })

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
                            variants: product.variants.map(variant => {
                                return {
                                    id: variant.id,
                                    feedback: action,
                                }
                            }),
                        }
                    }),
                }
            }

            const authUser = rootGetters['auth/authUser']
            const restoreActions = () => {
                commit('INSERT_OR_UPDATE_ACTIONS', {
                    productActions: oldActions,
                    type: selection.your_role == 'Member' ? 'Feedback' : 'Alignment',
                    authUser,
                })
            }

            // Update state
            commit('INSERT_OR_UPDATE_ACTIONS', {
                productActions,
                type: selection.your_role == 'Member' ? 'Feedback' : 'Alignment',
                authUser,
            })

            await axios
                .post(apiUrl, requestBody)
                .then(() => {
                    if (products.length > 1) {
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: `Updated action for ${products.length} products`,
                                iconClass: 'fa-check',
                                type: 'success',
                                callback: async () => {
                                    // Restore the actions
                                    await dispatch('insertOrUpdateProductActionPairs', {
                                        productActionPairs: oldActions,
                                        selection,
                                    })
                                    commit(
                                        'alerts/SHOW_SNACKBAR',
                                        {
                                            msg: `Restored action for ${products.length} products`,
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
                    // Return the action to the old
                    restoreActions()
                    // Dispatch an error alert
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg:
                                'Something went wrong. Please try again, or contact Kollekt support, if the problem persists',
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('insertOrUpdateActions', { products, action, selection, user }),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
        async insertOrUpdateProductActionPairs({ commit, rootGetters }, { productActionPairs, selection }) {
            // Find the selection product if it is not the product we have been passed
            if (!!productActionPairs[0].product.selectionInputList) {
                productActionPairs.map(pair => {
                    if (pair.product.selectionInputList) {
                        const selectionIndex = pair.product.selectionInputList.findIndex(
                            x => x.selection.id == selection.id
                        )
                        pair.product = pair.product.selectionInputList[selectionIndex].product
                    }
                })
            }

            let apiUrl
            let requestBody

            if (selection.your_role == 'Member') {
                apiUrl = `/selections/${selection.id}/feedback`
                requestBody = {
                    feedbacks: productActionPairs.map(pair => {
                        return {
                            product_id: pair.product.id,
                            feedback: pair.action.action,
                            variants: pair.action.variants,
                        }
                    }),
                }
            } else if (selection.your_role == 'Owner') {
                apiUrl = `/selections/${selection.id}/actions`
                requestBody = {
                    actions: productActionPairs.map(pair => {
                        return {
                            product_id: pair.product.id,
                            action: pair.action.action,
                            variants: pair.action.variants,
                        }
                    }),
                }
            }

            // Update state
            const authUser = rootGetters['auth/authUser']
            commit('INSERT_OR_UPDATE_ACTIONS', {
                productActions: productActionPairs,
                type: selection.your_role == 'Member' ? 'Feedback' : 'Alignment',
                authUser,
            })

            await axios.post(apiUrl, requestBody)
        },
        async updateActions({ commit, rootGetters }, { actions, newAction }) {
            console.log('updateAction', actions, newAction)
            // Save the old action
            const oldActions = JSON.parse(JSON.stringify(actions))
            // Update the action
            commit('UPDATE_ACTIONS', { actions, newAction, products: rootGetters['products/products'] })

            const authUser = rootGetters['auth/authUser']

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
                    // action.action = newAction
                })
                .catch(err => {
                    // action.action = oldAction
                })
        },
        async updateFeedbacks({ commit, rootGetters }, { actions, newAction }) {
            console.log('update feeedback', actions, newAction)
            // Save the old action
            const oldActions = JSON.parse(JSON.stringify(actions))
            // Update the action
            commit('UPDATE_FEEDBACKS', { actions, newAction, products: rootGetters['products/products'] })

            const apiUrl = `/selections/${actions[0].selection_id}/feedback`
            const requestBody = {
                feedbacks: actions.map(action => {
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
                    // action.action = newAction
                })
                .catch(err => {
                    // action.action = oldAction
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
        INSERT_OR_UPDATE_ACTIONS(state, { productActions, type, currentSelectionId, authUser }) {
            // Loop through our products and update their actions
            productActions.forEach(productAction => {
                const product = productAction.product
                const action = productAction.action

                // Feedback
                if (type == 'Feedback') {
                    // Update the currently displayed action if the user is the authenticated user
                    if (authUser && action.user_id == authUser.id) {
                        product.your_feedback = action.action
                    }
                    // Check if the action already exists in the products feedbacks array
                    const existingAction = product.feedbacks.find(
                        x => x.selection_id == action.selection_id && x.user_id == action.user_id
                    )
                    if (!existingAction) {
                        productAction.product.feedbacks.push(action)
                    } else {
                        // existingAction.action = action.action
                        Object.assign(existingAction, action)
                    }
                }

                // Alignment
                if (type == 'Alignment') {
                    product.selectionInputList.forEach(selectionInput => {
                        const existingAction = selectionInput.actions.find(x => x.selection_id == action.selection_id)
                        if (!existingAction) {
                            productAction.product.actions.push(action)
                        } else {
                            // existingAction.action = action.action
                            Object.assign(existingAction, action)
                        }
                    })
                }
            })
        },
        UPDATE_ACTIONS(state, { actions, newAction, products }) {
            actions.forEach(action => {
                // Find the actions product
                const product = products.find(product => product.id == action.product_id)
                // If we didn't find the product, simply update the actions action
                if (!product) {
                    action.action = newAction
                    return
                }
                // Loop through the products selectionInput and update the action in all of them (sync)
                product.selectionInputList.forEach(selectionInput => {
                    const selectionAction = selectionInput.actions.find(x => x.selection_id == action.selection_id)
                    if (selectionAction) {
                        selectionAction.action = newAction
                        // Update variant actions - if the product is OUT no variant can be IN
                        if (newAction == 'Out') {
                            action.variants.map(variant => {
                                variant.feedback = 'Out'
                                variant.quantity = 0
                            })
                        }
                    }
                })
            })
        },
        UPDATE_FEEDBACKS(state, { actions, newAction, products }) {
            actions.forEach(action => {
                // Find the actions product
                const product = products.find(product => product.id == action.product_id)
                // If we didn't find the product, simply update the actions action
                if (!product) {
                    action.action = newAction
                    return
                }
                // Loop through the products selectionInput and update the action in all of them (sync)
                product.selectionInputList.forEach(selectionInput => {
                    const selectionAction = selectionInput.feedbacks.find(
                        x => x.selection_id == action.selection_id && x.user_id == action.user_id
                    )
                    if (selectionAction) {
                        selectionAction.action = newAction
                        // Update variant actions - if the product is OUT no variant can be IN
                        if (newAction == 'Out') {
                            action.variants.map(variant => {
                                variant.feedback = 'Out'
                                variant.quantity = 0
                            })
                        }
                    }
                })
            })
        },
    },
}
