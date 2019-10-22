import axios from 'axios'
import Product from '../models/Product'

export default {
    namespaced: true,

    state: {
        loading: true,
        currentSingleProductId: -1,
        currentProductId: null,
        availableProductIds: [],
        selectedCategories: [],
        selectedDeliveryDates: [],
        unreadOnly: false,
        currentProductFilter: null,
    },

    getters: {
        loadingProducts: state => {
            return state.loading
        },
        currentSingleProductId: state => {
            return state.currentSingleProductId
        },
        selectedCategories: state => {
            return state.selectedCategories
        },
        selectedDeliveryDates: state => {
            return state.selectedDeliveryDates
        },
        unreadOnly: state => {
            return state.unreadOnly
        },
        currentProductFilter: state => {
            return state.currentProductFilter
        },
        products: (state, getters, rootState, rootGetters) => {
            if (!rootGetters['persist/loadingInit'] && !state.loading && rootGetters['persist/currentTask'] != null) {
                const products = Product.query()
                    .with(['actions.task|user.teams'])
                    .with(['comments.votes.user.teams', 'comments.user.teams', 'comments.team|task'])
                    .all()
                const currentTask = rootGetters['persist/currentTask']
                const userId = rootGetters['persist/authUser'].id
                const currentTeam = rootGetters['persist/currentTeam']
                const workspace = rootGetters['persist/currentWorkspace']
                const userPermissionLevel = rootGetters['persist/userPermissionLevel']
                const data = []
                products.forEach(product => {
                    product.color_variants = JSON.parse(product.color_variants)
                    product.assortments = JSON.parse(product.assortments)
                    product.prices = JSON.parse(product.prices)
                    product.ins = []
                    product.outs = []
                    product.focus = []
                    product.nds = []
                    product.ndsTotal
                    product.commentsScoped = []

                    // START Find current action for the product
                    if (currentTask.type == 'feedback') {
                        product.currentAction = product.actions.find(
                            action => action.user_id == userId && action.task_id == currentTask.id
                        )
                    } else {
                        product.currentAction = product.actions.find(action => action.task_id == currentTask.id)
                    }
                    // END Find current action for product

                    // START Find inherit from task
                    if (currentTask.inherit_from_id) {
                        product.inheritedAction = product.actions.find(x => x.task_id == currentTask.inherit_from_id)
                    }
                    // END

                    // START Find the correct price
                    // Check if the chosen currency exists on the product
                    if (product.prices != null) {
                        let workspacePrices = null
                        let teamPrices = null
                        if (workspace.currency != null)
                            workspacePrices = product.prices.find(x => x.currency == workspace.currency)
                        if (currentTeam)
                            if (currentTeam.currency != null)
                                teamPrices = product.prices.find(x => x.currency == currentTeam.currency)

                        if (userPermissionLevel < 3) {
                            // Use team currency for low level members
                            if (teamPrices != null) product.userPrices = teamPrices
                            else if (workspacePrices != null) product.userPrices = workspacePrices
                            else product.userPrices = product.prices[0]
                        } else {
                            // Use workspace currency for high level members
                            if (workspacePrices != null) product.userPrices = workspacePrices
                            else product.userPrices = product.prices[0]
                        }
                    }
                    // END Find the correct price

                    //START COMMENTS
                    product.requests = []

                    // START scope comments to task
                    product.comments.forEach(comment => {
                        if (
                            comment.task_id == currentTask.inherit_from_id ||
                            comment.task_id == currentTask.id ||
                            currentTask.filter_products_by_ids.includes(comment.task_id)
                        ) {
                            comment.is_request ? product.requests.push(comment) : product.commentsScoped.push(comment)
                        } else if (currentTask.type == 'feedback') {
                            if (comment.task_id == currentTask.id)
                                comment.is_request
                                    ? product.requests.push(comment)
                                    : product.commentsScoped.push(comment)
                        } else if (currentTask.type == 'approval') {
                            if (
                                currentTask.children[0]
                                    ? comment.task_id == currentTask.children[0].task_id
                                    : false || comment.task_id == currentTask.id
                            )
                                comment.is_request
                                    ? product.requests.push(comment)
                                    : product.commentsScoped.push(comment)
                        } else if (
                            !currentTask.parentTasks.find(x => x.type == 'approval') &&
                            currentTask.approvalParent
                        ) {
                            // CSM DECISION
                            if (
                                comment.task_id == currentTask.approvalParent.id ||
                                currentTask.parentTasks.find(x => x.id == comment.task_id) ||
                                currentTask.approvalParent.parentTasks.find(x => x.id == comment.task_id)
                            )
                                comment.is_request
                                    ? product.requests.push(comment)
                                    : product.commentsScoped.push(comment)
                        } else {
                            // If type is alignment
                            if (comment.task_id == currentTask.id)
                                comment.is_request
                                    ? product.requests.push(comment)
                                    : product.commentsScoped.push(comment)
                            currentTask.parentTasks.forEach(parentTask => {
                                if (comment.task_id == parentTask.id)
                                    comment.is_request
                                        ? product.requests.push(comment)
                                        : product.commentsScoped.push(comment)
                            })
                        }
                    })

                    // END scope comments to task

                    // START Comment votes
                    // Handle comment votes - group them by team
                    const comments = product.commentsScoped
                    comments.forEach(comment => {
                        comment.teamVotes = []
                        let noTeamExists = false
                        comment.votes.forEach(vote => {
                            if (vote.user != null) {
                                if (vote.user.teams.length > 0) {
                                    const found = comment.teamVotes.find(x => x.title == vote.user.teams[0].title)
                                    if (!found) {
                                        let voteTeam = vote.user.teams[0]
                                        let teamToPush = {
                                            id: voteTeam.id,
                                            title: voteTeam.title,
                                            votes: 1,
                                        }
                                        comment.teamVotes.push(teamToPush)
                                    } else {
                                        found.votes++
                                    }
                                } else {
                                    if (!noTeamExists) {
                                        comment.teamVotes.unshift({ id: 0, title: 'No team', votes: 0 })
                                        noTeamExists = true
                                    }
                                    comment.teamVotes[0].votes++
                                }
                            }
                        })
                    })
                    // END Comment votes

                    // END COMMENTS

                    // START Find Not decideds NDs
                    if (currentTask.type == 'feedback') {
                        // If type: Feedback -> Find all users with access to the task
                        product.nds = JSON.parse(JSON.stringify(currentTask.users)).map(x => {
                            x.task = currentTask
                            return x
                        })
                    } else {
                        // If type = Alignment -> Find the parent tasks
                        currentTask.parentTasks.forEach(parentTask => {
                            // if parent type is feedback -> push users
                            // else -> push task
                            if (parentTask.type == 'feedback')
                                product.nds = product.nds.concat(
                                    JSON.parse(JSON.stringify(parentTask.users)).map(x => {
                                        x.task = currentTask
                                        return x
                                    })
                                )
                            else product.nds.push(parentTask)
                        })
                    }
                    product.ndsTotal = product.nds.length
                    // END find Not decideds

                    // START Group actions by action type (DISTRIBUTION)
                    product.actions.forEach(action => {
                        if (currentTask.type == 'feedback') {
                            if (action.task_id == currentTask.id) {
                                if (action.action == 2) {
                                    product.focus.push(action)
                                } else if (action.action == 1) {
                                    product.ins.push(action)
                                } else if (action.action == 0) {
                                    product.outs.push(action)
                                }
                            }
                        } else {
                            currentTask.parentTasks.forEach(parentTask => {
                                if (action.task_id == parentTask.id) {
                                    if (action.action == 2) {
                                        product.focus.push(action)
                                    } else if (action.action == 1) {
                                        product.ins.push(action)
                                    } else if (action.action == 0) {
                                        product.outs.push(action)
                                    }
                                }
                            })
                        }
                        // START Subtract from NDs
                        if (currentTask.type == 'feedback') {
                            if (action.task_id == currentTask.id) {
                                let NDUserIndex = product.nds.findIndex(user => user.id == action.user_id)
                                product.nds.splice(NDUserIndex, 1)
                            }
                        } else {
                            // If type is alignment
                            currentTask.parentTasks.forEach(parentTask => {
                                if (parentTask.type == 'feedback') {
                                    // If the parent is type feedback
                                    if (action.task_id == parentTask.id) {
                                        let NDUserIndex = product.nds.findIndex(user => user.id == action.user_id)
                                        product.nds.splice(NDUserIndex, 1)
                                    }
                                } else {
                                    // If the parent is type alignment
                                    if (action.task_id == parentTask.id) {
                                        let NDTaskIndex = product.nds.findIndex(task => task.id == action.task_id)
                                        product.nds.splice(NDTaskIndex, 1)
                                    }
                                }
                            })
                        }
                        // END Substract from NDs
                    })
                    // END Group actions by action type

                    // START NEW Comment (Find products with unread / new comments)
                    if (product.comments.length > 0) {
                        if (
                            currentTask.type == 'approval' &&
                            product.currentAction == null &&
                            product.requests.length > 0
                        ) {
                            if (userPermissionLevel == 3) {
                                product.newComment =
                                    product.comments[product.comments.length - 1].user.role_id != 3 ||
                                    product.comments.length < 1
                            } else {
                                product.newComment = product.comments[product.comments.length - 1].user.role_id == 3
                            }
                        }
                    }
                    // END NEW Comment

                    // START Find OUT Products (Out by filter)
                    if (product.actions.length > 1 && currentTask.filter_products_by_ids) {
                        product.outInFilter = product.actions.find(
                            x => currentTask.filter_products_by_ids.includes(x.task_id) && x.action == 0
                        )
                    }
                    // END Find OUT Products

                    data.push(product)
                })

                return data
            }
        },
        productsScoped: (state, getters, rootState, rootGetters) => {
            const products = getters.products
            const currentTask = rootGetters['persist/currentTask']
            const currentTeam = rootGetters['persist/currentTeam']
            if (products) {
                let productsToReturn = []
                const inheritFromId = currentTask.inherit_from_id
                if (inheritFromId) {
                    productsToReturn = products.filter(product =>
                        product.actions.find(action => action.task_id == inheritFromId && action.action > 0)
                    )
                } else {
                    productsToReturn = products
                }

                if (currentTeam.category_scope) {
                    return productsToReturn.filter(product =>
                        currentTeam.category_scope.split(',').includes(product.category.toLowerCase())
                    )
                } else {
                    return productsToReturn
                }
            } else {
                return []
            }
        },
        productTotals(state, getters, rootState, rootGetters) {
            const products = getters.products
            const currentTask = rootGetters['persist/currentTask']
            const data = {
                products: 0,
                ins: 0,
                outs: 0,
                nds: 0,
                totalDecisionsToMake: 0,
            }
            if (products) {
                data.products = products.length
                products.forEach(product => {
                    if (product.outInFilter) {
                        data.outs++
                    } else if (product.currentAction == null) {
                        if (currentTask.type == 'approval') {
                            if (product.requests.length > 0) {
                                data.nds++
                            } else {
                                data.ins++
                            }
                        } else {
                            data.nds++
                        }
                    } else {
                        if (product.currentAction.action == 0) {
                            data.outs++
                        } else {
                            data.ins++
                        }
                    }

                    // Calculate how many product decisions have to be made in the task
                    if (currentTask.type == 'approval' && !product.outInFilter && product.requests.length > 0) {
                        data.totalDecisionsToMake++
                    } else if (currentTask.type == 'decision' && !product.outInFilter) {
                        data.totalDecisionsToMake++
                    }
                })
            }
            return data
        },
        productsScopedTotals(state, getters, rootState, rootGetters) {
            const products = getters.productsScoped
            const currentTask = rootGetters['persist/currentTask']
            const data = {
                products: 0,
                ins: 0,
                outs: 0,
                nds: 0,
                totalDecisionsToMake: 0,
            }
            if (products) {
                data.products = products.length
                products.forEach(product => {
                    if (product.outInFilter) {
                        data.outs++
                    } else if (product.currentAction == null) {
                        if (currentTask.type == 'approval') {
                            if (product.requests.length > 0) {
                                data.nds++
                            } else {
                                data.ins++
                            }
                        } else {
                            data.nds++
                        }
                    } else {
                        if (product.currentAction.action == 0) {
                            data.outs++
                        } else {
                            data.ins++
                        }
                    }

                    // Calculate how many product decisions have to be made in the task
                    if (currentTask.type == 'approval' && !product.outInFilter && product.requests.length > 0) {
                        data.totalDecisionsToMake++
                    } else if (currentTask.type == 'decision' && !product.outInFilter) {
                        data.totalDecisionsToMake++
                    }
                })
            }
            return data
        },
        productsFilteredByCategory(state, getters, rootState, rootGetters) {
            const products = getters.products
            const categories = getters.selectedCategories
            const deliveryDates = getters.selectedDeliveryDates
            const unreadOnly = getters.unreadOnly
            let productsToReturn = []

            if (products) {
                productsToReturn = products
                // First filter by category
                if (categories.length > 0) {
                    const filteredByCategory = productsToReturn.filter(product => {
                        return Array.from(categories).includes(product.category)
                    })
                    productsToReturn = filteredByCategory
                }
                // Filter by delivery date
                if (deliveryDates.length > 0) {
                    const filteredByDeliveryDate = productsToReturn.filter(product => {
                        return Array.from(deliveryDates).includes(product.delivery_date)
                    })
                    productsToReturn = filteredByDeliveryDate
                }

                // Filer by unread
                if (unreadOnly) {
                    const filteredByUnread = productsToReturn.filter(product => product.newComment)
                    productsToReturn = filteredByUnread
                }
            }

            return productsToReturn
        },
        productsScopedFilteredByCategory(state, getters, rootState, rootGetters) {
            const products = getters.productsScoped
            const categories = getters.selectedCategories
            const deliveryDates = getters.selectedDeliveryDates
            const unreadOnly = getters.unreadOnly
            let productsToReturn = []

            if (products) {
                productsToReturn = products
                // First filter by category
                if (categories.length > 0) {
                    const filteredByCategory = productsToReturn.filter(product => {
                        return Array.from(categories).includes(product.category)
                    })
                    productsToReturn = filteredByCategory
                }
                // Filter by delivery date
                if (deliveryDates.length > 0) {
                    const filteredByDeliveryDate = productsToReturn.filter(product => {
                        return Array.from(deliveryDates).includes(product.delivery_date)
                    })
                    productsToReturn = filteredByDeliveryDate
                }

                // Filer by unread
                if (unreadOnly) {
                    const filteredByUnread = productsToReturn.filter(product => product.newComment)
                    productsToReturn = filteredByUnread
                }
            }

            return productsToReturn
        },
        productsFiltered(state, getters, rootState, rootGetters) {
            const method = getters.currentProductFilter
            const products = getters.productsFilteredByCategory
            const currentTask = rootGetters['persist/currentTask']
            let productsToReturn = products

            // filter by in/out
            if (['ins', 'outs', 'nds'].includes(method)) {
                const filteredByAction = products.filter(product => {
                    if (method == 'nds') {
                        if (currentTask.type == 'approval') {
                            return product.currentAction == null && product.requests.length > 0
                        } else return product.currentAction == null && !product.outInFilter
                    } else if (method == 'ins') {
                        if (product.currentAction) return product.currentAction.action >= 1 && !product.outInFilter
                        if (currentTask.type == 'approval') {
                            if (product.inheritedAction && product.requests.length < 1)
                                return product.inheritedAction.action >= 1
                        }
                    } else if (method == 'outs') {
                        if (product.currentAction) return product.currentAction.action < 1
                        else if (product.outInFilter) return true
                    }
                })
                productsToReturn = filteredByAction
            }

            return productsToReturn
        },
        productsScopedFiltered(state, getters, rootState, rootGetters) {
            const method = getters.currentProductFilter
            const products = getters.productsScopedFilteredByCategory
            const currentTask = rootGetters['persist/currentTask']
            let productsToReturn = products

            // filter by in/out
            if (['ins', 'outs', 'nds'].includes(method)) {
                const filteredByAction = products.filter(product => {
                    if (method == 'nds') {
                        if (currentTask.type == 'approval') {
                            return product.currentAction == null && product.requests.length > 0
                        } else return product.currentAction == null && !product.outInFilter
                    } else if (method == 'ins') {
                        if (product.currentAction) return product.currentAction.action >= 1 && !product.outInFilter
                        if (currentTask.type == 'approval') {
                            if (product.inheritedAction && product.requests.length < 1)
                                return product.inheritedAction.action >= 1
                        }
                    } else if (method == 'outs') {
                        if (product.currentAction) return product.currentAction.action < 1
                        else if (product.outInFilter) return true
                    }
                })
                productsToReturn = filteredByAction
            }

            return productsToReturn
        },
        availableProductIds: state => {
            return state.availableProductIds
        },
        currentProduct: (state, getters, rootState, rootGetters) => {
            return state.currentProductId != null && getters.products != null
                ? getters.products.find(x => x.id == state.currentProductId)
                : null
        },
        nextProductId: (state, getters, rootState, rootGetters) => {
            if (state.currentProductId != null && getters.availableProductIds.length > 0) {
                const productIds = getters.availableProductIds
                const currentProductIndex = productIds.findIndex(x => x == state.currentProductId)
                if (currentProductIndex < productIds.length - 1) {
                    return productIds[currentProductIndex + 1]
                }
            }
        },
        prevProductId: (state, getters, rootState, rootGetters) => {
            if (state.currentProductId != null && getters.availableProductIds.length > 0) {
                const productIds = getters.availableProductIds
                const currentProductIndex = productIds.findIndex(x => x == state.currentProductId)
                if (currentProductIndex != 0) {
                    return productIds[currentProductIndex - 1]
                }
            }
        },
    },

    actions: {
        async fetchProducts({ commit }, file_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/file/${file_id}/products`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    Product.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in products.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        setCurrentProductId({ commit }, id) {
            commit('setCurrentProductId', id)
        },
        setAvailableProductIds({ commit }, products) {
            commit('setAvailableProductIds', products)
        },
        showNextProduct({ commit, getters }) {
            commit('setCurrentProductId', getters.nextProductId)
        },
        showPrevProduct({ commit, getters }) {
            commit('setCurrentProductId', getters.prevProductId)
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        setCurrentProductId(state, id) {
            state.currentProductId = id
        },
        setAvailableProductIds(state, products) {
            state.availableProductIds = products.map(x => x.id)
        },
        setCurrentProductId(state, id) {
            state.currentProductId = id
        },
        updateSelectedCategories(state, payload) {
            state.selectedCategories = payload
        },
        updateSelectedDeliveryDates(state, payload) {
            state.selectedDeliveryDates = payload
        },
        setUnreadOnly(state, payload) {
            state.unreadOnly = payload
        },
        setCurrentProductFilter(state, payload) {
            state.currentProductFilter = payload
        },
    },
}
