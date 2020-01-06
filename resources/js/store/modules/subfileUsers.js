import axios from 'axios'
import SubfileUser from '../models/SubfileUser'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingSubfileUsers: state => {
            return state.loading
        },
    },

    actions: {
        async fetchSubfileUsers({ commit }, workspace_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/workspace/${workspace_id}/subfile_users`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    SubfileUser.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in SubfileUser.js :')
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
