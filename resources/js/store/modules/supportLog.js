import axios from 'axios'
import { DateTime } from 'luxon'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        logEntries: [],
        logEntryMeta: null,
    },

    getters: {
        getLogEntries: state => state.logEntries,
        getLogEntryMeta: state => state.logEntryMeta,
    },

    actions: {
        instantiateBaseLogEntry() {
            return {
                id: null,
                message: '',
                duration: 15,
                support_time: DateTime.local().toISO(),
            }
        },
        async fetchWorkspaceSupportMinutes({ commit }, workspace) {
            let supportMinutes
            const apiUrl = `workspaces/${workspace.id}/support-duration`
            axios.get(apiUrl).then(response => {
                supportMinutes = response.data
                Object.defineProperty(supportMinutes, 'remainingMinutes', {
                    get: function() {
                        return supportMinutes.available_minutes - supportMinutes.total_spend_minutes
                    },
                })
                if (!workspace.resources) {
                    Vue.set(workspace, 'resources', { support: supportMinutes })
                } else {
                    Vue.set(workspace.resources, 'support', supportMinutes)
                }
            })
            return supportMinutes
        },
        async fetchLogEntries({ commit }, { workspaceId, pageIndex }) {
            let entryData
            let apiUrl = `workspaces/${workspaceId}/support-duration/usage-logs`
            if (pageIndex != null) apiUrl = apiUrl + `?page=${pageIndex}`

            await axios.get(apiUrl).then(response => {
                entryData = response.data
                if (pageIndex != null) {
                    commit('ADD_LOG_ENTRIES', entryData.data)
                } else {
                    commit('SET_LOG_ENTRIES', entryData.data)
                }
                commit('SET_LOG_ENTRY_META', entryData.meta)
            })
            return entryData
        },
        async insertOrUpdateLogEntry({ commit, dispatch }, { workspace, entry }) {
            const isInsert = !entry.id
            const method = isInsert ? 'post' : 'put'
            let apiUrl = `/workspaces/${workspace.id}/support-duration/consume`
            if (!isInsert) apiUrl = `${apiUrl}/${entry.id}`
            await axios({
                method,
                url: apiUrl,
                data: entry,
            })
                .then(response => {
                    if (!isInsert) Vue.set(entry, 'id', response.data.id)
                })
                .catch(err => {
                    commit(
                        'alerts/SHOW_SNACKBAR',
                        {
                            type: 'warning',
                            iconClass: 'far fa-exclamation-triangle',
                            msg: 'Something went wrong when trying to update the log entry. Please try again.',
                            callback: () => {
                                dispatch('insertOrUpdateLogEntry', { workspace, entry })
                            },
                        },
                        { root: true }
                    )
                })
        },
        async deleteEntry({ commit }, { workspace, entry }) {
            commit('REMOVE_LOG_ENTRY', entry)
            workspace.resources.support.total_spend_minutes -= entry.duration
            if (!entry.id) return
            const apiUrl = `/workspaces/${workspace.id}/support-duration/consume/${entry.id}`
            await axios.delete(apiUrl).catch(err => {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        type: 'warning',
                        iconClass: 'far fa-exclamation-triangle',
                        msg: 'Something went wrong when trying to delete the log entry. Please try again.',
                        callback: () => {
                            dispatch('deleteEntry', { workspace, entry })
                        },
                    },
                    { root: true }
                )
            })
        },
    },

    mutations: {
        SET_LOG_ENTRY_META(state, meta) {
            state.logEntryMeta = meta
        },
        SET_LOG_ENTRIES(state, entries) {
            state.logEntries = entries
        },
        ADD_LOG_ENTRIES(state, entries) {
            state.logEntries.push(...entries)
        },
        INSERT_LOG_ENTRY(state, entry) {
            state.logEntries.unshift(entry)
        },
        REMOVE_LOG_ENTRY(state, entry) {
            const index = state.logEntries.findIndex(stateEntry => stateEntry.id == entry.id)
            if (index >= 0) state.logEntries.splice(index, 1)
        },
    },
}
