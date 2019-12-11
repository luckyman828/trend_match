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
        selectedBuyerGroups: [],
        unreadOnly: false,
        currentProductFilter: 'overview',
        singleVisible: false,
        productScope: null,
        actionsUpdated: false,
        actionsCreated: false,
        commentsUpdated: false,
        commentsCreated: false,
        productsStatic: null,
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
        selectedBuyerGroups: state => {
            return state.selectedBuyerGroups
        },
        unreadOnly: state => {
            return state.unreadOnly
        },
        currentProductFilter: state => {
            return state.currentProductFilter
        },
        singleVisible: state => {
            return state.singleVisible
        },
        productScope: state => {
            return state.productScope
        },
        actionsUpdated: state => {
            return state.actionsUpdated
        },
        commentsUpdated: state => {
            return state.commentsUpdated
        },
        actionsCreated: state => {
            return state.actionsCreated
        },
        commentsCreated: state => {
            return state.commentsCreated
        },
        productsStatic: state => {
            return state.productsStatic
        },
        productsTest: (state, getters, rootState, rootGetters) => {
            if (!rootGetters['persist/loadingInit']) {
                const products = Product.query()
                    .with(['actions'])
                    .all()
                console.log('Products in store saying hello')

                products.forEach(product => {
                    product.ins = []
                    product.outs = []
                    product.focus = []
                    product.nds = []
                    product.ndsTotal
                    product.commentsScoped = []
                    product.commentsInherited = []
                    product.outInFilter = false

                    let stateProduct = {}
                    if (product.isNew || product.actionsUpdated || product.commentsUpdated) {
                        stateProduct = Product.find(product.id)
                    }
                    // Test that the JSON objects are valid JSON
                    if (product.isNew || product.actionsUpdated) {
                        stateProduct.actionLength = product.actions.length
                    }

                    if (product.isNew || product.actionsUpdated || product.commentsUpdated) {
                        stateProduct.isNew = false
                        stateProduct.actionsUpdated = false
                    }
                })
                console.log('Products in store done saying hello')
                return products
            }
        },
        productsRaw: (state, getters, rootState, rootGetters) => {
            if (!rootGetters['persist/loadingInit']) {
                const products = Product.query().all()
                products.forEach(product => {
                    // Test that the JSON objects are valid JSON

                    if (typeof product.color_variants == 'string' && isJSON(product.color_variants))
                        product.color_variants = JSON.parse(product.color_variants)
                    if (typeof product.assortments == 'string' && isJSON(product.assortments))
                        product.assortments = JSON.parse(product.assortments)
                    if (typeof product.prices == 'string' && isJSON(product.prices))
                        product.prices = JSON.parse(product.prices)

                    function isJSON(str) {
                        try {
                            return JSON.parse(str) && !!str
                        } catch (e) {
                            return false
                        }
                    }
                    if (product.isNew) {
                        product.anArray = 'test'
                    }
                })
                return products
            }
        },
        products: (state, getters, rootState, rootGetters) => {
            if (!rootGetters['persist/loadingInit'] && !state.loading && rootGetters['persist/currentTask'] != null) {
                const products = Product.query()
                    .with(['actions.task|user.teams'])
                    .with(['comments.votes.user.teams', 'comments.user.teams', 'comments.team|task'])
                    .all()
                const currentTask = rootGetters['persist/currentTask']
                const authUser = rootGetters['persist/authUser']
                const currentTeam = rootGetters['persist/currentTeam']
                const workspace = rootGetters['persist/currentWorkspace']
                const userPermissionLevel = rootGetters['persist/userPermissionLevel']
                const data = []
                // const inheritFromId = currentTask.inherit_from_id
                const inheritFromTask = currentTask.inheritFromTask
                products.forEach(product => {
                    // START Product is new
                    // // if (product.isNew) {
                    // //     console.log('Processing IsNew')
                    // // const stateProduct = Product.find(product.id)
                    // // Test that the JSON objects are valid JSON

                    // if (typeof product.color_variants == 'string' && isJSON(product.color_variants))
                    //     product.color_variants = JSON.parse(product.color_variants)
                    // if (typeof product.assortments == 'string' && isJSON(product.assortments))
                    //     product.assortments = JSON.parse(product.assortments)
                    // if (typeof product.prices == 'string' && isJSON(product.prices))
                    //     product.prices = JSON.parse(product.prices)

                    // function isJSON(str) {
                    //     try {
                    //         return JSON.parse(str) && !!str
                    //     } catch (e) {
                    //         return false
                    //     }
                    // }

                    product.ins = []
                    product.outs = []
                    product.focus = []
                    product.nds = []
                    product.ndsTotal
                    product.commentsScoped = []
                    product.commentsInherited = []
                    product.outInFilter = false

                    // // START Find the correct price
                    // // Check if the chosen currency exists on the product
                    // if (product.prices != null) {
                    //     // First check if the user currency is available
                    //     if (authUser.currency && product.prices.find(x => x.currency == authUser.currency)) {
                    //         const userPrices = product.prices.find(x => x.currency == authUser.currency)
                    //         product.userPrices = userPrices
                    //     }
                    //     // Then check if the team currency is available
                    //     else if (
                    //         currentTeam &&
                    //         currentTeam.currency &&
                    //         product.prices.find(x => x.currency == currentTeam.currency)
                    //     ) {
                    //         const teamPrices = product.prices.find(x => x.currency == currentTeam.currency)
                    //         product.userPrices = teamPrices
                    //     }
                    //     // Then check if the workspace currency is available
                    //     else if (workspace.currency && product.prices.find(x => x.currency == workspace.currency)) {
                    //         const workspacePrices = product.prices.find(x => x.currency == workspace.currency)
                    //         product.userPrices = workspacePrices
                    //     }
                    //     // Else use the first available currency
                    //     else {
                    //         product.userPrices = product.prices[0]
                    //     }
                    // }
                    // // If there are no prices
                    // else {
                    //     product.userPrices = {
                    //         currency: 'unset',
                    //         markup: null,
                    //         recommended_retail_price: null,
                    //         wholesale_price: null,
                    //     }
                    // }
                    // END Find the correct price
                    //     stateProduct.isNew = false
                    // }
                    // END Product is new

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
                                currentTask.children.length > 0 // children are actually parents
                                    ? currentTask.children.find(x => x.task_id == comment.task_id)
                                    : false || comment.task_id == currentTask.id
                            )
                                comment.is_request
                                    ? product.requests.push(comment)
                                    : product.commentsScoped.push(comment)
                        } else if (currentTask.type == 'decision') {
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
                            // If current task type is alignment
                            if (
                                comment.task_id == currentTask.id ||
                                currentTask.siblings.find(x => x.parent_id == comment.task_id) ||
                                currentTask.parentTasks.find(x => x.id == comment.task_id)
                            )
                                comment.is_request
                                    ? product.requests.push(comment)
                                    : product.commentsScoped.push(comment)
                        }

                        // START Find inherited comments

                        if (currentTask.type == 'decision' && inheritFromTask.type == 'alignment') {
                            if (
                                (inheritFromTask.parentTasks.find(x => x.id == comment.task_id) ||
                                    comment.task_id == inheritFromTask.id) &&
                                !comment.is_request
                            ) {
                                product.commentsInherited.push(comment)
                            }
                        }

                        // END Find inherited comments
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
                            if (parentTask.type == 'feedback') {
                                product.nds = product.nds.concat(
                                    JSON.parse(JSON.stringify(parentTask.users)).map(x => {
                                        x.task = parentTask
                                        return x
                                    })
                                )
                            } else product.nds.push(parentTask)
                        })
                    }
                    product.ndsTotal = product.nds.length
                    // END find Not decideds

                    // // START Group actions by action type (DISTRIBUTION)
                    // product.actions.forEach(action => {
                    //     // START Find OUT Products (Out by filter)
                    //     if (
                    //         currentTask.filter_products_by_ids &&
                    //         currentTask.filter_products_by_ids.includes(action.task_id) &&
                    //         action.action == 0
                    //     )
                    //         product.outInFilter = action
                    //     // END Find OUT Products

                    //     // START Find current action for the product
                    //     if (currentTask.type == 'feedback') {
                    //         if (action.user_id == userId && action.task_id == currentTask.id)
                    //             product.currentAction = action
                    //     } else {
                    //         if (action.task_id == currentTask.id) product.currentAction = action
                    //     }
                    //     // END Find current action for product

                    //     // START Find inherit from task
                    //     if (currentTask.inherit_from_id) {
                    //         product.inheritedAction = product.actions.find(
                    //             x => x.task_id == currentTask.inherit_from_id
                    //         )
                    //     }
                    //     // END

                    //     if (currentTask.type == 'decision' && inheritFromTask.type == 'alignment') {
                    //         if (inheritFromTask.parentTasks.find(x => x.id == action.task_id)) {
                    //             if (action.action == 2) {
                    //                 product.focus.push(action)
                    //             } else if (action.action == 1) {
                    //                 product.ins.push(action)
                    //             } else if (action.action == 0) {
                    //                 product.outs.push(action)
                    //             }
                    //         }
                    //     } else if (currentTask.type == 'feedback') {
                    //         if (action.task_id == currentTask.id) {
                    //             if (action.action == 2) {
                    //                 product.focus.push(action)
                    //             } else if (action.action == 1) {
                    //                 product.ins.push(action)
                    //             } else if (action.action == 0) {
                    //                 product.outs.push(action)
                    //             }
                    //         }
                    //     } else {
                    //         currentTask.parentTasks.forEach(parentTask => {
                    //             if (action.task_id == parentTask.id) {
                    //                 if (action.action == 2) {
                    //                     product.focus.push(action)
                    //                 } else if (action.action == 1) {
                    //                     product.ins.push(action)
                    //                 } else if (action.action == 0) {
                    //                     product.outs.push(action)
                    //                 }
                    //             }
                    //         })
                    //     }
                    //     // START Subtract from NDs
                    //     if (currentTask.type == 'feedback') {
                    //         if (action.task_id == currentTask.id) {
                    //             let NDUserIndex = product.nds.findIndex(user => user.id == action.user_id)
                    //             product.nds.splice(NDUserIndex, 1)
                    //         }
                    //     } else {
                    //         // If type is alignment
                    //         currentTask.parentTasks.forEach(parentTask => {
                    //             if (parentTask.type == 'feedback') {
                    //                 // If the parent is type feedback
                    //                 if (action.task_id == parentTask.id) {
                    //                     let NDUserIndex = product.nds.findIndex(user => user.id == action.user_id)
                    //                     product.nds.splice(NDUserIndex, 1)
                    //                 }
                    //             } else {
                    //                 // If the parent is type alignment
                    //                 if (action.task_id == parentTask.id) {
                    //                     let NDTaskIndex = product.nds.findIndex(task => task.id == action.task_id)
                    //                     product.nds.splice(NDTaskIndex, 1)
                    //                 }
                    //             }
                    //         })
                    //     }
                    //     // END Substract from NDs
                    // })
                    // // END Group actions by action type

                    // // START NEW Comment (Find products with unread / new comments)
                    // if (product.comments.length > 0) {
                    //     if (
                    //         currentTask.type == 'approval' &&
                    //         product.currentAction == null &&
                    //         product.requests.length > 0
                    //     ) {
                    //         if (userPermissionLevel == 3) {
                    //             product.newComment =
                    //                 product.comments[product.comments.length - 1].user.role_id != 3 ||
                    //                 product.comments.length < 1
                    //         } else {
                    //             product.newComment = product.comments[product.comments.length - 1].user.role_id == 3
                    //         }
                    //     }
                    // }
                    // // END NEW Comment

                    // // START Mark comments as FOCUS if the users action was IN for the product
                    // product.comments.forEach(comment => {
                    //     if (currentTask.type == 'feedback') {
                    //         comment.focus = product.actions.find(
                    //             x => x.task_id == comment.task_id && x.user_id == comment.user_id && x.action == 2
                    //         )
                    //     } else {
                    //         comment.focus = product.actions.find(x =>
                    //             x.task.type == 'feedback'
                    //                 ? x.task_id == comment.task_id && x.action == 2 && x.user_id == comment.user_id
                    //                 : x.task_id == comment.task_id && x.action == 2
                    //         )
                    //     }
                    // })

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
                productsToReturn = products

                if (currentTeam.category_scope && currentTask.taskTeams.find(x => x.team_id == currentTeam.id)) {
                    return productsToReturn.filter(product =>
                        currentTeam.category_scope
                            .toLowerCase()
                            .split(',')
                            .includes(product.category.toLowerCase())
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
                                if (product.inheritedAction && product.inheritedAction.action == 0) {
                                    data.outs++
                                } else {
                                    data.ins++
                                }
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
        productsScopedFilteredTotals(state, getters, rootState, rootGetters) {
            const products = getters.productsScopedFilteredByCategory
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
                    } else if (currentTask.type == 'decision') {
                        if (product.currentAction) {
                            if (product.currentAction.action == 0) {
                                data.outs++
                            } else {
                                data.ins++
                            }
                        } else if (product.inheritedAction) {
                            if (product.inheritedAction.action == 0) {
                                data.outs++
                            } else {
                                data.ins++
                            }
                        }
                    } else if (product.currentAction == null) {
                        if (currentTask.type == 'approval') {
                            if (product.requests.length > 0) {
                                data.nds++
                            } else {
                                if (product.inheritedAction && product.inheritedAction.action == 0) {
                                    data.outs++
                                } else {
                                    data.ins++
                                }
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
                        // data.totalDecisionsToMake++
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
            const buyerGroups = getters.selectedBuyerGroups
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
                // Filter by buyer group
                if (buyerGroups.length > 0) {
                    const filteredByBuyerGroups = productsToReturn.filter(product => {
                        return Array.from(buyerGroups).includes(product.buyer_group)
                    })
                    productsToReturn = filteredByBuyerGroups
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
            const buyerGroups = getters.selectedBuyerGroups
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
                if (buyerGroups.length > 0) {
                    const filteredByBuyerGroups = productsToReturn.filter(product => {
                        return Array.from(buyerGroups).includes(product.buyer_group)
                    })
                    productsToReturn = filteredByBuyerGroups
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
                        return (
                            ((product.inheritedAction && product.inheritedAction.action >= 1) ||
                                (product.currentAction && product.currentAction.action >= 1)) &&
                            !product.outInFilter
                        )
                    } else if (method == 'outs') {
                        return (
                            (product.inheritedAction && product.inheritedAction.action < 1) ||
                            (product.currentAction && product.currentAction.action < 1) ||
                            product.outInFilter
                        )
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
                        } else if (currentTask.type == 'decision') {
                            return false
                        } else return product.currentAction == null && !product.outInFilter
                    } else if (method == 'ins') {
                        if (product.currentAction) return product.currentAction.action >= 1 && !product.outInFilter
                        else if (currentTask.type == 'decision' && !product.outInFilter) {
                            if (product.inheritedAction) return product.inheritedAction.action >= 1
                        } else if (currentTask.type == 'approval') {
                            return (
                                ((product.requests.length < 1 &&
                                    product.inheritedAction &&
                                    product.inheritedAction.action >= 1) ||
                                    (product.currentAction && product.currentAction.action >= 1)) &&
                                !product.outInFilter
                            )
                        }
                    } else if (method == 'outs') {
                        if (product.outInFilter) return true
                        else if (product.currentAction) return product.currentAction.action < 1
                        else if (currentTask.type == 'decision') {
                            if (product.inheritedAction) return product.inheritedAction.action == 0
                        } else if (currentTask.type == 'approval') {
                            return (
                                (product.inheritedAction && product.inheritedAction.action < 1) ||
                                (product.currentAction && product.currentAction.action < 1) ||
                                product.outInFilter
                            )
                        }
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
        currentProductv1: (state, getters, rootState, rootGetters) => {
            const products = getters[getters.productScope]
            return state.currentProductId != null && products != null
                ? products.find(x => x.id == state.currentProductId)
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

        productsFilteredv1(state, getters, rootState, rootGetters) {
            const products = getters[getters.productScope]

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
    },

    actions: {
        async fetchProducts({ commit, dispatch }, file_id) {
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
                    dispatch('instantiateProducts')
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
        showSingle({ commit }, id) {
            commit('setCurrentProductId', id)
            commit('setSingleVisisble', true)
        },
        instantiateNewProduct({ commit }, { id, fileId }) {
            console.log('instantiating new product in store with id: ' + id + ', and file id: ' + fileId)
            Product.insert({
                data: { id: id, collection_id: fileId, title: 'Unnamed product' },
            })
            // Product.insert({ data: product })
        },
        async updateProduct({ commit }, product) {
            console.log('updating product in store')
            product.prices = JSON.stringify(product.prices)
            product.color_variants = JSON.stringify(product.color_variants)
            product.assortments = JSON.stringify(product.assortments)
            commit('updateProduct', product)

            await axios
                .put(`/api/product`, {
                    id: product.id,
                    title: product.title,
                    prices: product.prices,
                    assortments: product.assortments,
                    color_variants: product.color_variants,
                    quantity: product.quantity,
                    delivery_date: product.delivery_date,
                    composition: product.composition,
                    category: product.category,
                    description: product.sale_description,
                    collection_id: product.collection_id,
                    datasource_id: product.datasource_id,
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err.response)
                })
        },
        async rotateImage({ commit }, file) {
            // Upload images to Blob storage
            let imageToReturn

            const uploadApiUrl = `/api/product/rotate-img`
            const axiosConfig = {
                // headers: {
                //     'Content-Type': 'multipart/form-data',
                // },
            }

            // Append the file
            let data = new FormData()
            data.append('file', file)
            console.log('Send rotate image request from store')

            await axios
                .post(uploadApiUrl, data, axiosConfig)
                .then(response => {
                    console.log('returning image')
                    imageToReturn = response.data
                })
                .catch(err => {
                    imageToReturn = false
                    console.log('error')
                    console.log(err.response)
                })
            return imageToReturn
        },
        async uploadImages({ commit, dispatch }, { files, callback }) {
            // Upload images to Blob storage
            let uploadSucces = false
            let uploadPercentage = 0

            const uploadApiUrl = `/api/product/images`
            const axiosConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: progressEvent => {
                    uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100))
                    return callback(uploadPercentage)
                },
            }

            // Append the files
            let data = new FormData()
            let count = 0
            files.forEach(file => {
                count++
                data.append('files[' + count + ']', file.file, file.id)
            })
            console.log(count + ' images sent to API from store')

            await axios
                .post(uploadApiUrl, data, axiosConfig)
                .then(response => {
                    console.log(response.data)
                    uploadSucces = true
                })
                .catch(err => {
                    console.log('error')
                    console.log(err.response)
                    uploadSucces = false
                })
            return uploadSucces
        },
        async deleteImages({ commit }, imagesToDelete) {
            await axios
                .delete(`/api/product/images`, {
                    data: {
                        ids: imagesToDelete,
                    },
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err.response)
                })
        },
        async deleteProduct({ commit }, productId) {
            console.log('Deleting product in store')

            await axios
                .delete(`/api/product`, {
                    data: {
                        id: productId,
                    },
                })
                .then(response => {
                    console.log('product deleted!')
                    Product.delete(productId)
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err.response)
                    commit('alertError')
                })
        },
        instantiateProducts({ state, rootGetters }) {
            const authUser = rootGetters['persist/authUser']
            const currentTeam = rootGetters['persist/currentTeam']
            const workspace = rootGetters['persist/currentWorkspace']

            // Get the products
            const products = Product.all()

            // START Loop through each product and instantiate their initial data
            products.forEach(product => {
                // Instantiate properties
                product.ins = []
                product.outs = []
                product.focus = []
                product.nds = []
                product.ndsTotal
                product.commentsScoped = []
                product.commentsInherited = []
                product.requests = []
                product.outInFilter = false

                // START Parse the json objects to javascript objects
                // Test that each json object is actually valid json before trying to parse it
                if (typeof product.color_variants == 'string' && isJSON(product.color_variants))
                    product.color_variants = JSON.parse(product.color_variants)
                if (typeof product.assortments == 'string' && isJSON(product.assortments))
                    product.assortments = JSON.parse(product.assortments)
                if (typeof product.prices == 'string' && isJSON(product.prices))
                    product.prices = JSON.parse(product.prices)

                function isJSON(str) {
                    try {
                        return JSON.parse(str) && !!str
                    } catch (e) {
                        return false
                    }
                }
                // END Parse the json objects to javascript objects

                // START Find the correct price
                // Check if the chosen currency exists on the product
                if (product.prices != null) {
                    // First check if the user currency is available
                    if (authUser.currency && product.prices.find(x => x.currency == authUser.currency)) {
                        const userPrices = product.prices.find(x => x.currency == authUser.currency)
                        product.userPrices = userPrices
                    }
                    // Then check if the team currency is available
                    else if (
                        currentTeam &&
                        currentTeam.currency &&
                        product.prices.find(x => x.currency == currentTeam.currency)
                    ) {
                        const teamPrices = product.prices.find(x => x.currency == currentTeam.currency)
                        product.userPrices = teamPrices
                    }
                    // Then check if the workspace currency is available
                    else if (workspace.currency && product.prices.find(x => x.currency == workspace.currency)) {
                        const workspacePrices = product.prices.find(x => x.currency == workspace.currency)
                        product.userPrices = workspacePrices
                    }
                    // Else use the first available currency
                    else {
                        product.userPrices = product.prices[0]
                    }
                }
                // If there are no prices
                else {
                    product.userPrices = {
                        currency: 'unset',
                        markup: null,
                        recommended_retail_price: null,
                        wholesale_price: null,
                    }
                }
                // END Find the correct price
            })
            // END Loop

            // Save the products to our state
            state.productsStatic = products
        },
        markNewComments({ state, rootGetters }, { product, productToUpdate }) {
            const currentTask = rootGetters['persist/currentTask']

            // START NEW Comment (Find products with unread / new comments)
            if (product.comments.length > 0) {
                if (currentTask.type == 'approval' && product.currentAction == null && product.requests.length > 0) {
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
        },
        markCommentsAsFocus({ state, rootGetters }, { productToUpdate }) {
            const currentTask = rootGetters['persist/currentTask']
            console.log('Marking comments as focus!')
            const allComments = productToUpdate.commentsScoped
                .concat(productToUpdate.requests)
                .concat(productToUpdate.commentsInherited)
            console.log(allComments)
            // START Mark comments as FOCUS if the users action was IN for the product
            if (allComments.length > 0) {
                allComments.forEach(comment => {
                    if (currentTask.type == 'feedback') {
                        comment.focus = product.actions.find(
                            x => x.task_id == comment.task_id && x.user_id == comment.user_id && x.action == 2
                        )
                    } else {
                        comment.focus = product.actions.find(x =>
                            x.task.type == 'feedback'
                                ? x.task_id == comment.task_id && x.action == 2 && x.user_id == comment.user_id
                                : x.task_id == comment.task_id && x.action == 2
                        )
                    }
                })
            }
            // END Mark comments as FOCUS if the users action was IN for the product
        },
        updateComments({ commit, state, rootGetters, dispatch }, productId, staticProduct) {
            console.log('I will update the COMMENTS of: ' + productId)
            const product = Product.query()
                .with(['comments.votes.user.teams', 'comments.user.teams', 'comments.team|task'])
                .find(productId)
            const productToUpdate = staticProduct ? staticProduct : state.productsStatic.find(x => x.id == productId)

            const currentTask = rootGetters['persist/currentTask']
            const authUser = rootGetters['persist/authUser']
            const userId = authUser.id
            const inheritFromTask = currentTask.inheritFromTask

            // Reset product comment related properties
            productToUpdate.commentsScoped = []
            productToUpdate.commentsInherited = []
            productToUpdate.requests = []

            //START COMMENTS

            // START scope comments to task
            product.comments.forEach(comment => {
                if (
                    comment.task_id == currentTask.inherit_from_id ||
                    comment.task_id == currentTask.id ||
                    currentTask.filter_products_by_ids.includes(comment.task_id)
                ) {
                    comment.is_request
                        ? productToUpdate.requests.push(comment)
                        : productToUpdate.commentsScoped.push(comment)
                } else if (currentTask.type == 'feedback') {
                    if (comment.task_id == currentTask.id)
                        comment.is_request
                            ? productToUpdate.requests.push(comment)
                            : productToUpdate.commentsScoped.push(comment)
                } else if (currentTask.type == 'approval') {
                    if (
                        currentTask.children.length > 0 // children are actually parents
                            ? currentTask.children.find(x => x.task_id == comment.task_id)
                            : false || comment.task_id == currentTask.id
                    )
                        comment.is_request
                            ? productToUpdate.requests.push(comment)
                            : productToUpdate.commentsScoped.push(comment)
                } else if (currentTask.type == 'decision') {
                    // CSM DECISION
                    if (
                        comment.task_id == currentTask.approvalParent.id ||
                        currentTask.parentTasks.find(x => x.id == comment.task_id) ||
                        currentTask.approvalParent.parentTasks.find(x => x.id == comment.task_id)
                    )
                        comment.is_request
                            ? productToUpdate.requests.push(comment)
                            : productToUpdate.commentsScoped.push(comment)
                } else {
                    // If current task type is alignment
                    if (
                        comment.task_id == currentTask.id ||
                        currentTask.siblings.find(x => x.parent_id == comment.task_id) ||
                        currentTask.parentTasks.find(x => x.id == comment.task_id)
                    )
                        comment.is_request
                            ? productToUpdate.requests.push(comment)
                            : productToUpdate.commentsScoped.push(comment)
                }

                // START Find inherited comments

                if (currentTask.type == 'decision' && inheritFromTask.type == 'alignment') {
                    if (
                        (inheritFromTask.parentTasks.find(x => x.id == comment.task_id) ||
                            comment.task_id == inheritFromTask.id) &&
                        !comment.is_request
                    ) {
                        productToUpdate.commentsInherited.push(comment)
                    }
                }

                // END Find inherited comments
            })

            // END scope comments to task

            // START Comment votes
            // Handle comment votes - group them by team
            product.commentsScoped.forEach(comment => {
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

            // Mark new comments
            dispatch('markNewComments', { product: product, productToUpdate: productToUpdate })

            // Marks comments as focus
            dispatch('markCommentsAsFocus', { product: product, productToUpdate: productToUpdate })
        },
        updateActions({ commit, state, rootGetters, dispatch }, productId, staticProduct) {
            console.log('I will update the ACTIONS of: ' + productId)
            const product = Product.query()
                .with(['actions.task|user.teams'])
                .find(productId)
            const productToUpdate = staticProduct ? staticProduct : state.productsStatic.find(x => x.id == productId)

            const currentTask = rootGetters['persist/currentTask']
            const authUser = rootGetters['persist/authUser']
            const userId = authUser.id
            const inheritFromTask = currentTask.inheritFromTask

            // Reset product action related properties
            productToUpdate.ins = []
            productToUpdate.outs = []
            productToUpdate.focus = []
            productToUpdate.outInFilter = false

            // START Group actions by action type (DISTRIBUTION)
            product.actions.forEach(action => {
                // START Find OUT Products (Out by filter)
                if (
                    currentTask.filter_products_by_ids &&
                    currentTask.filter_products_by_ids.includes(action.task_id) &&
                    action.action == 0
                )
                    productToUpdate.outInFilter = action
                // END Find OUT Products

                // START Find current action for the product
                if (currentTask.type == 'feedback') {
                    if (action.user_id == userId && action.task_id == currentTask.id)
                        productToUpdate.currentAction = action
                } else {
                    if (action.task_id == currentTask.id) productToUpdate.currentAction = action
                }
                // END Find current action for product

                // START Find inherit from task
                if (currentTask.inherit_from_id) {
                    productToUpdate.inheritedAction = product.actions.find(
                        x => x.task_id == currentTask.inherit_from_id
                    )
                }
                // END

                if (currentTask.type == 'decision' && inheritFromTask.type == 'alignment') {
                    if (inheritFromTask.parentTasks.find(x => x.id == action.task_id)) {
                        if (action.action == 2) {
                            productToUpdate.focus.push(action)
                        } else if (action.action == 1) {
                            productToUpdate.ins.push(action)
                        } else if (action.action == 0) {
                            productToUpdate.outs.push(action)
                        }
                    }
                } else if (currentTask.type == 'feedback') {
                    if (action.task_id == currentTask.id) {
                        if (action.action == 2) {
                            productToUpdate.focus.push(action)
                        } else if (action.action == 1) {
                            productToUpdate.ins.push(action)
                        } else if (action.action == 0) {
                            productToUpdate.outs.push(action)
                        }
                    }
                } else {
                    currentTask.parentTasks.forEach(parentTask => {
                        if (action.task_id == parentTask.id) {
                            if (action.action == 2) {
                                productToUpdate.focus.push(action)
                            } else if (action.action == 1) {
                                productToUpdate.ins.push(action)
                            } else if (action.action == 0) {
                                productToUpdate.outs.push(action)
                            }
                        }
                    })
                }
                // START Subtract from NDs
                if (productToUpdate.nds) {
                    if (currentTask.type == 'feedback') {
                        if (action.task_id == currentTask.id) {
                            let NDUserIndex = productToUpdate.nds.findIndex(user => user.id == action.user_id)
                            if (NDUserIndex) productToUpdate.nds.splice(NDUserIndex, 1)
                        }
                    } else {
                        // If type is alignment
                        currentTask.parentTasks.forEach(parentTask => {
                            if (parentTask.type == 'feedback') {
                                // If the parent is type feedback
                                if (action.task_id == parentTask.id) {
                                    let NDUserIndex = productToUpdate.nds.findIndex(user => user.id == action.user_id)
                                    if (NDUserIndex) productToUpdate.nds.splice(NDUserIndex, 1)
                                }
                            } else {
                                // If the parent is type alignment
                                if (action.task_id == parentTask.id) {
                                    let NDTaskIndex = productToUpdate.nds.findIndex(task => task.id == action.task_id)
                                    if (NDTaskIndex) productToUpdate.nds.splice(NDTaskIndex, 1)
                                }
                            }
                        })
                    }
                    // END Substract from NDs
                }
            })
            // END Group actions by action type

            // Mark new comments
            dispatch('markNewComments', { product: product, productToUpdate: productToUpdate })

            // Marks comments as focus
            dispatch('markCommentsAsFocus', { productToUpdate: productToUpdate })
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
        setAvailableProductIds(state, ids) {
            state.availableProductIds = ids
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
        updateSelectedBuyerGroups(state, payload) {
            state.selectedBuyerGroups = payload
        },
        setUnreadOnly(state, payload) {
            state.unreadOnly = payload
        },
        setCurrentProductFilter(state, payload) {
            state.currentProductFilter = payload
        },
        setSingleVisisble(state, payload) {
            state.singleVisible = payload
        },
        setProductScope(state, productScope) {
            state.productScope = productScope
        },
        updateProduct(state, product) {
            product.updated_at = new Date()
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ')
            Product.insert({ data: product })
        },
        alertError: state => {
            window.alert('Network error. Please check your connection')
        },
        setActionsCreated: state => {
            console.log('Setting actions created')
            state.actionsCreated = true
        },
        setActionsUpdated: (state, productId) => {
            state.actionsUpdated = true
            // Find the product in question
            Product.find(productId).actionsUpdated = true
        },
        setCommentsCreated: state => {
            state.commentsCreated = true
        },
        setCommentsUpdated: (state, productId) => {
            state.commentsUpdated = true
            // Find the product in question
            Product.find(productId).commentsUpdated = true
        },
    },
}
