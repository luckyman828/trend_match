import axios from 'axios'
import Vue from 'vue'
import Collection from '../models/Collection'
import User from '../models/User'
import Product from '../models/Product'

export default {
    namespaced: true,

    state: {
        loading: true,
        files: [],
        availableFileIds: [],
        currentFile: null,
        currentFolder: null,
        status: null,
    },

    getters: {
        loadingFiles: state => state.loading,
        filesStatus: state => state.status,
        currentFile: state => state.currentFile,
        currentFolder: state => state.currentFolder,
        files: state => state.files,
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
        async fetchFiles({ commit, state, rootGetters }) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/workspaces/${workspaceId}/files`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    state.files = response.data
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    if (tryCount <= 0) throw err
                }
            }
        },
        async fetchFile({ commit, state, rootGetters }, fileid) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            // Set the state to loading
            commit('setFilesStatus', 'loading')

            const apiUrl = `/files/${fileid}`
            await axios
                .get(apiUrl)
                .then(response => {
                    commit('setCurrentFile', response.data)
                    commit('setFilesStatus', 'success')
                })
                .catch(err => {
                    commit('setFilesStatus', 'error')
                })
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
                state.currentFolder = folder
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
                commit('updateFile', file)
            }

            await axios({
                method: requestMethod,
                url: apiUrl,
                data: requestBody,
            })
                .then(async response => {
                    console.log(response.data)
                    // Set the files ID if not already set
                    if (!file.id) file.id = response.data.id
                })
                .catch(err => {
                    console.log(err)
                })
        },
        async deleteFile({ commit }, fileId) {
            commit('deleteFile', fileId)

            const apiUrl = `/files/${fileId}`
            await axios
                .delete(apiUrl)
                .then(response => {
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err.response)
                })
        },
        async updateFile({ commit }, fileToUpdate) {
            const startDate = fileToUpdate.start_date ? fileToUpdate.start_date : null
            const endDate = fileToUpdate.end_date ? fileToUpdate.end_date : null
            // Add support for both catalog id and folder id
            let folder_id = null
            if (fileToUpdate.folder_id) {
                folder_id = fileToUpdate.folder_id
            }
            if (fileToUpdate.catalog_id) {
                folder_id = fileToUpdate.catalog_id
            }

            await axios
                .put(`/api/file`, {
                    id: fileToUpdate.id,
                    title: fileToUpdate.title,
                    phase: fileToUpdate.phase,
                    catalog_id: folder_id,
                    folder_id: folder_id,
                    workspace_id: fileToUpdate.workspace_id,
                    start_date: startDate,
                    end_date: endDate,
                })
                .then(response => {
                    console.log(response.data)
                    // Commit to store
                    Collection.insert({ data: response.data })
                })
                .catch(err => {
                    console.log(err.response)
                })
        },
        async resetFile({ commit }, fileId) {
            console.log('resetting file!')

            await axios
                .post(`/api/file/reset`, {
                    file_id: fileId,
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(err => {
                    console.log(err.response)
                })
        },
        async setNextFileAsCurrent({ dispatch, getters }) {
            if (getters.nextFileId) dispatch('persist/setCurrentFileId', getters.nextFileId, { root: true })
        },
        async setPrevFileAsCurrent({ dispatch, getters }) {
            if (getters.prevFileId) dispatch('persist/setCurrentFileId', getters.prevFileId, { root: true })
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
        setCurrentFile(state, file) {
            state.currentFile = file
        },
        updateFile(state, file) {
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
        setCurrentFile(state, file) {
            state.currentFile = file
        },
    },
}
