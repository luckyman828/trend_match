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
        currentFileChanged: false,
        status: 'loading',
        currentFolderStatus: null,
        path: [],
        flyinVisible: false,
        fileUsersStatus: null,
    },

    getters: {
        loadingFiles: state => state.loading,
        filesStatus: state => state.status,
        getFilesStatus: state => state.status,
        getCurrentFileChanged: state => state.currentFileChanged,
        getCurrentFilePath: state => state.path,
        getCurrentFolderStatus: state => state.currentFolderStatus,
        currentFile: state => state.currentFile,
        getCurrentFile: state => state.currentFile,
        currentFolderId: state => state.currentFolderId,
        currentFolder: state => state.currentFolder,
        getCurrentFolder: state => state.currentFolder,
        files: state => state.files,
        allFiles: state => state.allFiles,
        getFileFlyinIsVisible: state => state.flyinVisible,
        nextFile: state => {
            const files = state.files.filter(x => x.type == 'File')
            // Find the index of the current file and add 1
            const index = files.findIndex(x => x.id == state.currentFile.id)
            // Check that the current file is not the last in the array
            if (index + 1 < files.length) {
                return files[index + 1]
            }
        },
        prevFile: state => {
            const files = state.files.filter(x => x.type == 'File')
            // Find the index of the current file and add 1
            const index = files.findIndex(x => x.id == state.currentFile.id)
            // Check that the current file is not the first in the array
            if (index > 0) {
                return files[index - 1]
            }
        },
        getFileUsersStatus: state => state.fileUsersStatus,
    },

    actions: {
        // Fetch the root files of the workspace
        async fetchFiles({ commit, state, rootGetters }, addToState = true) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            // Set the state to loading
            if (addToState) {
                commit('setLoading', true)
                commit('SET_CURRENT_FOLDER_STATUS', 'loading')
                commit('SET_FILES_STATUS', 'loading')
            }

            const apiUrl = `/workspaces/${workspaceId}/files`

            let tryCount = 3
            let success = false

            let files
            while (tryCount-- > 0 && !success) {
                try {
                    const response = await axios.get(`${apiUrl}`).catch(err => {
                        'error???'
                    })
                    files = response.data
                    if (addToState) {
                        state.files = files
                        commit('setLoading', false)
                        commit('SET_CURRENT_FOLDER_STATUS', 'success')
                        commit('SET_FILES_STATUS', 'success')
                    }
                    success = true
                } catch (err) {
                    if (tryCount <= 0) {
                        if (addToState) {
                            commit('setLoading', false)
                            commit('SET_CURRENT_FOLDER_STATUS', 'error')
                            commit('SET_FILES_STATUS', 'error')
                        }
                        throw err
                    }
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
        async fetchFile({ commit, state, rootGetters }, fileId) {
            // Set the state to loading
            commit('SET_FILES_STATUS', 'loading')

            const apiUrl = `/files/${fileId}`
            let file
            await axios
                .get(apiUrl)
                .then(response => {
                    file = response.data
                    commit('SET_CURRENT_FILE', file)
                    commit('SET_FILES_STATUS', 'success')
                })
                .catch(err => {
                    commit('SET_FILES_STATUS', 'error')
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
            commit('SET_CURRENT_FOLDER_STATUS', 'loading')
            commit('SET_CURRENT_FOLDER', folder)
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            // Assume root
            let apiUrl = `/workspaces/${workspaceId}/files`
            // Check if the folder to set is a folder or root
            if (folder) {
                apiUrl = `/files/${folder.id}/children`

                // Update our path
                commit('SET_CURRENT_PATH_FOLDER', folder)
            } else {
                // Reset the path
                commit('SET_CURRENT_PATH_FOLDER', null)
            }
            this.selected = []

            // Send API request to fetch folder content
            await axios
                .get(apiUrl)
                .then(response => {
                    Vue.set(state, 'files', response.data)
                    commit('SET_CURRENT_FOLDER_STATUS', 'success')
                })
                .catch(err => {
                    commit('SET_CURRENT_FOLDER_STATUS', 'error')
                })
        },
        async fetchFileOwners({ commit, state }, file) {
            // Get owners for file
            const apiUrl = `/files/${file.id}/users`
            await axios.get(apiUrl).then(response => {
                Vue.set(file, 'owners', response.data)
            })
        },
        async insertOrUpdateFile({ commit, dispatch }, { file, addToState = true }) {
            // console.log('insert or update', file, addToState)
            // Assume update
            let apiUrl = `/files/${file.id}`
            let requestMethod = 'put'
            let requestBody = file
            // commit('INSERT_FILE', file)
            // Check if we are inserting or updating
            if (!file.id) {
                // If we are inserting
                if (addToState) commit('INSERT_FILE', file)
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
                    // console.log('success!')
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
                    if (wasCreated) file.id = response.data.id
                    // console.log('done creating file', file)
                })
                .catch(err => {
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
        async deleteFile({ commit, dispatch }, file) {
            commit('deleteFile', file.id)

            const apiUrl = `/files/${file.id}`

            // Start timer for deletion
            let wasCancelled = false
            commit(
                'alerts/SHOW_SNACKBAR',
                {
                    msg: `${file.type} will be deleted`,
                    iconClass: 'fa-trash',
                    type: 'danger',
                    callback: () => {
                        wasCancelled = true
                        undoDelete()
                    },
                    callbackLabel: 'Undo',
                    timeoutCallback: () => {
                        if (!wasCancelled) {
                            sendRequest()
                        }
                    },
                },
                { root: true }
            )

            const sendRequest = async () => {
                await axios
                    .delete(apiUrl)
                    .then(response => {
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: `${file.type} permanently deleted`,
                                iconClass: 'fa-check',
                                type: 'success',
                            },
                            { root: true }
                        )
                    })
                    .catch(err => {
                        // Undo
                        undoDelete()
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
                                callback: () => dispatch('deleteFile', file),
                                callbackLabel: 'Retry',
                                duration: 0,
                            },
                            { root: true }
                        )
                    })
            }

            // Undo delete
            const undoDelete = () => {
                commit('INSERT_FILE', file)
            }
        },
        async deleteMultipleFiles({ commit, dispatch }, files) {
            commit('DELETE_MULTIPLE_FILES', files)

            // Start timer for deletion
            let wasCancelled = false
            commit(
                'alerts/SHOW_SNACKBAR',
                {
                    msg: `${files.length} files/folders will be deleted`,
                    iconClass: 'fa-trash',
                    type: 'danger',
                    callback: () => {
                        wasCancelled = true
                        undoDelete()
                    },
                    callbackLabel: 'Undo',
                    timeoutCallback: () => {
                        if (!wasCancelled) {
                            sendRequest()
                        }
                    },
                },
                { root: true }
            )

            const sendRequest = async () =>
                await Promise.all(
                    files.map(async file => {
                        const apiUrl = `/files/${file.id}`
                        await axios.delete(apiUrl).catch(err => {
                            // Undo
                            undoDelete()
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
                                    callback: () => dispatch('deleteFile', file),
                                    callbackLabel: 'Retry',
                                    duration: 0,
                                },
                                { root: true }
                            )
                        })
                    })
                ).then(response => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${files.length} files/folders permanently deleted`,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                })

            // Undo delete
            const undoDelete = () => {
                commit('INSERT_MULTIPLE_FILES', files)
            }
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
        moveFiles({ state, rootGetters, commit, dispatch }, { destinationFolderId, filesToMove, undo }) {
            // console.log('move files', destinationFolderId, filesToMove)

            let apiUrl = `/files/${destinationFolderId}/paste`
            if (destinationFolderId == 0) apiUrl = `/files/${rootGetters['workspaces/currentWorkspace'].id}/paste`
            // Send request to API
            const oldFolderId = filesToMove[0].parent_id
            axios
                .post(apiUrl, {
                    file_ids: filesToMove.map(x => x.id),
                })
                .then(response => {
                    // Commit mutation to state
                    if (!undo) {
                        filesToMove.map(x => {
                            commit('deleteFile', x.id)
                        })
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: `${filesToMove.length} files/folders moved`,
                                iconClass: 'fa-check',
                                type: 'success',
                                callback: () => {
                                    dispatch('moveFiles', { destinationFolderId: oldFolderId, filesToMove, undo: true })
                                    state.files = state.files.concat(filesToMove)
                                },
                                callbackLabel: 'Undo',
                            },
                            { root: true }
                        )
                    } else {
                        commit(
                            'alerts/SHOW_SNACKBAR',
                            {
                                msg: `Move undone`,
                                iconClass: 'fa-check',
                                type: 'success',
                            },
                            { root: true }
                        )
                    }
                })
                .catch(() => {})
        },
        async syncExternalImages({ commit, state, dispatch }, { file, products, progressCallback }) {
            return new Promise(async (resolve, reject) => {
                // Get owners for file
                const apiUrl = `/media/sync-bestseller-images?file_id=${file.id}`

                const imageMaps = []
                products.map(product => {
                    product.variants.map(variant => {
                        // console.log('variant to map', variant)
                        variant.pictures.map((picture, index) => {
                            if (!picture.url || picture.url.search('kollektcdn.com') >= 0) return // Don't upload images that don't exists or are already on our cdn
                            imageMaps.push({
                                mapping_id: variant.id,
                                datasource_id: product.datasource_id,
                                url: picture.url,
                                pictureIndex: index,
                            })
                        })
                    })
                })

                // console.log('sync image maps', imageMaps)

                // Return if we have no images to sync
                if (imageMaps.length <= 0) {
                    resolve()
                    return
                }

                const productsToUpdate = []

                // Chunk the images
                const array_chunks = (array, chunk_size) =>
                    Array(Math.ceil(array.length / chunk_size))
                        .fill()
                        .map((_, index) => index * chunk_size)
                        .map(begin => array.slice(begin, begin + chunk_size))
                const imageMapChunks = array_chunks(imageMaps, 8)

                // Upload a chunk at a time
                let chunkIndex = 1
                for await (const imageMaps of imageMapChunks) {
                    await axios
                        .post(apiUrl, {
                            max_height: 2016,
                            max_width: 1512,
                            images: imageMaps,
                        })
                        .then(async response => {
                            if (progressCallback) {
                                const progressPercentage = ((chunkIndex / imageMapChunks.length) * 100).toFixed(0)
                                progressCallback(progressPercentage)
                            }
                            const urlMaps = response.data.media_url_maps
                            // console.log('here are the uploaded images maps', urlMaps)

                            urlMaps.forEach((urlMap, index) => {
                                const product = products.find(product =>
                                    product.variants.find(variant => variant.id == urlMap.mapping_id)
                                )
                                if (!product) return
                                const variant = product.variants.find(variant => variant.id == urlMap.mapping_id)

                                if (!variant) return

                                const pictureIndex = imageMaps[index].pictureIndex

                                variant.pictures[pictureIndex].url = urlMap.cdn_url

                                const productAlreadyAdded = productsToUpdate.find(
                                    x => x.datasource_id == product.datasource_id
                                )
                                if (!productAlreadyAdded) productsToUpdate.push(product)
                            })
                        })
                        .catch(err => {
                            reject(err)
                        })
                    chunkIndex++
                }

                // Update the products when we are done uploading
                // console.log('we are done syncing. Update the products', productsToUpdate)
                await dispatch(
                    'products/updateManyProducts',
                    { file, products: productsToUpdate },
                    { root: true }
                ).catch(err => {
                    reject(err)
                })
                resolve()
            })
        },
        async cloneFileSelections({ commit }, { destination, from }) {
            const apiUrl = `/files/clone-selections`
            await axios
                .post(apiUrl, {
                    from_file_id: from.id,
                    to_file_id: destination.id,
                })
                .then(response => {})
        },
        fetchFileUsers({ commit }, file) {
            commit('SET_FILE_USERS_STATUS', 'loading')
            const apiUrl = `/files/${file.id}/users`
            axios
                .get(apiUrl)
                .then(response => {
                    Vue.set(file, 'users', response.data)
                    commit('SET_FILE_USERS_STATUS', 'success')
                })
                .catch(err => {
                    commit('SET_FILE_USERS_STATUS', 'error')
                })
        },
        async addUsersToFile({ commit }, { file, users }) {
            commit('ADD_USERS_TO_FILE', { file, users })

            await Promise.all(
                users.map(async user => {
                    const apiUrl = `/files/${file.id}/users/${user.id}`
                    await axios.put(apiUrl)
                })
            )
                .then(() => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${users.length} users added`,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    commit('REMOVE_USERS_FROM_FILE', { file, users })
                })
        },
        async removeUsersFromFile({ commit }, { file, users }) {
            commit('REMOVE_USERS_FROM_FILE', { file, users })

            await Promise.all(
                users.map(async user => {
                    const apiUrl = `/files/${file.id}/users/${user.id}`
                    await axios.delete(apiUrl)
                })
            )
                .then(() => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            msg: `${users.length} users removed`,
                            iconClass: 'fa-check',
                            type: 'success',
                        },
                        { root: true }
                    )
                })
                .catch(err => {
                    commit('ADD_USERS_TO_FILE', { file, users })
                })
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        SET_CURRENT_FOLDER_STATUS(state, status) {
            state.currentFolderStatus = status
        },
        SET_FILES_STATUS(state, status) {
            state.status = status
        },
        INSERT_FILE(state, file) {
            state.files.push(file)
        },
        INSERT_MULTIPLE_FILES(state, files) {
            state.files.push(...files)
        },
        SET_CURRENT_FILE(state, file) {
            state.currentFileChanged = true
            state.currentFile = file
        },
        SET_CURRENT_FILE_CHANGED(state, bool) {
            state.currentFileChanged = bool
        },
        SET_CURRENT_FOLDER(state, folder) {
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
        DELETE_MULTIPLE_FILES(state, files) {
            // Remove the deleted item from the current array
            for (let i = files.length - 1; i >= 0; i--) {
                const file = files[i]
                const index = state.files.findIndex(x => x.id == file.id)
                state.files.splice(index, 1)
            }
        },
        REMOVE_UNSAVED_FILES(state) {
            state.files = state.files.filter(x => !!x.id)
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
        SET_CURRENT_PATH_FOLDER(state, folder) {
            // If no folder set the path to an empty array
            if (!folder) state.path = []
            else {
                // Check if the folder already exists in our path
                const index = state.path.findIndex(x => x.id == folder.id)
                // If the folder exists, remove all folders after it
                if (index >= 0) state.path.splice(index + 1)
                // Else add it to the path
                else state.path.push(folder)
            }
        },
        ADD_USERS_TO_FILE(state, { file, users }) {
            file.users.push(...users)
        },
        REMOVE_USERS_FROM_FILE(state, { file, users }) {
            for (let i = users.length - 1; i >= 0; i--) {
                const user = users[i]
                const index = file.users.findIndex(x => x.id == user.id)
                file.users.splice(index, 1)
            }
        },
        SET_FILE_USERS_STATUS(state, status) {
            state.fileUsersStatus = status
        },
    },
}
