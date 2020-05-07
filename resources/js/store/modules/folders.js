import axios from 'axios'

export default {
    namespaced: true,

    state: {
        currentFolder: null,
    },

    getters: {
        currentFolder: state => state.currentFolder,
    },

    actions: {
        // async updateFolder({ commit }, folderToUpdate) {
        //     // If the folder has an ID, send a PUT request to update the existing record.
        //     // Else send POST request to create a new folder.
        //     let apiURL = `/api/folder`
        //     let requestMethod = 'post'
        //     if (folderToUpdate.id) {
        //         apiURL = `/api/folder/${folderToUpdate.id}`
        //         requestMethod = 'put'
        //     }

        //     await axios({
        //         method: requestMethod,
        //         url: apiURL,
        //         data: {
        //             folder: folderToUpdate,
        //         },
        //     })
        //         .then(response => {
        //             console.log(response.data)
        //             // If the folder had no idea, set it's idea to the one returned from the API
        //             if (!folderToUpdate.id) folderToUpdate.id = response.data.id
        //             console.log(folderToUpdate)
        //             commit('updateFolder', folderToUpdate)
        //         })
        //         .catch(err => {
        //             // console.log(err.response)
        //         })
        // },
        // async deleteFolder({ commit }, folderId) {
        //     commit('deleteFolder', folderId)

        //     await axios
        //         .delete(`/api/folder/${folderId}`)
        //         .then(response => {
        //             console.log(response.data)
        //         })
        //         .catch(err => {
        //             console.log(err.response)
        //         })
        // },
        addUsersToFolder({ commit }, { folder, usersToAdd }) {
            // Commit mutation to state
            commit('addUsersToFolder', { folder, usersToAdd })
            // Send request to API
        },
        removeUserFromFolder({ commit }, { folder, user }) {
            // Commit mutation to state
            commit('removeUserFromFolder', { folder, user })
            // Send request to API
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
        addUsersToFolder(state, { folder, usersToAdd }) {
            folder.owners = folder.owners.concat(usersToAdd)
        },
        removeUserFromFolder(state, { folder, user }) {
            const userIndex = folder.owners.findIndex(x => x.id == user.id)
            folder.owners.splice(userIndex, 1)
        },
    },
}
