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
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },

        // Update the action of for a product for a user
        async updateAction({ commit }, { user_id, task_id, productToUpdate, action_code, is_task_action }) {
            commit('setAction', { user_id, task_id, productToUpdate, action_code, is_task_action })
            console.log(' Updating action: ' + user_id + ', ' + productToUpdate + ', ' + action_code)

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
                    console.log(err)
                })
        },
        // Update the action of for a product for a user
        async createTaskAction({ commit }, { user_id, task_id, productToUpdate, action_code, is_task_action }) {
            commit('setAction', { user_id, task_id, productToUpdate, action_code, is_task_action })
            console.log(' Updating action: ' + user_id + ', ' + productToUpdate + ', ' + action_code)

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
                    console.log(err)
                })
        },
        async updateTaskAction({ commit }, { task_id, user_id, productToUpdate, action_code, is_task_action }) {
            commit('setTaskAction', { user_id, task_id, productToUpdate, action_code, is_task_action })
            console.log(' Updating action: ' + user_id + ', ' + productToUpdate + ', ' + action_code)

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
                    console.log(err)
                })
        },

        async updateManyActions({ commit }, { productIds, task_id, user_id, action_code, is_task_action }) {
            commit('setManyActions', { productIds, task_id, user_id, action_code, is_task_action })
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
                })
                .catch(err => {
                    console.log(err)
                })
        },
        async updateManyTaskActions({ commit }, { productIds, task_id, user_id, action_code, is_task_action }) {
            commit('setManyActions', { productIds, task_id, user_id, action_code, is_task_action })
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
                })
                .catch(err => {
                    console.log(err)
                })
        },

        async createManyActions({ commit }, { productIds, task_id, user_id, action_code, is_task_action }) {
            commit('setManyTaskActions', { productIds, task_id, user_id, action_code, is_task_action })
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
                })
                .catch(err => {
                    console.log(err)
                })
        },

        async deleteAction({ commit }, { productToUpdate, task_id, user_id }) {
            commit('deleteAction', { productToUpdate, task_id, user_id })

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
                    console.log(err)
                })
        },

        async deleteTaskAction({ commit }, { productToUpdate, task_id }) {
            commit('deleteTaskAction', { productToUpdate, task_id })

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
                    console.log(err)
                })
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        setAction: (state, { productToUpdate, task_id, user_id, action_code, is_task_action }) => {
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
            console.log('Updating task action!')
            console.log(user_id)
            console.log(productToUpdate)
            console.log(task_id)
            console.log(action_code)
            console.log(is_task_action)
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
            // Action.update({
            //     where: {
            //         product_id: productToUpdate,
            //         task_id: task_id,
            //     },
            //     data: {
            //         user_id: user_id,
            //         action: action_code,
            //         product_id: productToUpdate,
            //         task_id: task_id,
            //         is_task_action: is_task_action,
            //     },
            // })
        },
        deleteAction: (state, { productToUpdate, task_id, user_id }) => {
            console.log('deleting action')

            Action.delete(record => {
                return record.product_id == productToUpdate && record.user_id == user_id && record.task_id == task_id
            })
        },
        deleteTaskAction: (state, { productToUpdate, task_id }) => {
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
    },
}
