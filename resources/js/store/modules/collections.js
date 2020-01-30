import axios from 'axios'
import Collection from '../models/Collection'
import User from '../models/User'
import Product from '../models/Product'

export default {
    namespaced: true,

    state: {
        loading: true,
        filesUpdated: false,
        availableFileIds: [],
    },

    getters: {
        loadingCollections: state => {
            return state.loading
        },
        filesUpdated: state => {
            return state.filesUpdated
        },
        availableFileIds: state => {
            return state.availableFileIds
        },
        files: (state, getters, rootState, rootGetters) => {
            if (!rootGetters['persist/loadingInit'] && !rootGetters['products/loadingProducts']) {
                const files = Collection.query()
                    .with('teams.actions')
                    .with('teamFiles')
                    .with('subfiles')
                    .all()
                const users = User.query()
                    .with('teams.teamFiles')
                    .with('actions')
                    .all()

                // Get the users that has access to the file
                files.forEach(file => {
                    file.users = []
                    // Create a
                    // const teamsa = JSON.parse(JSON.stringify(file.teams))
                    // const teamsCopy = Object.assign([], file.teams)
                    const teamsCopy = JSON.parse(JSON.stringify(file.teams))
                    const usersCopy = JSON.parse(JSON.stringify(users))
                    usersCopy.forEach(user => {
                        // Determine if the user has access
                        let hasAccess = false
                        if (user.role_id <= 2) {
                            user.teams.forEach(team => {
                                team.teamFiles.forEach(teamFile => {
                                    if (teamFile.file_id == file.id && teamFile.role_level <= user.role_id)
                                        hasAccess = true
                                })
                            })
                        } else hasAccess = true
                        if (hasAccess) {
                            file.users.push(user)

                            // Calculate progress for the user
                            user.products = file.products.length
                            if (user.actions.length > 0) {
                                user.progressRaw =
                                    Math.round((user.actions.length / file.products.length) * 100 * 1) / 1
                                user.progress = `${user.progressRaw}%`
                            } else {
                                user.progressRaw = 0
                                user.progress = `${user.progressRaw}%`
                            }
                        }
                    })

                    // Calculate progress for every TEAM
                    teamsCopy.forEach(team => {
                        team.progressRaw = Math.round((team.actions.length / file.products.length) * 100 * 1) / 1
                        team.progress = `${team.progressRaw}%`
                    })
                    file.teams = teamsCopy

                    // Sort teams by progress
                    file.teams.sort((a, b) => {
                        return a.progressRaw < b.progressRaw ? 1 : -1
                    })
                    // Sort users by progress
                    file.users.sort((a, b) => {
                        return a.progressRaw < b.progressRaw ? 1 : -1
                    })
                })
                return files
            }
        },
        currentFile: (state, getters, rootState, rootGetters) => {
            if (!rootGetters['persist/loadingInit'] && !rootGetters['products/loadingProducts']) {
                const currentFileId = rootGetters['persist/currentFileId']
                const files = getters.files
                return files != null ? files.find(x => x.id == currentFileId) : null
            }
        },
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
        currentTeamUsers(state, getters, rootState, rootGetters) {
            if (!rootGetters['persist/loadingInit'] && !rootGetters['products/loadingProducts']) {
                const currentTeamId = rootGetters['persist/teamFilterId']
                const teams = rootGetters['entities/teams/teams']
                const currentFile = getters.currentFile
                let usersToReturn = []
                if (currentFile) {
                    if (currentTeamId > 0) {
                        const thisTeam = teams.find(team => team.id == currentTeamId)
                        if (thisTeam) {
                            thisTeam.users.forEach(user => {
                                if (currentFile.users) {
                                    const fileUser = currentFile.users.find(x => x.id == user.id)
                                    if (fileUser) usersToReturn.push(fileUser)
                                }
                            })
                        }
                    }
                    return usersToReturn
                }
            }
        },
    },

    actions: {
        async fetchCollections({ commit }, workspace_id) {
            // Set the state to loading
            console.log('fethcing collections')
            commit('setLoading', true)

            const apiUrl = `/api/workspace/${workspace_id}/files`

            let tryCount = 3
            let succes = false
            const response = await axios
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    Collection.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in collections.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        async uploadFile({ commit, dispatch }, newFile) {
            let uploadSucces = true
            console.log(newFile)
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
                        console.log('Delivery Date')
                        console.log(product.delivery_date)
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

                console.log('Products')
                console.log(productsToUpload)

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
            let catalog_id = null
            if (fileToUpdate.folderId) {
                catalog_id = fileToUpdate.folderId
            } else if (fileToUpdate.catalog_id) {
                catalog_id = fileToUpdate.catalogId
            }

            await axios
                .put(`/api/file`, {
                    id: fileToUpdate.id,
                    title: fileToUpdate.title,
                    phase: fileToUpdate.phase,
                    catalog_id: catalog_id,
                    folder_id: catalog_id,
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
    },
}
