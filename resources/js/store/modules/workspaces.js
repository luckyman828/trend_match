import axios from 'axios'
import Compressor from 'compressorjs'

export default {
    namespaced: true,

    state: {
        workspaces: [],
        currentWorkspaceIndex: localStorage.getItem('workspace-index') || null,
        loading: true,
        availableWorkspaceRoles: [
            {
                role: 'Member',
                description: 'A basic user with no special rights',
            },
            {
                role: 'Admin',
                description: 'Can do some special move and rewoke powers.',
            },
            // {
            //     role: 'Owner',
            //     description: 'The owner.',
            // },
        ],
    },

    getters: {
        loadingWorkspaces: state => state.loading,
        workspaces: state => state.workspaces,
        availableWorkspaceRoles: state => state.availableWorkspaceRoles,
        currentWorkspaceIndex: state => state.currentWorkspaceIndex,
        currentWorkspace: state => state.workspaces[state.currentWorkspaceIndex],
        authUserWorkspaceRole: (state, getters) => {
            if (!getters.currentWorkspace) return 'Undefined'
            if (getters.currentWorkspace.role == 'Owner') return 'Admin'
            return getters.currentWorkspace ? getters.currentWorkspace.role : 'Undefined'
        },
        getRealWorkspaceRole: (state, getters) => {
            if (!getters.currentWorkspace) return 'Undefined'
            return getters.currentWorkspace.role
        },
    },

    actions: {
        async fetchWorkspaces({ commit }) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/workspaces`

            let tryCount = 3
            let success = false
            let workspaces = []
            while (tryCount-- > 0 && !success) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    commit('setWorkspaces', response.data)
                    commit('setLoading', false)
                    success = true
                    workspaces = response.data
                } catch (err) {
                    console.log('API error in workspaces.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
            return workspaces
        },
        async setCurrentWorkspaceIndex({ commit }, index) {
            // Reset the current folder ID
            commit('files/SET_CURRENT_FOLDER', null, { root: true })
            commit('setCurrentWorkspaceIndex', index)
        },
        async fetchWorkspace({ state }, workspaceId) {
            const apiUrl = `/workspaces/${workspaceId}`
            let workspace
            await axios.get(apiUrl).then(response => {
                workspace = response.data
                const stateWorkspace = state.workspaces.find(x => x.id == workspace.id)
                if (stateWorkspace) {
                    Vue.set(stateWorkspace, workspace)
                }
            })
            return workspace
        },
        async uploadWorkspaceCoverImage({ getters, dispatch }, image) {
            const workspace = getters.currentWorkspace
            console.log('upload cover image', image)
            // First generate presigned URL we can put the image to from the API
            const apiUrl = `/workspaces/${workspace.id}/generate-presigned-cover`
            let presignedUrl
            await axios.get(apiUrl).then(response => {
                presignedUrl = response.data
            })

            // PRE-COMPRESS THE IMAGE
            let compressedImage = image
            await new Promise((resolve, reject) => {
                new Compressor(image, {
                    quality: 0.8,
                    checkOrientation: true,
                    maxHeight: 1080,
                    success(result) {
                        compressedImage = result
                        resolve()
                    },
                    error(err) {
                        console.log(err.message)
                        reject()
                    },
                })
            })

            // Next configure a request to the presigned URL
            const uploadUrl = presignedUrl.presigned_url

            let blob = new Blob([compressedImage], { type: compressedImage.type })
            let xhr = new XMLHttpRequest()
            await new Promise((resolve, reject) => {
                xhr.open('PUT', uploadUrl)
                xhr.setRequestHeader('x-amz-acl', 'public-read')
                xhr.setRequestHeader('Content-Type', 'image/jpeg')
                xhr.onload = () => resolve(xhr)
                xhr.onerror = () => reject(xhr)
                xhr.send(blob)
            })
                .then(response => {
                    // On success, set the image on the picture
                    let newUrl = presignedUrl.url
                    // Change the URL from https to https
                    if (newUrl.indexOf('https') < 0) {
                        newUrl = newUrl.slice(0, 4) + 's' + newUrl.slice(4)
                    }
                    workspace.cover_image = newUrl
                    dispatch('updateWorkspaceDetails', workspace)
                })
                .catch(err => {
                    console.log('err', err)
                })
        },
        async updateWorkspaceDetails({ commit }, workspace) {
            const apiUrl = `workspaces/workspaces/${workspace.id}`
            await axios.put(apiUrl, workspace).then(response => {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: 'Workspace details saved',
                        iconClass: 'fa-check',
                        type: 'success',
                    },
                    { root: true }
                )
            })
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        setWorkspaces(state, workspaces) {
            state.workspaces = workspaces
        },
        setCurrentWorkspaceIndex(state, index) {
            // Save the current workspace index in local storage
            localStorage.setItem('workspace-index', index)
            state.currentWorkspaceIndex = index
        },
    },
}
