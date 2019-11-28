import axios from 'axios'
import Folder from '../models/Folder'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingFolders: state => {
            return state.loading
        },
        folders: state => {
            const folders = Folder.query()
                .with('folders')
                .with('files')
                .all()
            return folders
        },
    },

    actions: {
        async fetchFolders({ commit }, workspace_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/workspace/${workspace_id}/folders`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    Folder.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in folders.js :')
                    console.log(err.response)
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
