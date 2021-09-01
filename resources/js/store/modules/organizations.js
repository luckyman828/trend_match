import axios from 'axios'

export default {
    namespaced: true,

    state: {
        organizations: [],
        currentOrganizationId: null,
        availableOrganizationRoles: [
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
        getCurrentOrganizationId: state => {
            try {
                return state.currentOrganizationId || localStorage.getItem('organization-id') || null
            } catch (e) {
                return null
            }
        },
        getOrganizations: state => state.organizations,
        getAvailableOrganizationRoles: (state, getters, rootState, rootGetters) =>
            rootGetters['auth/getIsSystemAdmin']
                ? state.availableOrganizationRoles
                : state.availableOrganizationRoles.filter(x => x.role != 'Owner'),
        getCurrentOrganization: (state, getters) =>
            state.organizations.find(x => x.id == getters.getCurrentOrganizationId),
        getAuthUserOrganizationRole: (state, getters) => {
            if (!getters.currentOrganization) return 'Undefined'
            if (getters.currentOrganization.role == 'Owner') return 'Admin'
            return getters.currentOrganization ? getters.currentOrganization.role : 'Undefined'
        },
    },

    actions: {
        async fetchOrganizations({ commit, dispatch }) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/organizations`

            let tryCount = 3
            let success = false
            let organizations = []
            while (tryCount-- > 0 && !success) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    organizations = response.data
                    dispatch('initOrganizations', organizations)

                    commit('SET_ORGANIZATIONS', response.data)
                    commit('setLoading', false)
                    success = true
                } catch (err) {
                    console.log('API error in organizations.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
            return organizations
        },
        async fetchOrganization({ state, dispatch, rootGetters, commit }, organizationId) {
            commit('setLoading', true)
            let apiUrl = `organizations/${organizationId}`
            // If we are super admin, use the admin endpoint
            const isSystemAdmin = rootGetters['auth/getIsSystemAdmin']
            if (isSystemAdmin) apiUrl = `admins/organizations/${organizationId}`
            let organization
            await axios.get(apiUrl).then(response => {
                organization = response.data
                dispatch('initOrganizations', [organization])
                commit('UPDATE_ORGANIZATION', organization)
                const stateOrganization = state.organizations.find(x => x.id == organization.id)
                if (stateOrganization) {
                    Object.assign(stateOrganization, organization)
                }
            })
            commit('setLoading', false)
            return organization
        },

        async updateOrganizationDetails({ commit }, organization) {
            const apiUrl = `admins/organizations/${organization.id}`

            await axios.put(apiUrl, organization).then(response => {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: 'Organization details saved',
                        iconClass: 'fa-check',
                        type: 'success',
                    },
                    { root: true }
                )
            })
        },
        async initOrganizations({}, organizations) {
            organizations.map(organization => {
                Vue.set(organization, 'isInit', true)
            })
        },
        async insertOrganization({ state, commit }, newOrganization) {
            const apiUrl = `admins/organizations`
            await axios.post(apiUrl, newOrganization).then(response => {
                const organization = response.data
                Object.assign(newOrganization, organization)
                state.organizations.push(newOrganization)
                newOrganization.role = 'Admin'
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: 'Organization created',
                        iconClass: 'far fa-building',
                        type: 'success',
                    },
                    { root: true }
                )
            })
        },
        async deleteOrganization({ commit, state, getters }, organization) {
            const apiUrl = `admins/organizations/${organization.id}`
            axios.delete(apiUrl).then(response => {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: 'Organization deleted',
                        iconClass: 'far fa-trash',
                        type: 'danger',
                    },
                    { root: true }
                )
                // Redirect the user to another worksapce.
                const index = state.organizations.findIndex(x => x.id == organization.id)
                state.organizations.splice(index, 1)
                if (getters.currentOrganizationId == organization.id) {
                    commit('SET_CURRENT_ORGANIZATION_ID', getters.organizations[0] && getters.organizations[0].id)
                }
            })
        },
        async setCurrentOrganization({ commit, dispatch }, organizationId) {
            // Fetch data for the new organization
            commit('SET_CURRENT_ORGANIZATION_ID', organizationId)
            await dispatch('fetchOrganization', organizationId)
        },
        async changeOrganization({ commit, dispatch, rootGetters }, organizationId) {
            await dispatch('setCurrentOrganization', organizationId)
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
    },

    mutations: {
        SET_ORGANIZATIONS(state, organizations) {
            state.organizations = organizations
        },
        SET_CURRENT_ORGANIZATION_ID(state, newId) {
            // Save the current organization index in local storage
            localStorage.setItem('organization-id', newId)
            state.currentOrganizationId = newId
        },
        UPDATE_ORGANIZATION(state, organization) {
            const stateOrganization = state.organizations.find(x => x.id == organization.id)
            Object.assign(stateOrganization, organization)
        },
    },
}
