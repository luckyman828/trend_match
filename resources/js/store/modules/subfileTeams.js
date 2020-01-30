import axios from 'axios'
import SubfileTeam from '../models/SubfileTeam'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingSubfileTeams: state => {
            return state.loading
        },
    },

    actions: {
        async fetchSubfileTeams({ commit }, workspace_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/workspace/${workspace_id}/subfile_teams`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    SubfileTeam.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in SubfileTeam.js :')
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
