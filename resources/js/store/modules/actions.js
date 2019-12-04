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

        // Update the action of for a product for a user
        async updateAction({ commit }, { user_id, task_id, productToUpdate, action_code, is_task_action }) {
            // Save a reference to the existing action so we can revert to it in case of an error
            const existingAction = Action.query()
                .where('user_id', user_id)
                .where('task_id', task_id)
                .where('product_id', productToUpdate)
                .first()

            commit('setAction', { user_id, task_id, productToUpdate, action_code, is_task_action })

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
                .catch(err => {
                    console.log(err.response)
                    // On error restore the action and alert the user
                    if (existingAction) {
                        commit('setAction', {
                            user_id,
                            task_id,
                            productToUpdate,
                            action_code: existingAction.action,
                            is_task_action,
                        })
                    } else {
                        commit('destroyAction', { productToUpdate, task_id, user_id })
                    }
                    commit('alertError')
                })
        },
        // Update the action of for a product for a user
        async createTaskAction({ commit }, { user_id, task_id, productToUpdate, action_code, is_task_action }) {
            // Save a reference to the existing action so we can revert to it in case of an error
            const existingAction = Action.query()
                .where('task_id', task_id)
                .where('product_id', productToUpdate)
                .first()

            commit('setAction', { user_id, task_id, productToUpdate, action_code, is_task_action })

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
                .catch(err => {
                    console.log(err.response)
                    // On error restore the action and alert the user
                    if (existingAction) {
                        commit('setAction', {
                            user_id,
                            task_id,
                            productToUpdate,
                            action_code: existingAction.action,
                            is_task_action,
                        })
                    } else {
                        commit('destroyTaskAction', { productToUpdate, task_id })
                    }
                    commit('alertError')
                })
        },
        async updateTaskAction({ commit }, { task_id, user_id, productToUpdate, action_code, is_task_action }) {
            const existingAction = Action.query()
                .where('task_id', task_id)
                .where('product_id', productToUpdate)
                .first()

            commit('setTaskAction', { user_id, task_id, productToUpdate, action_code, is_task_action })

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
                .catch(err => {
                    console.log(err.response)
                    // On error restore the action and alert the user
                    if (existingAction) {
                        commit('setAction', {
                            user_id,
                            task_id,
                            productToUpdate,
                            action_code: existingAction.action,
                            is_task_action,
                        })
                    } else {
                        commit('destroyTaskAction', { productToUpdate, task_id })
                    }
                    commit('alertError')
                })
        },

        async updateManyActions({ commit }, { productIds, task_id, user_id, action_code, is_task_action }) {
            console.log('updating actions')

            await axios
                .put(`/api/many-actions`, {
                    product_ids: productIds,
                    task_id: task_id,
                    user_id: user_id,
                    action_code: action_code,
                    is_task_action: is_task_action,
                })
                .then(response => {
                    console.log(response.data)
                    commit('setManyActions', { productIds, task_id, user_id, action_code, is_task_action })
                })
                .catch(err => {
                    console.log(err.response)
                    commit('alertError')
                })
        },
        async updateManyTaskActions({ commit }, { productIds, task_id, user_id, action_code, is_task_action }) {
            console.log('updating actions')

            await axios
                .put(`/api/many-task-actions`, {
                    product_ids: productIds,
                    task_id: task_id,
                    user_id: user_id,
                    action_code: action_code,
                    is_task_action: is_task_action,
                })
                .then(response => {
                    console.log(response.data)
                    commit('setManyActions', { productIds, task_id, user_id, action_code, is_task_action })
                })
                .catch(err => {
                    console.log(err.response)
                    commit('alertError')
                })
        },

        async createManyActions({ commit }, { productIds, task_id, user_id, action_code, is_task_action }) {
            console.log('creating actions')

            await axios
                .post(`/api/many-actions`, {
                    product_ids: productIds,
                    task_id: task_id,
                    user_id: user_id,
                    action_code: action_code,
                    is_task_action,
                })
                .then(response => {
                    console.log(response.data)
                    commit('setManyTaskActions', { productIds, task_id, user_id, action_code, is_task_action })
                })
                .catch(err => {
                    console.log(err.response)
                    commit('alertError')
                })
        },

        async deleteAction({ commit }, { productToUpdate, task_id, user_id }) {
            const existingAction = Action.query()
                .where('user_id', user_id)
                .where('task_id', task_id)
                .where('product_id', productToUpdate)
                .first()

            commit('destroyAction', { productToUpdate, task_id, user_id })

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
                .catch(err => {
                    console.log(err.response)
                    // On error restore the action and alert the user
                    commit('setAction', {
                        user_id,
                        task_id,
                        productToUpdate,
                        action_code: existingAction.action,
                        is_task_action: existingAction.is_task_action,
                    })
                    commit('alertError')
                })
        },

        async deleteTaskAction({ commit }, { productToUpdate, task_id }) {
            const existingAction = Action.query()
                .where('task_id', task_id)
                .where('product_id', productToUpdate)
                .first()

            commit('destroyTaskAction', { productToUpdate, task_id })

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
                .catch(err => {
                    console.log(err.response)
                    commit('setAction', {
                        user_id: existingAction.user_id,
                        task_id,
                        productToUpdate,
                        action_code: existingAction.action,
                        is_task_action: existingAction.is_task_action,
                    })
                    commit('alertError')
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
            console.log('deleting action')

            Action.delete(record => {
                return record.product_id == productToUpdate && record.user_id == user_id && record.task_id == task_id
            })
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
