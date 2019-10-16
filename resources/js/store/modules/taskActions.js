import axios from 'axios'
import TaskAction from '../models/TaskAction'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingTaskActions: state => {
            return state.loading
        },
    },

    actions: {
        async fetchTaskActions({ commit }, file_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/file/${file_id}/task-actions`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    TaskAction.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in haseProducts.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        // Update the action of for a product for a user
        async updateTaskAction({ commit }, { task_id, product_id, action }) {
            commit('setTaskAction', { task_id, product_id, action })

            await axios
                .put(`/api/task-action`, {
                    task_id: task_id,
                    product_id: product_id,
                    action: action,
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err)
                })
        },

        async updateManyTaskActions({ commit }, { task_id, product_ids, action }) {
            commit('setManyTaskActions', { task_id, product_ids, action })

            await axios
                .put(`/api/many-task-actions`, {
                    task_id: task_id,
                    product_ids: product_ids,
                    action: action,
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err)
                })
        },

        async createManyTaskActions({ commit }, { product_ids, task_id, action }) {
            commit('setManyTaskActions', { product_ids, task_id, action })

            await axios
                .post(`/api/many-task-actions`, {
                    product_ids: product_ids,
                    task_id: phase_id,
                    action: action,
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err)
                })
        },

        async deleteTaskAction({ commit }, { product_id, task_id }) {
            commit('deleteTaskAction', { product_id, task_id })

            await axios
                .delete(`/api/task-action`, {
                    data: {
                        product_id: product_id,
                        task_id: task_id,
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
        setAction: (state, { product_id, task_id, action }) => {
            TaskAction.insert({
                data: {
                    product_id: product_id,
                    task_id: task_id,
                    action: action,
                },
            })
        },
        setManyTaskActions: (state, { product_ids, task_id, action }) => {
            // Prepare the data
            let data = []

            product_ids.forEach(product_id => {
                const productData = {
                    product_id: product_id,
                    task_id: task_id,
                    action: action,
                }
                data.push(productData)
            })

            TaskAction.insert({
                data: data,
            })
        },
        deleteTaskAction: (state, { product_id, task_id }) => {
            TaskAction.delete(record => {
                return record.product_id == product_id && record.task_id == task_id
            })
        },
    },
}
