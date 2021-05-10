import axios from 'axios'
import Compressor from 'compressorjs'
import Vue from 'vue'
import { triggerRouteGuards } from '../../helpers/routeGuards'
import router from '../../router'

export default {
    namespaced: true,

    state: {
        workspaces: [],
        databases: [],
        currentWorkspaceId: localStorage.getItem('workspace-id') || null,
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
            {
                role: 'Owner',
                description: 'The owner.',
            },
        ],
    },

    getters: {
        loadingWorkspaces: state => state.loading,
        getCurrentWorkspaceId: state => state.currentWorkspaceId,
        workspaces: state => state.workspaces,
        getWorkspaces: state => state.workspaces,
        availableWorkspaceRoles: (state, getters, rootState, rootGetters) =>
            rootGetters['auth/getIsSystemAdmin']
                ? state.availableWorkspaceRoles
                : state.availableWorkspaceRoles.filter(x => x.role != 'Owner'),
        currentWorkspace: (state, getters) => state.workspaces.find(x => x.id == getters.getCurrentWorkspaceId),
        getCurrentWorkspace: (state, getters) => getters.currentWorkspace,
        authUserWorkspaceRole: (state, getters) => {
            if (!getters.currentWorkspace) return 'Undefined'
            if (getters.currentWorkspace.role == 'Owner') return 'Admin'
            return getters.currentWorkspace ? getters.currentWorkspace.role : 'Undefined'
        },
        getAuthUserWorkspaceRole: (state, getters) => getters.authUserWorkspaceRole,
        getRealWorkspaceRole: (state, getters) => {
            if (!getters.currentWorkspace) return 'Undefined'
            return getters.currentWorkspace.role
        },
        getWorkspaceDatabases: state => state.databases,
        getCustomProductFields: (state, getters) =>
            getters.currentWorkspace && getters.currentWorkspace.custom_product_fields,
        getAvailableProductLabels: (state, getters) =>
            getters.currentWorkspace && getters.currentWorkspace.available_labels
                ? getters.currentWorkspace.available_labels
                : [],
        getFeatureFlags: (state, getters) => (getters.currentWorkspace ? getters.currentWorkspace.feature_flags : []),
        getEnabledFeatures: (state, getters) => {
            const enabledFeaturues = Object.fromEntries(getters.getFeatureFlags.map(flag => [flag, true]))
            Object.defineProperty(enabledFeaturues, 'import_from_integration', {
                get: () => enabledFeaturues.dkc_integration || getters.getWorkspaceDatabases.length > 0,
            })
            return enabledFeaturues
        },
        getEnabledApps: (state, getters, rootState, rootGetters) => {
            return rootGetters['kollektApps/getApps'].filter(app => {
                return getters.getFeatureFlags.includes(app.featureFlag)
            })
        },
    },

    actions: {
        async fetchWorkspaces({ commit, dispatch }) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/workspaces`

            let tryCount = 3
            let success = false
            let workspaces = []
            while (tryCount-- > 0 && !success) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    workspaces = response.data
                    dispatch('initWorkspaces', workspaces)

                    commit('setWorkspaces', response.data)
                    commit('setLoading', false)
                    success = true
                } catch (err) {
                    console.log('API error in workspaces.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
            return workspaces
        },
        async fetchWorkspace({ state, dispatch, rootGetters, commit }, workspaceId) {
            commit('setLoading', true)
            let apiUrl = `workspaces/${workspaceId}`
            // If we are super admin, use the admin endpoint
            const isSystemAdmin = rootGetters['auth/getIsSystemAdmin']
            if (isSystemAdmin) apiUrl = `admins/workspaces/${workspaceId}`
            let workspace
            await axios.get(apiUrl).then(response => {
                workspace = response.data
                dispatch('initWorkspaces', [workspace])
                commit('UPDATE_WORKSPACE', workspace)
                const stateWorkspace = state.workspaces.find(x => x.id == workspace.id)
                if (stateWorkspace) {
                    Object.assign(stateWorkspace, workspace)
                }
            })
            commit('setLoading', false)
            return workspace
        },
        async uploadWorkspaceCoverImage({ getters, dispatch }, image) {
            const workspace = getters.currentWorkspace
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
                    maxHeight: 800,
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
        async uploadWorkspaceLogo({ getters, dispatch }, image) {
            const workspace = getters.currentWorkspace
            // First generate presigned URL we can put the image to from the API
            // const apiUrl = `/workspaces/${workspace.id}/generate-presigned-logo-url`
            const apiUrl = `/workspaces/${workspace.id}/generate-presigned-cover`
            let presignedUrl
            await axios.get(apiUrl).then(response => {
                presignedUrl = response.data
            })

            // PRE-COMPRESS THE IMAGE
            let compressedImage = image
            await new Promise((resolve, reject) => {
                new Compressor(image, {
                    quality: 1,
                    checkOrientation: true,
                    maxHeight: 60,
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
                    workspace.logo = newUrl
                    console.log('new workspace logo:', newUrl, workspace)
                    dispatch('updateWorkspaceDetails', workspace)
                })
                .catch(err => {
                    console.log('err', err)
                })
        },
        async uploadImageToWorkspace({ getters, dispatch }, image) {
            const workspace = getters.currentWorkspace
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
                    maxHeight: 800,
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
            let imageUrl

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
                    imageUrl = presignedUrl.url
                    // Change the URL from https to https
                    if (imageUrl.indexOf('https') < 0) {
                        imageUrl = imageUrl.slice(0, 4) + 's' + imageUrl.slice(4)
                    }
                })
                .catch(err => {
                    console.log('err', err)
                })
            return imageUrl
        },
        async updateWorkspaceDetails({ commit }, workspace) {
            const apiUrl = `workspaces/workspaces/${workspace.id}`

            // Transform custom property to set name from display name
            workspace.custom_product_fields.map(property => {
                property.name = property.display_name
                    .toLowerCase()
                    .trim()
                    .replaceAll(' ', '_')
                property.display_name = property.display_name.trim()
            })

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
        async initWorkspaces({}, workspaces) {
            workspaces.map(workspace => {
                if (!workspace.feature_flags) Vue.set(workspace, 'feature_flags', [])
                // Object.defineProperty(workspace, 'logoUrl', {
                //     get: function() {
                //         return `${Vue.$cdnBaseUrl}/workspaces/${workspace.id}/logo.jpg`
                //     },
                // })
            })
        },
        async fetchWorkspaceDatabases({ state }, workspace) {
            const apiUrl = `workspaces/${workspace.id}/databases`
            await axios.get(apiUrl).then(response => {
                state.databases = response.data
            })
        },
        async insertWorkspace({ state, commit }, newWorkspace) {
            const apiUrl = `admins/workspaces`
            await axios.post(apiUrl, newWorkspace).then(response => {
                const workspace = response.data
                Object.assign(newWorkspace, workspace)
                state.workspaces.push(newWorkspace)
                newWorkspace.role = 'Admin'
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: 'Workspace created',
                        iconClass: 'far fa-building',
                        type: 'success',
                    },
                    { root: true }
                )
            })
        },
        async deleteWorkspace({ commit, state, getters }, workspace) {
            const apiUrl = `admins/workspaces/${workspace.id}`
            axios.delete(apiUrl).then(response => {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: 'Workspace deleted',
                        iconClass: 'far fa-trash',
                        type: 'danger',
                    },
                    { root: true }
                )
                // Redirect the user to another worksapce.
                const index = state.workspaces.findIndex(x => x.id == workspace.id)
                state.workspaces.splice(index, 1)
                if (getters.currentWorkspaceId == workspace.id) {
                    commit('SET_CURRENT_WORKSPACE_ID', getters.workspaces[0] && getters.workspaces[0].id)
                }
            })
        },
        async setCurrentWorkspace({ commit, dispatch }, workspaceId) {
            // Fetch data for the new workspace
            commit('SET_CURRENT_WORKSPACE_ID', workspaceId)
            await dispatch('fetchWorkspace', workspaceId)
        },
        async changeWorkspace({ commit, dispatch, rootGetters }, workspaceId) {
            await dispatch('setCurrentWorkspace', workspaceId)
            // Trigger route guards
            const currentRoute = router.currentRoute
            let newRoute = currentRoute
            if (currentRoute.params.selectionId || currentRoute.params.fileId) {
                newRoute = router.matcher.match({ name: rootGetters['kollektApps/getCurrentApp'].name })
            }
            // Trigger routeguards for the new route
            const routeAfterGuards = await triggerRouteGuards(newRoute)
            if (routeAfterGuards) newRoute = routeAfterGuards
            if (
                newRoute != currentRoute &&
                !(newRoute.fullPath && currentRoute.fullPath && newRoute.fullPath == currentRoute.fullPath)
            ) {
                await router.push(newRoute)
            }
            commit('files/SET_CURRENT_FILE', null, { root: true })
            commit('selections/SET_CURRENT_SELECTION_ID', null, { root: true })
            commit('selections/SET_CURRENT_SELECTIONS', [], { root: true })
            dispatch('files/setCurrentFolder', null, { root: true })
        },
        async fetchWorkspaceResources({}, workspace) {
            let resources
            const apiUrl = `workspaces/${workspace.id}/resources`
            await axios.get(apiUrl).then(response => {
                resources = response.data
                Vue.set(workspace, 'resources', resources)
            })
            return resources
        },
        async updateWorkspaceResources({}, workspace) {
            const apiUrl = `workspaces/${workspace.id}/resources`
            const resourcesObj = Object.assign({}, workspace.resources)
            resourcesObj.support_minutes = resourcesObj.support.available_minutes
            await axios.put(apiUrl, resourcesObj)
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
        SET_CURRENT_WORKSPACE_ID(state, newId) {
            // Save the current workspace index in local storage
            localStorage.setItem('workspace-id', newId)
            state.currentWorkspaceId = newId
        },
        UPDATE_WORKSPACE(state, workspace) {
            const stateWorkspace = state.workspaces.find(x => x.id == workspace.id)
            Object.assign(stateWorkspace, workspace)
        },
    },
}
