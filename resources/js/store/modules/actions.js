import axios from 'axios'
import Action from '../models/Action'
import Product from '../models/Product'

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

        // Update the action of for a product for a user
        async updateAction({ commit, dispatch }, { user_id, task_id, productToUpdate, action_code, is_task_action }) {
            // Save a reference to the existing action so we can revert to it in case of an error
            console.log('Updating actions aciton in vuex')
            const existingAction = Action.query()
                .where('user_id', user_id)
                .where('task_id', task_id)
                .where('product_id', productToUpdate)
                .first()

            // Set the action on the product in our ORM loaded state, and wait for the products to recalculate
            await commit('setAction', { user_id, task_id, productToUpdate, action_code, is_task_action })

            // Dispatch an action to update this product
            dispatch('entities/products/updateActions', productToUpdate, { root: true })

            await axios
                .put(`/api/action`, {
                    user_id: user_id,
                    task_id: task_id,
                    product_id: productToUpdate,
                    action_code: action_code,
                    is_task_action: is_task_action,
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(async err => {
                    console.log(err.response)
                    // On error restore the action and alert the user
                    commit('alertError')

                    if (existingAction) {
                        await commit('setAction', {
                            user_id,
                            task_id,
                            productToUpdate,
                            action_code: existingAction.action,
                            is_task_action,
                        })
                    } else {
                        await commit('destroyAction', { productToUpdate, task_id, user_id })
                    }
                    // Dispatch an action to update the products actions
                    dispatch('entities/products/updateActions', productToUpdate, { root: true })
                })
        },
        // Update the action of for a product for a user
        async createTaskAction(
            { commit, dispatch },
            { user_id, task_id, productToUpdate, action_code, is_task_action }
        ) {
            // Save a reference to the existing action so we can revert to it in case of an error
            const existingAction = Action.query()
                .where('task_id', task_id)
                .where('product_id', productToUpdate)
                .first()

            await commit('setAction', { user_id, task_id, productToUpdate, action_code, is_task_action })

            // Dispatch an action to update this product
            dispatch('entities/products/updateActions', productToUpdate, { root: true })

            await axios
                .put(`/api/task-action`, {
                    user_id: user_id,
                    task_id: task_id,
                    product_id: productToUpdate,
                    action_code: action_code,
                    is_task_action: is_task_action,
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(async err => {
                    console.log(err.response)
                    // On error restore the action and alert the user
                    commit('alertError')

                    if (existingAction) {
                        await commit('setAction', {
                            user_id,
                            task_id,
                            productToUpdate,
                            action_code: existingAction.action,
                            is_task_action,
                        })
                    } else {
                        await commit('destroyTaskAction', { productToUpdate, task_id })
                    }

                    // Dispatch an action to update the products actions
                    dispatch('entities/products/updateActions', productToUpdate, { root: true })
                })
        },
        async updateTaskAction(
            { commit, dispatch },
            { task_id, user_id, productToUpdate, action_code, is_task_action }
        ) {
            const existingAction = Action.query()
                .where('task_id', task_id)
                .where('product_id', productToUpdate)
                .first()

            await commit('setTaskAction', { user_id, task_id, productToUpdate, action_code, is_task_action })
            // Dispatch an action to update this product
            dispatch('entities/products/updateActions', productToUpdate, { root: true })

            await axios
                .put(`/api/task-action`, {
                    user_id: user_id,
                    task_id: task_id,
                    product_id: productToUpdate,
                    action_code: action_code,
                    is_task_action: is_task_action,
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(async err => {
                    console.log(err.response)
                    // On error restore the action and alert the user
                    commit('alertError')

                    if (existingAction) {
                        await commit('setAction', {
                            user_id,
                            task_id,
                            productToUpdate,
                            action_code: existingAction.action,
                            is_task_action,
                        })
                    } else {
                        await commit('destroyTaskAction', { productToUpdate, task_id })
                    }

                    // Dispatch an action to update the products actions
                    dispatch('entities/products/updateActions', productToUpdate, { root: true })
                })
        },

        async updateManyActions({ commit, dispatch }, { productIds, task_id, user_id, action_code, is_task_action }) {
            console.log('updating actions')

            await axios
                .put(`/api/many-actions`, {
                    product_ids: productIds,
                    task_id: task_id,
                    user_id: user_id,
                    action_code: action_code,
                    is_task_action: is_task_action,
                })
                .then(async response => {
                    console.log(response.data)
                    await commit('setManyActions', { productIds, task_id, user_id, action_code, is_task_action })

                    // Loop through our products and dispatch an update action for each
                    productIds.forEach(productId => {
                        // Dispatch an action to update this product
                        dispatch('entities/products/updateActions', productId, { root: true })
                    })
                })
                .catch(err => {
                    console.log(err.response)
                    commit('alertError')
                })
        },
        async updateManyTaskActions(
            { commit, dispatch },
            { productIds, task_id, user_id, action_code, is_task_action }
        ) {
            console.log('updating actions')

            await axios
                .put(`/api/many-task-actions`, {
                    product_ids: productIds,
                    task_id: task_id,
                    user_id: user_id,
                    action_code: action_code,
                    is_task_action: is_task_action,
                })
                .then(async response => {
                    console.log(response.data)
                    await commit('setManyActions', { productIds, task_id, user_id, action_code, is_task_action })
                    // Loop through our products and dispatch an update action for each
                    productIds.forEach(productId => {
                        // Dispatch an action to update this product
                        dispatch('entities/products/updateActions', productId, { root: true })
                    })
                })
                .catch(err => {
                    console.log(err.response)
                    commit('alertError')
                })
        },

        async createManyActions(
            { commit, dispatch, rootGetters },
            { productIds, task_id, user_id, action_code, is_task_action }
        ) {
            console.log('creating actions')

            await axios
                .post(`/api/many-actions`, {
                    product_ids: productIds,
                    task_id: task_id,
                    user_id: user_id,
                    action_code: action_code,
                    is_task_action,
                })
                .then(async response => {
                    console.log(response.data)
                    await commit('setManyTaskActions', { productIds, task_id, user_id, action_code, is_task_action })
                    // Loop through our products and dispatch an update action for each
                    productIds.forEach(productId => {
                        // Dispatch an action to update this product
                        dispatch('entities/products/updateActions', productId, { root: true })
                    })
                })
                .catch(err => {
                    console.log(err.response)
                    commit('alertError')
                })
        },

        async deleteAction({ commit, dispatch }, { productToUpdate, task_id, user_id }) {
            const existingAction = Action.query()
                .where('user_id', user_id)
                .where('task_id', task_id)
                .where('product_id', productToUpdate)
                .first()

            await commit('destroyAction', { productToUpdate, task_id, user_id })
            // Dispatch an action to update this product
            dispatch('entities/products/updateActions', productToUpdate, { root: true })

            await axios
                .delete(`/api/action`, {
                    data: {
                        user_id: user_id,
                        task_id: task_id,
                        product_id: productToUpdate,
                    },
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(async err => {
                    console.log(err.response)
                    commit('alertError')
                    // On error restore the action and alert the user
                    await commit('setAction', {
                        user_id,
                        task_id,
                        productToUpdate,
                        action_code: existingAction.action,
                        is_task_action: existingAction.is_task_action,
                    })

                    // Dispatch an action to update the products actions
                    dispatch('entities/products/updateActions', productToUpdate, { root: true })
                })
        },

        async deleteTaskAction({ commit, dispatch, rootGetters }, { productToUpdate, task_id }) {
            const existingAction = Action.query()
                .where('task_id', task_id)
                .where('product_id', productToUpdate)
                .first()

            await commit('destroyTaskAction', { productToUpdate, task_id })
            // Dispatch an action to update the products actions
            dispatch('entities/products/updateActions', productToUpdate, { root: true })

            await axios
                .delete(`/api/task-action`, {
                    data: {
                        task_id: task_id,
                        product_id: productToUpdate,
                    },
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(async err => {
                    console.log(err.response)
                    commit('alertError')

                    await commit('setAction', {
                        user_id: existingAction.user_id,
                        task_id,
                        productToUpdate,
                        action_code: existingAction.action,
                        is_task_action: existingAction.is_task_action,
                    })

                    // Dispatch an action to update the products actions
                    dispatch('entities/products/updateActions', productToUpdate, { root: true })
                })
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        setAction: (state, { productToUpdate, task_id, user_id, action_code, is_task_action }) => {
            console.log('setting action! Action code: ' + action_code)
            // Find the product in question
            // Set a flag to say that it's actions have changed
            Action.insert({
                data: {
                    action: action_code,
                    product_id: productToUpdate,
                    user_id: user_id,
                    task_id: task_id,
                    is_task_action: is_task_action,
                },
            })
        },
        setTaskAction: (state, { user_id, productToUpdate, task_id, action_code, is_task_action }) => {
            Action.update({
                where: action => {
                    return action.task_id == task_id && action.product_id == productToUpdate
                },
                data: {
                    user_id: user_id,
                    action: action_code,
                    product_id: productToUpdate,
                    task_id: task_id,
                    is_task_action: is_task_action,
                },
            })
        },
        destroyAction: (state, { productToUpdate, task_id, user_id }) => {
            console.log(
                'deleting action, product: ' + productToUpdate + ', task id: ' + task_id + ', user id: ' + user_id
            )

            const deleted = Action.delete(record => {
                return record.product_id == productToUpdate && record.user_id == user_id && record.task_id == task_id
            })
            console.log('action is deleted!')
            console.log(deleted)
        },
        destroyTaskAction: (state, { productToUpdate, task_id }) => {
            console.log('deleting action')

            Action.delete(record => {
                return record.product_id == productToUpdate && record.task_id == task_id
            })
        },
        setManyActions: (state, { productIds, task_id, user_id, action_code, is_task_action }) => {
            // Prepare the data
            let data = []

            productIds.forEach(product => {
                const productData = {
                    product_id: product,
                    task_id: task_id,
                    user_id: user_id,
                    action: action_code,
                    is_task_action: is_task_action,
                }
                data.push(productData)
            })

            Action.insert({
                data: data,
            })
        },
        setManyTaskActions: (state, { productIds, task_id, user_id, action_code, is_task_action }) => {
            // Prepare the data
            let data = []

            productIds.forEach(product => {
                const productData = {
                    product_id: product,
                    task_id: task_id,
                    user_id: user_id,
                    action: action_code,
                    is_task_action: is_task_action,
                }
                data.push(productData)
            })

            Action.insert({
                data: data,
            })
        },
        alertError: state => {
            window.alert('Network error. Please check your connection')
        },
    },
}
