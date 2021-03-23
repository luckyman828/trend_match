export default {
    namespaced: true,

    state: {
        selections: [],
        selectionUsers: [],
        distributionScope: 'Feedback',
    },
    getters: {
        getDistributionScope: state => state.distributionScope,
        getActiveSelectionInput: (state, getters, rootState, rootGetters) => product => {
            const activeSelection = rootGetters['selections/getCurrentSelections'][0]
            return product.selectionInputList.find(selectionInput => selectionInput.selection_id == activeSelection.id)
        },
        getSelections: state => state.selections,
        getSelectionUsers: state => state.selectionUsers,
        getProducts: (state, getters, rootState, rootGetters) => {
            const allProducts = rootGetters['products/getAllProducts']
            const currentSelections = rootGetters['selections/getCurrentSelections']
            if (currentSelections.length <= 0) return allProducts
            const productsFiltered = allProducts.filter(product => {
                let isValid = true
                currentSelections.map(selection => {
                    const exists = product.selectionInputList.find(x => x.selection_id == selection.id)
                    if (!exists) isValid = false
                })
                return isValid
            })
            return productsFiltered
        },
    },
    actions: {
        async fetchSelectionProducts({ commit, dispatch, rootGetters }, selection) {
            commit('products/SET_PRODUCTS_STATUS', 'loading', { root: true })
            const authUser = rootGetters['auth/authUser']

            // Fetch the selection input for the products
            let products = []
            const apiUrl = `/selections/${selection.id}/products-next`

            await axios
                .get(apiUrl)
                .then(async response => {
                    const selections = response.data.selections
                    await dispatch('initSelections', selections)
                    commit('INSERT_SELECTIONS', selections)
                    commit('INSERT_SELECTION_USERS', response.data.users)
                    products = response.data.products
                    const selectionProductInput = { selection, products }
                    // Process the selection products
                    dispatch('mergeProductsWithSelectionInput', {
                        selectionProductInput,
                        authUser,
                    })
                    commit('products/SET_PRODUCTS_STATUS', 'success', { root: true })
                })
                .catch(err => {
                    console.log('Error in fetch selection products', err)
                })

            return products
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
                        return rootGetters['selections/getSelectionChapter'](selection)
                    },
                })
            })
        },
        async mergeProductsWithSelectionInput({ state, rootGetters, dispatch }, { selectionProductInput, authUser }) {
            const products = rootGetters['products/getAllProducts'].filter(product => {
                return !!selectionProductInput.products.find(x => x.id == product.id)
            })
            await Promise.all(
                products.map(async product => {
                    const rawSelectionInput = selectionProductInput.products.find(x => x.id == product.id)
                    const selectionInput = {}
                    Vue.set(selectionInput, 'rawSelectionInput', rawSelectionInput)
                    Vue.set(selectionInput, 'selection_id', selectionProductInput.selection.id)
                    Vue.set(selectionInput, 'selection', selectionProductInput.selection)
                    Vue.set(selectionInput, 'product_id', product.id)
                    Vue.set(selectionInput, 'product', product)
                    Vue.set(selectionInput, 'variants', rawSelectionInput.variants)

                    rawSelectionInput.feedbacks.map(action => {
                        if (!action.variants) action.variants = []
                    })
                    rawSelectionInput.alignments.map(action => {
                        if (!action.variants) action.variants = []
                        action.variants.map(variant => {
                            if (!variant.date_quantities) variant.date_quantities = []
                        })
                    })

                    Object.defineProperty(selectionInput, 'is_completed', {
                        get: function() {
                            return rawSelectionInput.is_completed
                        },
                        set: function(value) {
                            rawSelectionInput.is_completed = value
                        },
                    })

                    Object.defineProperty(selectionInput, 'preferred_currency', {
                        get: function() {
                            return rawSelectionInput.preferred_currency
                        },
                    })
                    Object.defineProperty(selectionInput, 'variants', {
                        get: function() {
                            return rawSelectionInput.variants
                        },
                    })
                    Object.defineProperty(selectionInput, 'feedbacks', {
                        get: function() {
                            const allFeedback = rawSelectionInput.feedbacks
                            const filterSelectionIds = rootGetters['productFilters/getFilterSelectionIds']
                            if (filterSelectionIds.length > 0) {
                                return allFeedback.filter(x => filterSelectionIds.includes(x.selection_id))
                            }
                            return allFeedback
                        },
                    })
                    Object.defineProperty(selectionInput, 'feedbacksRaw', {
                        get: function() {
                            const allFeedback = rawSelectionInput.feedbacks
                            return allFeedback
                        },
                    })
                    Object.defineProperty(selectionInput, 'actions', {
                        get: function() {
                            const allActions = rawSelectionInput.alignments
                            const filterSelectionIds = rootGetters['productFilters/getFilterSelectionIds']
                            if (filterSelectionIds.length > 0) {
                                return allActions.filter(x => filterSelectionIds.includes(x.selection_id))
                            }
                            return allActions
                        },
                    })
                    Object.defineProperty(selectionInput, 'actionsRaw', {
                        get: function() {
                            const allActions = rawSelectionInput.alignments
                            return allActions
                        },
                    })
                    Object.defineProperty(selectionInput, 'comments', {
                        get: function() {
                            const allComments = rawSelectionInput.comments.filter(comment => !comment.is_deleted)
                            const filterSelectionIds = rootGetters['productFilters/getFilterSelectionIds']
                            if (filterSelectionIds.length > 0) {
                                return allComments.filter(x => filterSelectionIds.includes(x.selection_id))
                            }
                            return allComments
                        },
                    })
                    Object.defineProperty(selectionInput, 'requests', {
                        get: function() {
                            const allRequests = rawSelectionInput.requests
                            const filterSelectionIds = rootGetters['productFilters/getFilterSelectionIds']
                            if (filterSelectionIds.length > 0) {
                                return allRequests.filter(x => filterSelectionIds.includes(x.selection_id))
                            }
                            return allRequests
                        },
                    })
                    Object.defineProperty(selectionInput, 'selectionRequest', {
                        get: function() {
                            return selectionInput.requests.find(x => x.selection_id == selectionInput.selection_id)
                        },
                    })

                    Object.defineProperty(selectionInput, 'hasUnreadAlignerComment', {
                        get: function() {
                            return !!selectionInput.requests.find(x => x.hasUnreadAlignerComment)
                        },
                    })
                    Object.defineProperty(selectionInput, 'hasUnreadApproverComment', {
                        get: function() {
                            return !!selectionInput.requests.find(x => x.hasUnreadApproverComment)
                        },
                    })
                    Object.defineProperty(selectionInput, 'hasOpenTicket', {
                        get: function() {
                            return selectionInput.requests.find(
                                request => request.status == 'Open' && request.type == 'Ticket'
                            )
                        },
                    })
                    Object.defineProperty(selectionInput, 'hasTicket', {
                        get: function() {
                            return !!selectionInput.requests.find(request => request.type == 'Ticket')
                        },
                    })

                    // Set the current action for the user
                    Object.defineProperty(selectionInput, 'your_feedback', {
                        get: function() {
                            const userFeedback = rawSelectionInput.feedbacks.find(
                                x => x.selection_id == selectionInput.selection_id && x.user_id == authUser.id
                            )
                            return userFeedback ? userFeedback.action : 'None'
                        },
                        set: function(value) {
                            rawSelectionInput.feedbacks.find(
                                x => x.selection_id == selectionInput.selection_id && x.user_id == authUser.id
                            ).action = value
                        },
                    })
                    // Set the current action for the user
                    Object.defineProperty(selectionInput, 'action', {
                        get: function() {
                            return rawSelectionInput.alignments.find(x => x.selection_id == selectionInput.selection_id)
                                .action
                        },
                        set: function(value) {
                            rawSelectionInput.alignments.find(
                                x => x.selection_id == selectionInput.selection_id
                            ).action = value
                        },
                    })

                    // Set the current action for the user
                    Object.defineProperty(selectionInput, 'yourSelectionFeedback', {
                        get: function() {
                            return rawSelectionInput.feedbacks.find(
                                x => x.selection_id == selectionInput.selection_id && x.user_id == authUser.id
                            )
                        },
                        set: function(value) {
                            const rawAction = rawSelectionInput.feedbacks.find(
                                x => x.selection_id == selectionInput.selection_id && x.user_id == authUser.id
                            )
                            Object.assign(rawAction, value)
                        },
                    })
                    // Set the current action for the user
                    Object.defineProperty(selectionInput, 'selectionAction', {
                        get: function() {
                            return rawSelectionInput.alignments.find(x => x.selection_id == selectionInput.selection_id)
                        },
                        set: function(value) {
                            const rawAction = rawSelectionInput.alignments.find(
                                x => x.selection_id == selectionInput.selection_id
                            )
                            Object.assign(rawAction, value)
                        },
                    })
                    // Set the current action for the user
                    Object.defineProperty(selectionInput, 'action_author', {
                        get: function() {
                            return rawSelectionInput.alignments.find(
                                x => x.selection_id == selectionInput.selection_id && x.user_id == authUser.id
                            ).user
                        },
                        set: function(value) {
                            rawSelectionInput.action_author = value
                        },
                    })

                    // Get the selection's quantity
                    Object.defineProperty(selectionInput, 'quantity', {
                        get: function() {
                            let totalQty = 0
                            selectionInput.variants.map(variant => {
                                totalQty += variant.quantity
                            })
                            return totalQty
                        },
                    })
                    // Get the user's quantity
                    Object.defineProperty(selectionInput, 'your_quantity', {
                        get: function() {
                            let totalQty = 0
                            selectionInput.variants.map(variant => {
                                totalQty += variant.your_quantity
                            })
                            return totalQty
                        },
                    })
                    // Get total
                    Object.defineProperty(selectionInput, 'totalQuantity', {
                        get: function() {
                            let totalQty = 0
                            selectionInput.variants.map(variant => {
                                // Return the childrens quantity if no quantity has been set for this selection
                                const quantity =
                                    variant.action == 'None'
                                        ? variant.totalChildrenQuantity + variant.totalSiblingQuantity
                                        : variant.totalSiblingQuantity
                                totalQty += quantity
                            })
                            return totalQty
                        },
                    })
                    // Get total from children
                    Object.defineProperty(selectionInput, 'totalChildrenQuantity', {
                        get: function() {
                            let totalQty = 0
                            selectionInput.variants.map(variant => {
                                variant.actions
                                    .filter(action => action.selection.parent_id == selectionInput.selection_id)
                                    .map(action => {
                                        totalQty += action.quantity
                                    })
                            })
                            return totalQty
                        },
                    })
                    // Get total from ex children
                    Object.defineProperty(selectionInput, 'totalSiblingQuantity', {
                        get: function() {
                            let totalQty = 0
                            selectionInput.variants.map(variant => {
                                variant.actions
                                    .filter(action => action.selection.parent_id == selectionInput.selection.parent_id)
                                    .map(action => {
                                        totalQty += action.quantity
                                    })
                            })
                            return totalQty
                        },
                    })

                    Object.defineProperty(selectionInput, 'totalFeedbackQuantity', {
                        get: function() {
                            let totalQty = 0
                            selectionInput.variants.map(variant => {
                                variant.feedbacks.map(action => {
                                    totalQty += action.quantity
                                })
                            })
                            return totalQty
                        },
                    })

                    // Dynamically Calculated Actions
                    // Feedback Actions
                    Object.defineProperty(selectionInput, 'ins', {
                        get: function() {
                            return selectionInput.feedbacks.filter(x => x.action == 'In')
                        },
                        configurable: true,
                    })
                    Object.defineProperty(selectionInput, 'outs', {
                        get: function() {
                            return selectionInput.feedbacks.filter(x => x.action == 'Out')
                        },
                    })
                    Object.defineProperty(selectionInput, 'focus', {
                        get: function() {
                            return selectionInput.feedbacks.filter(x => x.action == 'Focus')
                        },
                    })
                    Object.defineProperty(selectionInput, 'nds', {
                        get: function() {
                            return selectionInput.feedbacks.filter(x => x.action == 'None')
                        },
                    })
                    // Alignment Actions
                    Object.defineProperty(selectionInput, 'alignmentIns', {
                        get: function() {
                            return selectionInput.actions.filter(x => x.action == 'In')
                        },
                    })
                    Object.defineProperty(selectionInput, 'alignmentOuts', {
                        get: function() {
                            return selectionInput.actions.filter(x => x.action == 'Out')
                        },
                    })
                    Object.defineProperty(selectionInput, 'alignmentFocus', {
                        get: function() {
                            return selectionInput.actions.filter(x => x.action == 'Focus')
                        },
                    })
                    Object.defineProperty(selectionInput, 'alignmentNds', {
                        get: function() {
                            return selectionInput.actions.filter(x => x.action == 'None')
                        },
                    })

                    // PROCESS INPUT TYPES
                    await Promise.all([
                        dispatch('actions/initActions', selectionInput.actions, { root: 'true' }),
                        dispatch('actions/initActions', selectionInput.feedbacks, { root: 'true' }),
                        dispatch('requests/initRequests', selectionInput.requests, { root: 'true' }),
                        dispatch('comments/initComments', selectionInput.comments, { root: 'true' }),
                    ])

                    // PROCESS VARIANTS
                    selectionInput.variants.forEach(variant => {
                        // VARIANTS
                        Vue.set(variant, 'imageIndex', 0)
                        if (!variant.pictures) Vue.set(variant, 'pictures', [])
                        if (!variant.ean_sizes) Vue.set(variant, 'ean_sizes', [])

                        Object.defineProperty(variant, 'currentImg', {
                            get: function() {
                                return variant.pictures[variant.imageIndex]
                            },
                        })

                        Object.defineProperty(variant, 'feedbacks', {
                            get: function() {
                                const feedbacks = []
                                selectionInput.feedbacks.map(feedback => {
                                    const variantFeedbacks = feedback.variants.filter(x => x.id == variant.id)
                                    variantFeedbacks.map(variantFeedback => {
                                        feedbacks.push({
                                            id: variantFeedback.id,
                                            action: variantFeedback.feedback,
                                            quantity: variantFeedback.quantity,
                                            user_id: feedback.user_id,
                                            user: feedback.user,
                                            selection_id: feedback.selection_id,
                                            selection: feedback.selection,
                                        })
                                    })
                                })
                                return feedbacks.filter(x => x.action != 'None')
                            },
                        })
                        Object.defineProperty(variant, 'feedbacksRaw', {
                            get: function() {
                                const feedbacks = []
                                selectionInput.feedbacksRaw.map(feedback => {
                                    const variantFeedbacks = feedback.variants.filter(x => x.id == variant.id)
                                    variantFeedbacks.map(variantFeedback => {
                                        feedbacks.push({
                                            id: variantFeedback.id,
                                            action: variantFeedback.feedback,
                                            quantity: variantFeedback.quantity,
                                            user_id: feedback.user_id,
                                            user: feedback.user,
                                            selection_id: feedback.selection_id,
                                            selection: feedback.selection,
                                        })
                                    })
                                })
                                return feedbacks
                            },
                        })
                        // Get the user's feedback
                        Object.defineProperty(variant, 'your_feedback', {
                            get: function() {
                                const userFeedback = variant.feedbacksRaw.find(
                                    x => x.user_id == authUser.id && x.selection_id == selectionInput.selection_id
                                )
                                return userFeedback ? userFeedback.action : 'None'
                            },
                            set: function(newAction) {
                                // Find the user feedback for the variant input for this feedback action
                                const userFeedback = selectionInput.feedbacksRaw.find(
                                    feedback =>
                                        feedback.user_id == authUser.id &&
                                        feedback.selection_id == selectionInput.selection_id
                                )
                                // If the user has already made variant input, update the action
                                const userVariantFeedbackIndex = userFeedback.variants.findIndex(
                                    x => x.id == variant.id
                                )
                                if (userVariantFeedbackIndex >= 0) {
                                    userFeedback.variants.splice(userVariantFeedbackIndex, 1, {
                                        feedback: newAction,
                                        id: variant.id,
                                        quantity: variant.your_quantity,
                                    })
                                } else {
                                    userFeedback.variants.push({
                                        feedback: newAction,
                                        id: variant.id,
                                        quantity: variant.your_quantity,
                                    })
                                }
                            },
                        })

                        Object.defineProperty(variant, 'actions', {
                            get: function() {
                                const actions = []
                                selectionInput.actions.map(action => {
                                    const variantActions = action.variants.filter(x => x.id == variant.id)
                                    variantActions.map(variantAction => {
                                        actions.push({
                                            id: variantAction.id,
                                            action: variantAction.feedback,
                                            quantity: variantAction.quantity,
                                            user_id: action.user_id,
                                            user: action.user,
                                            selection_id: action.selection_id,
                                            selection: action.selection,
                                        })
                                    })
                                })
                                return actions.filter(x => x.action != 'None')
                            },
                        })
                        Object.defineProperty(variant, 'actionsRaw', {
                            get: function() {
                                const actions = []
                                selectionInput.actionsRaw.map(action => {
                                    const variantActions = action.variants.filter(x => x.id == variant.id)
                                    variantActions.map(variantAction => {
                                        actions.push({
                                            id: variantAction.id,
                                            action: variantAction.feedback,
                                            quantity: variantAction.quantity,
                                            user_id: action.user_id,
                                            user: action.user,
                                            selection_id: action.selection_id,
                                            selection: action.selection,
                                            date_quantities: variantAction.date_quantities,
                                        })
                                    })
                                })
                                return actions.filter(x => x.action != 'None')
                            },
                        })
                        // Get the selection's action
                        Object.defineProperty(variant, 'action', {
                            get: function() {
                                const selectionAction = variant.actionsRaw.find(
                                    x => x.selection_id == selectionInput.selection_id
                                )
                                return selectionAction ? selectionAction.action : 'None'
                            },
                            set: function(newAction) {
                                // Find the current action for the variant input for this action action
                                const currentAction = selectionInput.actionsRaw.find(
                                    action => action.selection_id == selectionInput.selection_id
                                )
                                // If the user has already made variant input, update the action
                                const currentVariantActionIndex = currentAction.variants.findIndex(
                                    x => x.id == variant.id
                                )
                                if (currentVariantActionIndex >= 0) {
                                    currentAction.variants.splice(currentVariantActionIndex, 1, {
                                        id: variant.id,
                                        feedback: newAction,
                                        quantity: currentAction.variants[currentVariantActionIndex].quantity,
                                    })
                                } else {
                                    currentAction.variants.push({
                                        id: variant.id,
                                        feedback: newAction,
                                        quantity: variant.quantity,
                                    })
                                }
                            },
                        })
                        Object.defineProperty(variant, 'selectionAction', {
                            get: function() {
                                const selectionAction = variant.actionsRaw.find(
                                    x => x.selection_id == selectionInput.selection_id
                                )
                                return selectionAction
                            },
                        })
                        // Get the selection's quantity
                        Object.defineProperty(variant, 'quantity', {
                            get: function() {
                                const currentAction = selectionInput.actionsRaw.find(
                                    action => action.selection_id == selectionInput.selection_id
                                )
                                const currentVariantActionIndex = currentAction.variants.findIndex(
                                    x => x.id == variant.id
                                )
                                return currentVariantActionIndex >= 0
                                    ? currentAction.variants[currentVariantActionIndex].quantity
                                    : 0
                            },
                            set: function(newQuantity) {
                                // Find the current action for the variant input for this action action
                                const currentAction = selectionInput.actionsRaw.find(
                                    action => action.selection_id == selectionInput.selection_id
                                )
                                // If the user has already made variant input, update the action
                                const currentVariantActionIndex = currentAction.variants.findIndex(
                                    x => x.id == variant.id
                                )
                                if (currentVariantActionIndex >= 0) {
                                    currentAction.variants[currentVariantActionIndex].quantity = newQuantity
                                    currentAction.variants.splice(currentVariantActionIndex, 1, {
                                        id: variant.id,
                                        feedback: variant.action,
                                        quantity: newQuantity,
                                    })
                                } else {
                                    currentAction.variants.push({
                                        id: variant.id,
                                        feedback: variant.action,
                                        quantity: newQuantity,
                                    })
                                }
                            },
                        })
                        // Get the user's feedback quantity
                        Object.defineProperty(variant, 'your_quantity', {
                            get: function() {
                                const userFeedback = variant.feedbacksRaw.find(
                                    x => x.user_id == authUser.id && x.selection_id == selectionInput.selection_id
                                )
                                return userFeedback ? userFeedback.quantity : 0
                            },
                            set: function(newQuantity) {
                                // Find the current action for the variant input for this action action
                                const userFeedback = selectionInput.feedbacksRaw.find(
                                    feedback =>
                                        feedback.user_id == authUser.id &&
                                        feedback.selection_id == selectionInput.selection_id
                                )
                                // If the user has already made variant input, update the action
                                const currentVariantFeedbackIndex = userFeedback.variants.findIndex(
                                    x => x.id == variant.id
                                )
                                if (currentVariantFeedbackIndex >= 0) {
                                    userFeedback.variants.splice(currentVariantFeedbackIndex, 1, {
                                        id: variant.id,
                                        feedback: variant.your_feedback,
                                        quantity: newQuantity,
                                    })
                                } else {
                                    userFeedback.variants.push({
                                        id: variant.id,
                                        feedback: variant.your_feedback,
                                        quantity: newQuantity,
                                    })
                                }
                            },
                        })
                        // Get the selection's quantity
                        Object.defineProperty(variant, 'totalQuantity', {
                            get: function() {
                                // Return the childrens quantity if no quantity has been set for this selection
                                const actionsFiltered =
                                    variant.action == 'None'
                                        ? variant.actions.filter(
                                              action => action.selection.parent_id == selectionInput.selection_id
                                          )
                                        : variant.actions.filter(
                                              action => action.selection.parent_id != selectionInput.selection_id
                                          )
                                return actionsFiltered.reduce((total, x) => (total += x.quantity), 0)
                            },
                        })
                        // Get total from children
                        Object.defineProperty(variant, 'totalChildrenQuantity', {
                            get: function() {
                                return variant.actions
                                    .filter(action => action.selection.parent_id == selectionInput.selection_id)
                                    .reduce((total, x) => (total += x.quantity), 0)
                            },
                        })
                        // Get total from ex children
                        Object.defineProperty(variant, 'totalSiblingQuantity', {
                            get: function() {
                                return variant.actions
                                    .filter(action => action.selection.parent_id == selectionInput.selection.parent_id)
                                    .reduce((total, x) => (total += x.quantity), 0)
                            },
                        })
                        // Get the selection's quantity
                        Object.defineProperty(variant, 'totalFeedbackQuantity', {
                            get: function() {
                                return variant.feedbacks.reduce((total, x) => (total += x.quantity), 0)
                            },
                        })

                        // Feedback Actions
                        Object.defineProperty(variant, 'ins', {
                            get: function() {
                                return variant.feedbacks.filter(x => x.action == 'In')
                            },
                            configurable: true,
                        })
                        Object.defineProperty(variant, 'outs', {
                            get: function() {
                                return variant.feedbacks.filter(x => x.action == 'Out')
                            },
                        })
                        Object.defineProperty(variant, 'focus', {
                            get: function() {
                                return variant.feedbacks.filter(x => x.action == 'Focus')
                            },
                        })
                        Object.defineProperty(variant, 'nds', {
                            get: function() {
                                return variant.feedbacks.filter(x => x.action == 'None')
                            },
                        })

                        // Alignment Actions
                        Object.defineProperty(variant, 'alignmentIns', {
                            get: function() {
                                return variant.actions.filter(x => x.action == 'In')
                            },
                        })
                        Object.defineProperty(variant, 'alignmentOuts', {
                            get: function() {
                                return variant.actions.filter(x => x.action == 'Out')
                            },
                        })
                        Object.defineProperty(variant, 'alignmentFocus', {
                            get: function() {
                                return variant.actions.filter(x => x.action == 'Focus')
                            },
                        })
                        Object.defineProperty(variant, 'alignmentNds', {
                            get: function() {
                                return variant.actions.filter(x => x.action == 'None')
                            },
                        })

                        // DELIVERIES
                        Object.defineProperty(variant, 'deliveries', {
                            get: function() {
                                return variant.delivery_dates.map(delivery => {
                                    const deliveryObj = {
                                        delivery_date: delivery,
                                    }
                                    Object.defineProperty(deliveryObj, 'quantity', {
                                        get: function() {
                                            if (!variant.selectionAction) return 0
                                            const actionDelivery = variant.selectionAction.date_quantities.find(
                                                dateQty => dateQty.delivery_date == delivery
                                            )
                                            return actionDelivery.quantity
                                        },
                                        set: function(newQty) {
                                            if (!variant.selectionAction) return 0
                                            const actionDelivery = variant.selectionAction.date_quantities.find(
                                                dateQty => dateQty.delivery_date == delivery
                                            )
                                            actionDelivery.quantity = newQty
                                        },
                                    })
                                    return deliveryObj
                                })
                            },
                        })
                    })

                    product.selectionInputList.push(selectionInput)
                })
            )
        },
    },
    mutations: {
        SET_DISTRIBUTION_SCOPE(state, newScope) {
            state.distributionScope = newScope
        },
        SET_SELECTIONS(state, selections) {
            state.selections = selections
        },
        INSERT_SELECTIONS(state, selections) {
            selections.map(selection => {
                const exists = state.selections.find(x => x.id == selection.id)
                if (!exists) state.selections.push(selection)
            })
        },
        SET_SELECTION_USERS(state, users) {
            state.selectionUsers = users
        },
        INSERT_SELECTION_USERS(state, users) {
            users.map(user => {
                const exists = state.selectionUsers.find(x => x.id == user.id)
                if (!exists) state.selectionUsers.push(user)
            })
        },
    },
}
