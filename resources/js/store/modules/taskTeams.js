import axios from 'axios'
import TaskTeam from '../models/TaskTeam'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingTaskTeams: state => {
            return state.loading
        },
    },

    actions: {
        async fetchTaskTeams({ commit }, workspace_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/workspace/${workspace_id}/task-teams`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    TaskTeam.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (error) {
                    console.log('API error in taskTeams.js :')
                    console.log(error.response)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
    },
}
