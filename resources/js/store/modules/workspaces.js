import axios from 'axios'

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
        ],
    },

    getters: {
        loadingWorkspaces: state => state.loading,
        workspaces: state => state.workspaces,
        availableWorkspaceRoles: state => state.availableWorkspaceRoles,
        currentWorkspaceIndex: state => state.currentWorkspaceIndex,
        currentWorkspace: state => state.workspaces[state.currentWorkspaceIndex],
        authUserWorkspaceRole: (state, getters) => {
            return getters.currentWorkspace ? getters.currentWorkspace.role : 'Undefined'
        },
    },

    actions: {
        async fetchWorkspaces({ commit }) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/workspaces`

            let tryCount = 3
            let success = false
            while (tryCount-- > 0 && !success) {
                try {
                    const response = await axios.get(`${apiUrl}`)
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
        },
        async setCurrentWorkspaceIndex({ commit }, index) {
            // Reset the current folder ID
            commit('files/SET_CURRENT_FOLDER', null, { root: true })
            commit('setCurrentWorkspaceIndex', index)
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
