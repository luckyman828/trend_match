import axios from 'axios'
import Subfile from '../models/Subfile'

export default {
    namespaced: true,

    state: {
        loading: true,
        currentSubfileId: null,
        availableSelectionRoles: [
            {
                id: 0,
                name: 'External',
                description: 'No rights what so ever',
            },
            {
                id: 1,
                name: 'User',
                description: 'A basic user with no special rights',
            },
            {
                id: 2,
                name: 'Observer',
                description: 'Like a ghost. Can go anywhere, but cannot change anything.',
            },
            {
                id: 3,
                name: 'Admin',
                description: 'Can do some special move and rewoke powers.',
            },
            {
                id: 4,
                name: 'Owner',
                description:
                    'All the powers of the Admin, with the added security of only being able to be kicked by other Owners.',
            },
        ],
    },

    getters: {
        loadingSubfiles: state => {
            return state.loading
        },
        currentSubfileId: state => {
            return state.currentSubfileId
        },
    },

    actions: {
        async fetchSubfiles({ commit }, workspace_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/workspace/${workspace_id}/subfiles`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    Subfile.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in Subfile.js :')
                    console.log(err.response)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
        addUsersToSelection({ commit }, { selection, usersToAdd }) {
            // Commit mutation to state
            commit('addUsersToSelection', { selection, usersToAdd })
            // Send request to API
        },
        removeUserFromSelection({ commit }, { selection, user }) {
            // Commit mutation to state
            commit('removeUserFromSelection', { selection, user })
            // Send request to API
        },
        addOwnersToSelection({ commit }, { selection, ownersToAdd }) {
            // Commit mutation to state
            commit('addOwnersToSelection', { selection, ownersToAdd })
            // Send request to API
        },
        removeOwnerFromSelection({ commit }, { selection, owner }) {
            // Commit mutation to state
            commit('removeOwnerFromSelection', { selection, owner })
            // Send request to API
        },
        updateSelection({commit}, selection) {
            
        }
    },

    mutations: {
        setLoading(state, bool) {
            state.loading = bool
        },
        setCurrentSubfileId(state, id) {
            state.currentSubfileId = id
        },
        addUsersToSelection(state, { selection, usersToAdd }) {
            // Make a clone of the user and set their default selection permission level
            const usersToPush = []
            usersToAdd.forEach(user => {
                const userToPush = JSON.parse(JSON.stringify(user))
                userToPush.selectionRoleId = 1
                usersToPush.push(userToPush)
            })
            selection.feedbackUsers = selection.feedbackUsers.concat(usersToPush)
        },
        removeUserFromSelection(state, { selection, user }) {
            const userIndex = selection.feedbackUsers.findIndex(x => x.id == user.id)
            selection.feedbackUsers.splice(userIndex, 1)
        },
        addOwnersToSelection(state, { selection, ownersToAdd }) {
            // Make a clone of the user and set their default selection permission level
            const ownersToPush = []
            ownersToAdd.forEach(user => {
                const ownerToPush = JSON.parse(JSON.stringify(user))
                ownerToPush.selectionRoleId = 1
                ownersToPush.push(ownerToPush)
            })
            selection.owners = selection.owners.concat(ownersToPush)
        },
        removeOwnerFromSelection(state, { selection, owner }) {
            const userIndex = selection.owners.findIndex(x => x.id == owner.id)
            selection.owners.splice(userIndex, 1)
        },
    },
}
