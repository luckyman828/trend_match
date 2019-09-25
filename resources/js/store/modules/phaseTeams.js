import axios from 'axios'
import PhaseTeam from '../models/PhaseTeam'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingPhaseTeams: state => {
            return state.loading
        },
    },

    actions: {
        async fetchPhaseTeams({ commit }, workspace_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/workspace/${workspace_id}/phase-teams`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    PhaseTeam.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in phaseTeams.js :')
                    console.log(err)
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
