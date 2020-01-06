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
                .with('folders.folders|files') // Get the folders and files of the the first level of subfolders
                .with('files|parent')
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
        async updateFolder({ commit }, folderToUpdate) {
            // If the folder has an ID, send a PUT request to update the existing record.
            // Else send POST request to create a new folder.
            let apiURL = `/api/folder`
            let requestMethod = 'post'
            if (folderToUpdate.id) {
                apiURL = `/api/folder/${folderToUpdate.id}`
                requestMethod = 'put'
            }

            await axios({
                method: requestMethod,
                url: apiURL,
                data: {
                    folder: folderToUpdate,
                },
            })
                .then(response => {
                    console.log(response.data)
                    // If the folder had no idea, set it's idea to the one returned from the API
                    if (!folderToUpdate.id) folderToUpdate.id = response.data.id
                    console.log(folderToUpdate)
                    commit('updateFolder', folderToUpdate)
                })
                .catch(err => {
                    console.log(err.response)
                })
        },
        async deleteFolder({ commit }, folderId) {
            commit('deleteFolder', folderId)

            await axios
                .delete(`/api/folder/${folderId}`)
                .then(response => {
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err.response)
                })
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        deleteFolder(state, folderId) {
            Folder.delete(folderId)
        },
        updateFolder(state, folder) {
            Folder.insert({ data: folder })
        },
    },
}
