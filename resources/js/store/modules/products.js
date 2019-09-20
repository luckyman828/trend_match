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
            if (!rootGetters['persist/loadingInit'] && !state.loading) {
                const products = Product.query()
                    .with(['actions.user.teams'])
                    .with(['comments.votes.user.teams', 'comments.user.teams', 'comments.team'])
                    .with('productFinalAction')
                    .with('teamActions.team')
                    .with('phaseActions')
                    .all()
                const userId = rootGetters['persist/authUser'].id
                const teamFilterId = rootGetters['persist/currentTeamId']
                const currentTeam = rootGetters['persist/currentTeam']
                const currentFile = rootGetters['entities/collections/currentFile']
                const teamUsers = rootGetters['entities/collections/currentTeamUsers']
                const workspace = rootGetters['persist/currentWorkspace']
                const userPermissionLevel = rootGetters['persist/userPermissionLevel']
                const viewAdminPermissionLevel = rootGetters['persist/viewAdminPermissionLevel']
                const data = []
                products.forEach(product => {
                    product.color_variants = JSON.parse(product.color_variants)
                    product.prices = JSON.parse(product.prices)
                    product.ins = []
                    product.outs = []
                    product.focus = []
                    product.nds = []
                    product.userAction = product.actions.find(x => x.user_id == userId)
                    product.commentsScoped = []
                    product.teamAction = product.teamActions.find(x => x.team_id == teamFilterId)
                    product.phaseAction = product.phaseActions.find(x => x.phase_id == 1)

                    // Find the correct price
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

                    const comments = product.comments

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
                    // Scope votes to current team filter
                    comments.forEach(comment => {
                        comment.votesScoped = []
                        comment.votes.forEach(vote => {
                            const found = teamUsers.find(x => x.id == vote.user.id)
                            if (found) comment.votesScoped.push(vote)
                        })
                    })

                    // Scope comments to current teamFilter

                    // If the user is a buyer function, only return global comments
                    if (userPermissionLevel == viewAdminPermissionLevel) {
                        comments.forEach(comment => {
                            if (comment.team_id == 0) product.commentsScoped.push(comment)
                        })
                    } else if (teamFilterId > 0) {
                        // Loop through the comments
                        comments.forEach(comment => {
                            // Loop through comments users teams
                            let pushComment = false

                            // Check if the comment belongs to one of auth users teams
                            // if (comment.user != null)
                            //     if (comment.user.teams != null)
                            //         if ( comment.user.teams.find(x => x.id == teamFilterId) )
                            //             pushComment = true
                            if (comment.team_id == teamFilterId) pushComment = true

                            // Check if the comment is final or global (not for sales)
                            if (userPermissionLevel >= 2) {
                                if (comment.team_final || comment.phase_final || comment.team_id == 0)
                                    pushComment = true
                            }

                            if (pushComment) product.commentsScoped.push(comment)
                        })
                    } else if (teamFilterId == 0) {
                        product.commentsScoped = comments
                    }

                    // Filter actions by the current team filter
                    // Check if the action has a user
                    if (teamFilterId > 0 && product.actions != null) {
                        product.nds = JSON.parse(JSON.stringify(teamUsers)) // Copy our users into a new variable
                        product.actions.forEach(action => {
                            if (action.user != null) {
                                // Check if the user has a team
                                if (action.user.teams[0] != null) {
                                    // Find the users team
                                    if (action.user.teams.findIndex(x => x.id == teamFilterId) > -1) {
                                        // if (action.user.teams[0].id == teamFilterId) {
                                        if (action.action == 0) product.outs.push(action.user)
                                        if (action.action == 1) product.ins.push(action.user)
                                        if (action.action == 2) product.focus.push(action.user)
                                    }
                                }
                                // Find Not decided
                                let index = product.nds.findIndex(nd => nd.id == action.user_id)
                                if (index > -1) {
                                    product.nds.splice(index, 1)
                                }
                            }
                        })
                        // Filter actions by teams if GLOBAL scope is set (= 0)
                    } else if (teamFilterId == 0 && product.teamActions != null) {
                        product.nds = JSON.parse(JSON.stringify(currentFile.teams)) // Copy our users into a new variable
                        product.teamActions.forEach(action => {
                            if (action.team != null) {
                                if (action.action == 0) product.outs.push(action.team)
                                if (action.action == 1) product.ins.push(action.team)
                                if (action.action == 2) product.focus.push(action.team)
                            }
                            // Find Not decided
                            let index = product.nds.findIndex(nd => nd.id == action.team_id)
                            if (index > -1) {
                                product.nds.splice(index, 1)
                            }
                        })
                    }
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
