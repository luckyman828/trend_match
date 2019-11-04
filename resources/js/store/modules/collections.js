import axios from 'axios'
import Collection from '../models/Collection'
import User from '../models/User'
import Product from '../models/Product'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingCollections: state => {
            return state.loading
            //comment
        },
        files: (state, getters, rootState, rootGetters) => {
            if (!rootGetters['persist/loadingInit'] && !rootGetters['products/loadingProducts']) {
                const files = Collection.query()
                    .with('teams.actions')
                    .with('teamFiles')
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
        // userTasks(state, getters, rootState, rootGetters) {
        //     if (!rootGetters['persist/loadingInit'] && rootGetters['persist/currentTeam'] != null) {
        //         const tasks = rootGetters['persist/currentTeam'].taskTeams
        //         const userPermissionLevel = rootGetters['persist/userPermissionLevel']
        //         let tasksToReturn = []
        //         tasks.forEach(task => {
        //             if (task.role_id == userPermissionLevel) tasksToReturn.push(task.task)
        //         })
        //         return tasksToReturn
        //     }
        // },
        // currentTask(state, getters, rootState, rootGetters) {
        //     if (!rootGetters['persist/loadingInit']) {
        //         let taskToReturn
        //         if (getters.userTasks.length > 0 && getters.currentFile != null) {
        //             if (getters.userTasks != null) {
        //                 if (getters.userTasks[0] != null) {
        //                     getters.userTasks.forEach(task => {
        //                         if (task.parents != null) {
        //                             if (task.parents.length > 0) {
        //                                 let parentsCompleted = true
        //                                 task.parents.forEach(parent => {
        //                                     if (parent.completed.length < 1) {
        //                                         parentsCompleted = false
        //                                     }
        //                                 })
        //                                 if (parentsCompleted && task.phase_id == getters.currentFile.phase)
        //                                     taskToReturn = task
        //                             }
        //                         } else if (task.phase_id == getters.currentFile.phase) {
        //                             taskToReturn = task
        //                         }
        //                     })
        //                 }
        //             }
        //             return taskToReturn
        //         }
        //     }
        // },
        actionScope(state, getters, rootState, rootGetters) {
            if (getters.currentTask != null) {
                const type = getters.currentTask.type
                if (type == 'feedback') {
                    return 'user'
                } else return 'task'
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
            // Generate uuid for new file
            newFile.id = this._vm.$uuid.v4()
            console.log(newFile)

            // Upload products to DB
            let uploadSucces = false

            const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
            const uploadApiUrl = `https://api-beta.kollekt.dk/hooks/import-csv?collection_id=${newFile.id}`
            const axiosConfig = {
                headers: {
                    'X-Kollekt-App-Key': 'mnkAEefWBEL7cY1gEetlW4dM_YYL9Vu4K6dmavW2',
                },
            }
            let data = new FormData()
            // Append the files
            newFile.files.forEach(file => {
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
                })
                .catch(err => {
                    console.log('error')
                    console.log(err)
                    uploadSucces = false
                })

            // If success create a file (collection) for the products
            if (uploadSucces) {
                dispatch('updateFile', newFile)
            }
            return uploadSucces

            // Collection.create({ data: response.data })
        },
        async updateFile({ commit }, fileToUpdate) {
            await axios
                .put(`/api/file`, {
                    id: fileToUpdate.id,
                    title: fileToUpdate.title,
                    phase: fileToUpdate.phase,
                    catalog_id: fileToUpdate.folderId,
                    workspace_id: fileToUpdate.workspace_id,
                })
                .then(response => {
                    console.log(response.data)
                    Collection.insert({ data: response.data })
                })
                .catch(err => {
                    console.log(err)
                })
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
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        deleteFile(state, fileId) {
            Collection.delete(fileId)
        },
    },
}
