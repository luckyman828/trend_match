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

        async insertOrUpdateAction({ commit, rootGetters }, { product, action, selection, user }) {
            // type = action|feedback
            commit('insertOrUpdateAction', { product, action, selection, user })
            let apiUrl
            let requestBody
            if (selection.your_role == 'Member') {
                apiUrl = `/selections/${selection.id}/feedback`
                requestBody = {
                    feedbacks: [
                        {
                            product_id: product.id,
                            feedback: action,
                        },
                    ],
                }
            } else if (selection.your_role == 'Owner') {
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
            await axios.post(apiUrl, requestBody)
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
                // Check if the action already exists in the products feedbacks array
                const existingAction = product.feedbacks.find(
                    x => x.product_id == product.id && x.selection_id == selection.id && x.user_id == user.id
                )
                if (!existingAction) {
                    product.feedbacks.push({
                        action: action,
                        product_id: product.id,
                        selection: selection,
                        selection_id: selection.id,
                        user_id: user.id,
                    })
                } else {
                    existingAction.action = action
                }
            }
            if (selection.your_role == 'Owner') {
                product.your_action = action
                // Check if the action already exists in the products actions array
                const existingAction = product.actions.find(
                    x => x.product_id == product.id && x.selection_id == selection.id
                )
                if (!existingAction) {
                    product.actions.push({
                        action: action,
                        product_id: product.id,
                        selection: selection,
                        selection_id: selection.id,
                        user_id: user.id,
                    })
                } else {
                    existingAction.action = action
                    existingAction.user_id = user.id
                }
            }
        },
    },
}
