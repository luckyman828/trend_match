import axios from 'axios'
import Action from '../models/Action'

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

        async updateAction({ commit }, { product, action, isFeedback }) {
            let requestMethod = 'put'

            let apiEndPoint
            // Check if the new action is the same as the current action -> then remove it
            if (product.currentAction && product.currentAction.action == action.action) {
                // Remove action
                commit('deleteAction', { product, action })
                apiEndPoint = 'none'
            } else {
                // Post action
                commit('insertOrUpdateAction', { product, action })
                if (action.action == 2) {
                    apiEndPoint = 'focus'
                } else if (action.action == 2) {
                    apiEndPoint = 'in'
                } else {
                    apiEndPoint = 'out'
                }
            }

            let actionTypeURL
            if (isFeedback) {
                actionTypeURL = 'feedback'
            } else {
                actionTypeURL = 'actions'
            }

            // Config API endpoint
            const apiUrl = `${process.env.MIX_KOLLEKT_API_URL_BASE}/selections/${action.selection_id}/products/${action.product_id}/${actionTypeURL}/${apiEndPoint}`
            const requestHeaders = {
                'X-Kollekt-App-Key': process.env.MIX_KOLLEKT_API_KEY,
            }

            // Assume success
            let success = true

            // await axios({
            //     method: requestMethod,
            //     url: apiUrl,
            //     data: {
            //         action,
            //     },
            //     headers: requestHeaders,
            // })
            //     .then(async response => {
            //         // Get and set the comment id equal to the id given by the database
            //         newComment.id = response.data.id
            //     })
            //     .catch(err => {
            //         console.log(err.response)
            //         success = false
            //         commit('alertError')
            //         newComment.failed = true
            //     })

            return success
        },

        // Update the action of for a product for a user
        // async updateAction({ commit, dispatch }, { user_id, task_id, productToUpdate, action_code, is_task_action }) {
        //     // Save a reference to the existing action so we can revert to it in case of an error
        //     const existingAction = Action.query()
        //         .where('user_id', user_id)
        //         .where('task_id', task_id)
        //         .where('product_id', productToUpdate)
        //         .first()

        //     // Set the action on the product in our ORM loaded state, and wait for the products to recalculate
        //     await commit('setAction', { user_id, task_id, productToUpdate, action_code, is_task_action })

        //     // Dispatch an action to update this product
        //     dispatch('entities/products/updateActions', productToUpdate, { root: true })

        //     await axios
        //         .put(`/api/action`, {
        //             user_id: user_id,
        //             task_id: task_id,
        //             product_id: productToUpdate,
        //             action_code: action_code,
        //             is_task_action: is_task_action,
        //         })
        //         .then(response => {
        //             console.log(response.data)
        //         })
        //         .catch(async err => {
        //             console.log(err.response)
        //             // On error restore the action and alert the user
        //             commit('alertError')

        //             if (existingAction) {
        //                 await commit('setAction', {
        //                     user_id,
        //                     task_id,
        //                     productToUpdate,
        //                     action_code: existingAction.action,
        //                     is_task_action,
        //                 })
        //             } else {
        //                 await commit('destroyAction', { productToUpdate, task_id, user_id })
        //             }
        //             // Dispatch an action to update the products actions
        //             dispatch('entities/products/updateActions', productToUpdate, { root: true })
        //         })
        // },
        // // Update the action of for a product for a user
        // async createTaskAction(
        //     { commit, dispatch },
        //     { user_id, task_id, productToUpdate, action_code, is_task_action }
        // ) {
        //     // Save a reference to the existing action so we can revert to it in case of an error
        //     const existingAction = Action.query()
        //         .where('task_id', task_id)
        //         .where('product_id', productToUpdate)
        //         .first()

        //     await commit('setAction', { user_id, task_id, productToUpdate, action_code, is_task_action })

        //     // Dispatch an action to update this product
        //     dispatch('entities/products/updateActions', productToUpdate, { root: true })

        //     await axios
        //         .put(`/api/task-action`, {
        //             user_id: user_id,
        //             task_id: task_id,
        //             product_id: productToUpdate,
        //             action_code: action_code,
        //             is_task_action: is_task_action,
        //         })
        //         .then(response => {
        //             console.log(response.data)
        //         })
        //         .catch(async err => {
        //             console.log(err.response)
        //             // On error restore the action and alert the user
        //             commit('alertError')

        //             if (existingAction) {
        //                 await commit('setAction', {
        //                     user_id,
        //                     task_id,
        //                     productToUpdate,
        //                     action_code: existingAction.action,
        //                     is_task_action,
        //                 })
        //             } else {
        //                 await commit('destroyTaskAction', { productToUpdate, task_id })
        //             }

        //             // Dispatch an action to update the products actions
        //             dispatch('entities/products/updateActions', productToUpdate, { root: true })
        //         })
        // },
        // async updateTaskAction(
        //     { commit, dispatch },
        //     { task_id, user_id, productToUpdate, action_code, is_task_action }
        // ) {
        //     const existingAction = Action.query()
        //         .where('task_id', task_id)
        //         .where('product_id', productToUpdate)
        //         .first()

        //     await commit('setTaskAction', { user_id, task_id, productToUpdate, action_code, is_task_action })
        //     // Dispatch an action to update this product
        //     dispatch('entities/products/updateActions', productToUpdate, { root: true })

        //     await axios
        //         .put(`/api/task-action`, {
        //             user_id: user_id,
        //             task_id: task_id,
        //             product_id: productToUpdate,
        //             action_code: action_code,
        //             is_task_action: is_task_action,
        //         })
        //         .then(response => {
        //             console.log(response.data)
        //         })
        //         .catch(async err => {
        //             console.log(err.response)
        //             // On error restore the action and alert the user
        //             commit('alertError')

        //             if (existingAction) {
        //                 await commit('setAction', {
        //                     user_id,
        //                     task_id,
        //                     productToUpdate,
        //                     action_code: existingAction.action,
        //                     is_task_action,
        //                 })
        //             } else {
        //                 await commit('destroyTaskAction', { productToUpdate, task_id })
        //             }

        //             // Dispatch an action to update the products actions
        //             dispatch('entities/products/updateActions', productToUpdate, { root: true })
        //         })
        // },

        // async updateManyActions({ commit, dispatch }, { productIds, task_id, user_id, action_code, is_task_action }) {
        //     console.log('updating actions')

        //     await axios
        //         .put(`/api/many-actions`, {
        //             product_ids: productIds,
        //             task_id: task_id,
        //             user_id: user_id,
        //             action_code: action_code,
        //             is_task_action: is_task_action,
        //         })
        //         .then(async response => {
        //             console.log(response.data)
        //             await commit('setManyActions', { productIds, task_id, user_id, action_code, is_task_action })

        //             // Loop through our products and dispatch an update action for each
        //             productIds.forEach(productId => {
        //                 // Dispatch an action to update this product
        //                 dispatch('entities/products/updateActions', productId, { root: true })
        //             })
        //         })
        //         .catch(err => {
        //             console.log(err.response)
        //             commit('alertError')
        //         })
        // },
        // async updateManyTaskActions(
        //     { commit, dispatch },
        //     { productIds, task_id, user_id, action_code, is_task_action }
        // ) {
        //     await axios
        //         .put(`/api/many-task-actions`, {
        //             product_ids: productIds,
        //             task_id: task_id,
        //             user_id: user_id,
        //             action_code: action_code,
        //             is_task_action: is_task_action,
        //         })
        //         .then(async response => {
        //             console.log(response.data)
        //             await commit('setManyActions', { productIds, task_id, user_id, action_code, is_task_action })
        //             // Loop through our products and dispatch an update action for each
        //             productIds.forEach(productId => {
        //                 // Dispatch an action to update this product
        //                 dispatch('entities/products/updateActions', productId, { root: true })
        //             })
        //         })
        //         .catch(err => {
        //             console.log(err.response)
        //             commit('alertError')
        //         })
        // },

        // async createManyActions(
        //     { commit, dispatch, rootGetters },
        //     { productIds, task_id, user_id, action_code, is_task_action }
        // ) {
        //     await axios
        //         .post(`/api/many-actions`, {
        //             product_ids: productIds,
        //             task_id: task_id,
        //             user_id: user_id,
        //             action_code: action_code,
        //             is_task_action,
        //         })
        //         .then(async response => {
        //             console.log(response.data)
        //             await commit('setManyTaskActions', { productIds, task_id, user_id, action_code, is_task_action })
        //             // Loop through our products and dispatch an update action for each
        //             productIds.forEach(productId => {
        //                 // Dispatch an action to update this product
        //                 dispatch('entities/products/updateActions', productId, { root: true })
        //             })
        //         })
        //         .catch(err => {
        //             console.log(err.response)
        //             commit('alertError')
        //         })
        // },

        // async deleteAction({ commit, dispatch }, { productToUpdate, task_id, user_id }) {
        //     const existingAction = Action.query()
        //         .where('user_id', user_id)
        //         .where('task_id', task_id)
        //         .where('product_id', productToUpdate)
        //         .first()

        //     await commit('destroyAction', { productToUpdate, task_id, user_id })
        //     // Dispatch an action to update this product
        //     dispatch('entities/products/updateActions', productToUpdate, { root: true })

        //     await axios
        //         .delete(`/api/action`, {
        //             data: {
        //                 user_id: user_id,
        //                 task_id: task_id,
        //                 product_id: productToUpdate,
        //             },
        //         })
        //         .then(response => {
        //             console.log(response.data)
        //         })
        //         .catch(async err => {
        //             console.log(err.response)
        //             commit('alertError')
        //             // On error restore the action and alert the user
        //             await commit('setAction', {
        //                 user_id,
        //                 task_id,
        //                 productToUpdate,
        //                 action_code: existingAction.action,
        //                 is_task_action: existingAction.is_task_action,
        //             })

        //             // Dispatch an action to update the products actions
        //             dispatch('entities/products/updateActions', productToUpdate, { root: true })
        //         })
        // },

        // async deleteTaskAction({ commit, dispatch, rootGetters }, { productToUpdate, task_id }) {
        //     const existingAction = Action.query()
        //         .where('task_id', task_id)
        //         .where('product_id', productToUpdate)
        //         .first()

        //     await commit('destroyTaskAction', { productToUpdate, task_id })
        //     // Dispatch an action to update the products actions
        //     dispatch('entities/products/updateActions', productToUpdate, { root: true })

        //     await axios
        //         .delete(`/api/task-action`, {
        //             data: {
        //                 task_id: task_id,
        //                 product_id: productToUpdate,
        //             },
        //         })
        //         .then(response => {
        //             console.log(response.data)
        //         })
        //         .catch(async err => {
        //             console.log(err.response)
        //             commit('alertError')

        //             await commit('setAction', {
        //                 user_id: existingAction.user_id,
        //                 task_id,
        //                 productToUpdate,
        //                 action_code: existingAction.action,
        //                 is_task_action: existingAction.is_task_action,
        //             })

        //             // Dispatch an action to update the products actions
        //             dispatch('entities/products/updateActions', productToUpdate, { root: true })
        //         })
        // },
        // async setAction({ dispatch }, action) {
        //     await Action.insert({
        //         data: action,
        //     })
        //     // Dispatch an action to update the products actions
        //     dispatch('entities/products/updateActions', action.product_id, { root: true })
        // },
        // async destroyAction({ dispatch }, action) {
        //     if (!action.is_task_action) {
        //         Action.delete(record => {
        //             return (
        //                 record.product_id == action.product_id &&
        //                 record.user_id == action.user_id &&
        //                 record.task_id == action.task_id
        //             )
        //         })
        //     } else {
        //         Action.delete(record => {
        //             return record.product_id == action.product_id && record.task_id == action.task_id
        //         })
        //     }
        //     // Dispatch an action to update the products actions
        //     dispatch('entities/products/updateActions', action.product_id, { root: true })
        // },
        // async setManyActions({ dispatch }, { productIds, task_id, user_id, action_code, is_task_action }) {
        //     // Prepare the data
        //     let data = []

        //     productIds.forEach(product => {
        //         const productData = {
        //             product_id: product,
        //             task_id: task_id,
        //             user_id: user_id,
        //             action: action_code,
        //             is_task_action: is_task_action,
        //         }
        //         data.push(productData)
        //     })

        //     Action.insert({
        //         data: data,
        //     })

        //     // Loop through the product ids and dispatch an action to update each product
        //     productIds.forEach(productId => {
        //         // Dispatch an action to update the products actions
        //         dispatch('entities/products/updateActions', productId, { root: true })
        //     })
        // },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        alertError: state => {
            window.alert('Network error. Please check your connection')
        },
        insertOrUpdateAction: async (state, { product, action }) => {
            product.currentAction = action
        },
        deleteAction(state, { product, action }) {
            product.currentAction = null
        },
    },
}
