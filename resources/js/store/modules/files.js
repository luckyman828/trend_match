import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        loading: true,
        files: [],
        allFiles: [],
        availableFileIds: [],
        currentFile: null,
        currentFolder: null,
        status: null,
        flyinVisible: false,
    },

    getters: {
        loadingFiles: state => state.loading,
        filesStatus: state => state.status,
        currentFile: state => state.currentFile,
        currentFolderId: state => state.currentFolderId,
        currentFolder: state => state.currentFolder,
        files: state => state.files,
        allFiles: state => state.allFiles,
        getFileFlyinIsVisible: state => state.flyinVisible,
        nextFile: state => {
            // Find the index of the current file and add 1
            const index = state.files.findIndex(x => x.id == state.currentFile.id)
            // Check that the current file is not the last in the array
            if (index + 1 < state.files.length) {
                return state.files[index + 1]
            }
        },
        prevFile: state => {
            // Find the index of the current file and add 1
            const index = state.files.findIndex(x => x.id == state.currentFile.id)
            // Check that the current file is not the first in the array
            if (index > 0) {
                return state.files[index - 1]
            }
        },
    },

    actions: {
        // Fetch the root files of the workspace
        async fetchFiles({ commit, state, rootGetters }, addToState = true) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            // Set the state to loading
            if (addToState) commit('setLoading', true)

            const apiUrl = `/workspaces/${workspaceId}/files`

            let tryCount = 3
            let succes = false

            let files
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    files = response.data
                    if (addToState) state.files = files
                    if (addToState) commit('setLoading', false)
                    succes = true
                } catch (err) {
                    if (tryCount <= 0) throw err
                }
            }
            return files
        },
        // Fetch all the files of the workspace in a flat structure
        async fetchAllFiles({ commit, state, rootGetters }) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id

            const apiUrl = `/workspaces/${workspaceId}/files/flat`

            let files
            await axios.get(`${apiUrl}`).then(response => {
                state.allFiles = response.data
                files = response.data
            })
            return files
        },
        async fetchFile({ commit, state, rootGetters }, fileid) {
            // Set the state to loading
            commit('setFilesStatus', 'loading')

            const apiUrl = `/files/${fileid}`
            let file
            await axios
                .get(apiUrl)
                .then(response => {
                    file = response.data
                    commit('SET_CURRENT_FILE', file)
                    commit('setFilesStatus', 'success')
                })
                .catch(err => {
                    commit('setFilesStatus', 'error')
                })
            return file
        },
        async fetchFolder({ commit }, folderId) {
            const apiUrl = `/files/${folderId}`
            let folder
            await axios
                .get(apiUrl)
                .then(response => {
                    folder = response.data
                })
                .catch(err => {})
            return folder
        },
        async fetchFolderContent({ commit }, folderId) {
            const apiUrl = `/files/${folderId}/children`
            let files
            await axios
                .get(apiUrl)
                .then(response => {
                    files = response.data
                })
                .catch(err => {})
            return files
        },
        async setCurrentFolder({ commit, state, rootGetters }, folder) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            // Assume root
            let apiUrl = `/workspaces/${workspaceId}/files`

            // Check if the folder to set is a folder or root
            if (folder) {
                apiUrl = `/files/${folder.id}/children`
            }
            await axios.get(apiUrl).then(response => {
                Vue.set(state, 'files', response.data)
                commit('setCurrentFolder', folder)
            })
        },
        async fetchFileOwners({ commit, state }, file) {
            // Get owners for file
            const apiUrl = `/files/${file.id}/users`
            await axios.get(apiUrl).then(response => {
                Vue.set(file, 'owners', response.data)
            })
        },
        async insertOrUpdateFile({ commit }, file) {
            // Assume update
            let apiUrl = `/files/${file.id}`
            let requestMethod = 'put'
            let requestBody = file
            // Check if we are inserting or updating
            if (!file.id) {
                // If we are inserting
                commit('insertFile', file)
                requestMethod = 'post'
                // Check if we are inserting in ROOT or in an existing folder
                if (file.parent_id == 0) {
                    apiUrl = `/workspaces/${file.workspace_id}/files`
                } else {
                    apiUrl = `/files/${file.parent_id}/children`
                    requestBody = { type: file.type, name: file.name }
                }
            } else {
                commit('UPDATE_FILE', file)
            }

            await axios({
                method: requestMethod,
                url: apiUrl,
                data: requestBody,
            })
                .then(async response => {
                    console.log(response.data)
                    // Display message
                    const wasCreated = !file.id
                    const successMsg = wasCreated ? `${file.type} created` : `${file.type} updated`
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: successMsg,
                            iconClass: 'fa-check',
                            type: 'success',
                            callback: file.type == 'File' ? () => showNewFile() : false,
                            callbackLabel: file.type == 'File' && `View ${file.type}`,
                        },
                        { root: true }
                    )
                    // Set the files ID if not already set
                    if (!file.id) file.id = response.data.id
                })
                .catch(err => {
                    console.log(err)
                    // Display message
                    const errMsg = file.id
                        ? `Error when creating ${file.type}. Please try again.`
                        : `Error when updating ${file.type}. Please try again.`
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: errMsg,
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('insertOrUpdateFile', file),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })

            const showNewFile = () => {
                commit('SET_CURRENT_FILE', file)
                // Show the flyin
                commit('SET_FILE_FLYIN_VISIBLE', true)
            }
        },
        async deleteFile({ commit }, fileId) {
            commit('deleteFile', fileId)

            const apiUrl = `/files/${fileId}`
            await axios
                .delete(apiUrl)
                .then(response => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${file.type} deleted`,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    console.log(err.response)
                    // Display message
                    const errMsg = file.id
                        ? `Error when deleting ${file.type}. Please try again.`
                        : `Error when deleting ${file.type}. Please try again.`
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: errMsg,
                            iconClass: 'fa-exclamation-triangle',
                            type: 'warning',
                            callback: () => dispatch('insertOrUpdateFile', file),
                            callbackLabel: 'Retry',
                            duration: 0,
                        },
                        { root: true }
                    )
                })
        },
        async addUsersToFile({ commit }, { file, users }) {
            commit('addOwnersToFile', { file, users })

            // Loop through the users and post them
            users.forEach(user => {
                const apiUrl = `/files/${file.id}/users/${user.id}`
                axios.put(apiUrl)
            })
        },
        removeUserFromFile({ commit }, { file, user }) {
            // Commit mutation to state
            commit('removeUserFromFile', { file, user })
            // Send request to API
            const apiUrl = `/files/${file.id}/users/${user.id}`
            axios.delete(apiUrl)
        },
        addApproversToFile({ commit }, { file, usersToAdd }) {
            // Commit mutation to state
            commit('addApproversToFile', { file, usersToAdd })
            // Send request to API
        },
        removeApproversFromFile({ commit }, { file, user }) {
            // Commit mutation to state
            commit('removeApproverFromFile', { file, user })
            // Send request to API
        },
        moveFiles({ commit }, { destinationFolder, filesToMove }) {
            // Send request to API
            const apiUrl = `/files/${destinationFolder.id}/paste`
            axios
                .post(apiUrl, {
                    file_ids: filesToMove.map(x => x.id),
                })
                .then(response => {
                    // Commit mutation to state
                    filesToMove.map(x => {
                        commit('deleteFile', x.id)
                    })
                })
                .catch(() => {})
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        setFilesStatus(state, status) {
            state.status = status
        },
        insertFile(state, file) {
            state.files.push(file)
        },
        SET_CURRENT_FILE(state, file) {
            state.currentFile = file
        },
        setCurrentFolder(state, folder) {
            state.currentFolder = folder
        },
        UPDATE_FILE(state, file) {
            // Remove unsaved files
            const oldFile = state.files.find(x => x.id == file.id)
            Object.assign(oldFile, file)
        },
        deleteFile(state, fileId) {
            // Remove the deleted item from the current array
            const index = state.files.findIndex(x => x.id == fileId)
            state.files.splice(index, 1)
        },
        removeUnsavedFiles(state) {
            state.files = state.files.filter(x => x.id != null)
        },
        setAvailableFileIds(state, fileIds) {
            state.availableFileIds = fileIds
        },
        addOwnersToFile(state, { file, users }) {
            if (file.owners) {
                Vue.set(file, 'owners', file.owners.concat(users))
            } else {
                Vue.set(file, 'owners', users)
            }
            // Update user owner count
            Vue.set(file, 'owner_count', file.owners.length)
        },
        removeUserFromFile(state, { file, user }) {
            const userIndex = file.owners.findIndex(x => x.id == user.id)
            file.owners.splice(userIndex, 1)
            // Update user owner count
            Vue.set(file, 'owner_count', file.owners.length)
        },
        addApproversToFile(state, { file, usersToAdd }) {
            file.approvers = file.approvers.concat(usersToAdd)
        },
        removeApproverFromFile(state, { file, user }) {
            const userIndex = file.approvers.findIndex(x => x.id == user.id)
            file.approvers.splice(userIndex, 1)
        },
        SET_FILE_FLYIN_VISIBLE(state, bool) {
            state.flyinVisible = bool
        },
    },
}
