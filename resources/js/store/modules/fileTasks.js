import axios from 'axios'
import FileTask from '../models/FileTask'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingFileTasks: state => {
            return state.loading
        },
    },

    actions: {
        async fetchFileTasks({ commit }, workspace_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/workspace/${workspace_id}/file-tasks`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    FileTask.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in fileTasks.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
    },

    mutations: {
        setLoading(state, bool) {
            state.loading = bool
        },
    },
}
