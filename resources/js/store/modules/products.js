import axios from 'axios'
import Product from '../models/Product'

export default {
    namespaced: true,

    state: {
        loading: true,
        currentSingleProductId: -1,
        currentProductId: null,
        availableProductIds: [],
    },

    getters: {
        loadingProducts: state => {
            return state.loading
        },
        currentSingleProductId: state => {
            return state.currentSingleProductId
        },
        currentProductId: state => {
            return state.currentProductId
        },
        //   currentProduct: state => { return (state.currentProductId != null) ? Product.find(state.currentProductId) : null },
        products: (state, getters, rootState, rootGetters) => {
            if (!rootGetters['persist/loadingInit'] && !state.loading && rootGetters['persist/currentTask'] != null) {
                const products = Product.query()
                    .with(['actions.user.teams'])
                    .with(['comments.votes.user.teams', 'comments.user.teams', 'comments.team'])
                    .all()
                const actionScope = rootGetters['collection/actionScope']
                const currentTask = rootGetters['persist/currentTask']
                const userId = rootGetters['persist/authUser'].id
                const currentTeam = rootGetters['persist/currentTeam']
                const workspace = rootGetters['persist/currentWorkspace']
                const userPermissionLevel = rootGetters['persist/userPermissionLevel']
                const data = []
                products.forEach(product => {
                    product.color_variants = JSON.parse(product.color_variants)
                    product.prices = JSON.parse(product.prices)
                    product.ins = []
                    product.outs = []
                    product.focus = []
                    product.nds = []
                    product.ndsTotal
                    product.commentsScoped = []

                    // START Find current action for the product
                    if (currentTask.type == 'feedback')
                        product.currentAction = product.actions.find(
                            action => action.user_id == userId && action.task_id == currentTask.id
                        )
                    else product.currentAction = product.actions.find(action => action.task_id == currentTask.id)
                    // END Find current action for product

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

                        if (userPermissionLevel <= 4) {
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

                    // START scope comments to task
                    product.comments.forEach(comment => {
                        if (currentTask.type == 'feedback') {
                            if (comment.task_id == currentTask.id) product.commentsScoped.push(comment)
                        } else {
                            // If type is alignment
                            currentTask.parentTasks.forEach(parentTask => {
                                if (comment.task_id == parentTask.id) product.commentsScoped.push(comment)
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
                        product.nds = JSON.parse(JSON.stringify(currentTask.users))
                    } else {
                        // If type = Alignment -> Find the parent tasks
                        currentTask.parentTasks.forEach(parentTask => {
                            // if parent type is feedback -> push users
                            // else -> push task
                            if (parentTask.type == 'feedback')
                                product.nds = product.nds.concat(JSON.parse(JSON.stringify(parentTask.users)))
                            else product.nds.push(parentTask)
                        })
                    }
                    product.ndsTotal = product.nds.length
                    // END find Not decideds

                    // START Group actions by action type
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
                                        NDTaskIndex = product.nds.findIndex(task => task.id == action.task_id)
                                        product.nds.splice(NDTaskIndex, 1)
                                    }
                                }
                            })
                        }
                        // END Substract from NDs
                    })
                    // END Group actions by action type

                    data.push(product)
                })
                return data
            }
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
    },
}
