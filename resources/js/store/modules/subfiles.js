import axios from 'axios'
import Subfile from '../models/Subfile'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingSubfiles: state => {
            return state.loading
        },
    },

    actions: {
        async fetchSubfiles({ commit }, workspace_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/workspace/${workspace_id}/subfiles`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    Subfile.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in Subfile.js :')
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
