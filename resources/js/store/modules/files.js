import axios from 'axios'
import Collection from '../models/Collection'
import User from '../models/User'
import Product from '../models/Product'

export default {
    namespaced: true,

    state: {
        loading: true,
        files: [],
        filesUpdated: false,
        availableFileIds: [],
        currentFile: null,
        currentFolder: null,
    },

    getters: {
        loadingFiles: state => state.loading,
        filesUpdated: state => state.filesUpdated,
        availableFileIds: state => state.availableFileIds,
        currentFile: state => state.currentFile,
        currentFolder: state => state.currentFolder,
        files: state => state.files,
        nextFileId: (state, getters, rootState, rootGetters) => {
            const availableIds = getters.availableFileIds
            const currentId = rootGetters['persist/currentFileId']
            // return currentId
            if (currentId && availableIds.length > 0) {
                const currentIndex = availableIds.findIndex(x => x == currentId)
                if (currentIndex < availableIds.length - 1) {
                    return availableIds[currentIndex + 1]
                }
            }
        },
        prevFileId: (state, getters, rootState, rootGetters) => {
            const availableIds = getters.availableFileIds
            const currentId = rootGetters['persist/currentFileId']
            // return currentId
            if (currentId && availableIds.length > 0) {
                const currentIndex = availableIds.findIndex(x => x == currentId)
                if (currentIndex != 0) {
                    return availableIds[currentIndex - 1]
                }
            }
        },
    },

    actions: {
        async fetchFiles({ commit, state, rootGetters }) {
            const workspaceId = rootGetters['workspaces/currentWorkspace'].id
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `${process.env.MIX_KOLLEKT_API_URL_BASE}/workspaces/${workspaceId}/files`

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
        async insertOrUpdateFile({ commit }, file) {
            // Assume update
            let apiUrl = `${process.env.MIX_KOLLEKT_API_URL_BASE}/files/${file.id}`
            let requestMethod = 'put'
            // Check if we are inserting or updating
            if (!file.id) {
                // If we are inserting
                requestMethod = 'post'
                // Check if we are inserting in ROOT or in an existing folder
                if (file.parent_id == 0) {
                    apiUrl = `${process.env.MIX_KOLLEKT_API_URL_BASE}/workspaces/${file.workspace_id}/files`
                } else {
                    apiUrl = `${process.env.MIX_KOLLEKT_API_URL_BASE}/files`
                }
            }

            await axios({
                method: requestMethod,
                url: apiUrl,
                data: file,
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
        async uploadFile({ commit, dispatch }, newFile) {
            let uploadSucces = true
            // Check if we have any products to upload
            if (newFile.products && newFile.products.length > 0) {
                // Upload products to DB
                uploadSucces = false
                // Check if
                const uploadApiUrl = `api/file/${newFile.id}/products`

                // Loop through the products and format their data correctly for the API
                const productsToUpload = []
                newFile.products.forEach(product => {
                    // Stringify their json values
                    product.prices = JSON.stringify(product.prices)
                    product.eans = JSON.stringify(product.eans)
                    product.assortments = JSON.stringify(product.assortments)
                    product.color_variants = JSON.stringify(product.color_variants)

                    // Correctly format date
                    // First test that the date has actually been set
                    if (product.delivery_date) {
                        // Check for special cases where the date is of format mmm-yy ("jan-20") which will be parsed incorrectly by the new Date() function
                        // Regex that looks for a work with exactly 3 characters between A-z.
                        const reg = new RegExp('\\b[A-z]{3}\\b')
                        if (reg.test(product.delivery_date)) {
                            // If true then add a "1-" to the date to avoid ambiguity
                            product.delivery_date = '1-' + product.delivery_date
                        }

                        const theDate = new Date(product.delivery_date)

                        // Change the delivery_date format back to MySQL Date format (yyyy-mm-dd)
                        // Long code to account for timezone differences
                        product.delivery_date = new Date(theDate.getTime() - theDate.getTimezoneOffset() * 60000)
                            .toJSON()
                            .slice(0, 10)
                    }

                    productsToUpload.push(product)
                })

                await axios
                    .post(uploadApiUrl, {
                        products: productsToUpload,
                    })
                    .then(response => {
                        console.log('succes')
                        console.log(response.data)
                        uploadSucces = true
                    })
                    .catch(err => {
                        console.log('error')
                        console.log(err.response)
                        uploadSucces = false
                    })
            }

            // If success create a file (collection) for the products
            if (uploadSucces) {
                dispatch('updateFile', newFile)
            }
            return uploadSucces
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
                    commit('setFilesUpdated', true)
                })
                .catch(err => {
                    console.log(err.response)
                })
        },
        async uploadToExistingFile({ commit, dispatch }, file) {
            // Upload products to DB
            let uploadSucces = false

            const uploadApiUrl = `${process.env.MIX_UPLOAD_API_URL_BASE}/hooks/import-csv?collection_id=${file.id}`
            const axiosConfig = {
                headers: {
                    'X-Kollekt-App-Key': process.env.MIX_KOLLEKT_APP_API_KEY,
                },
            }
            let data = new FormData()
            // Append the files
            file.files.forEach(file => {
                data.append('files', file)
            })

            // console.log(data)

            await axios
                .post(uploadApiUrl, data, axiosConfig)
                // .post(proxyUrl + uploadApiUrl, data, axiosConfig)
                .then(response => {
                    console.log('succes')
                    console.log(response.data)
                    uploadSucces = true
                    commit('setFilesUpdated', true)
                })
                .catch(err => {
                    console.log('error')
                    console.log(err)
                    uploadSucces = false
                })
            return uploadSucces
        },
        async deleteFile({ commit }, fileId) {
            commit('deleteFile', fileId)

            await axios
                .delete(`/api/file`, {
                    data: {
                        file_id: fileId,
                    },
                })
                .then(response => {
                    console.log(response.data)
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
        addUsersToFile({ commit }, { file, usersToAdd }) {
            // Commit mutation to state
            commit('addUsersToFile', { file, usersToAdd })
            // Send request to API
        },
        removeUserFromFile({ commit }, { file, user }) {
            // Commit mutation to state
            commit('removeUserFromFile', { file, user })
            // Send request to API
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
        setCurrentFile({ commit }, file) {
            // Get the current file form store
            const fileToSet = Collection.query()
                .with('selections')
                .find(file.id)
            commit('setCurrentFile', fileToSet)
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        setFilesUpdated(state, bool) {
            state.filesUpdated = bool
        },
        deleteFile(state, fileId) {
            Collection.delete(fileId)
        },
        setAvailableFileIds(state, fileIds) {
            state.availableFileIds = fileIds
        },
        addUsersToFile(state, { file, usersToAdd }) {
            file.owners = file.owners.concat(usersToAdd)
        },
        removeUserFromFile(state, { file, user }) {
            const userIndex = file.owners.findIndex(x => x.id == user.id)
            file.owners.splice(userIndex, 1)
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
