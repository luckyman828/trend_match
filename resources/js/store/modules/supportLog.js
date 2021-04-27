import { DateTime } from 'luxon'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        logEntries: [],
    },

    getters: {
        getLogEntries: state => state.logEntries,
    },

    actions: {
        instantiateBaseLogEntry() {
            return {
                id: null,
                msg: '',
                duration: 15,
                created_at: DateTime.local().toISO(),
            }
        },
        async fetchLogEntries({ commit }, workspaceId) {
            let entries
            const response = [
                { id: 1, msg: 'Help upload images', duration: 45, created_at: '2021-04-27T07:04:34.566Z' },
            ]
            entries = response
            commit('SET_LOG_ENTRIES', entries)
            return entries
        },
        insertOrUpdateLogEntry({}, entry) {
            const isInsert = !entry.id
            const method = isInsert ? 'post' : 'put'
            // const apiUrl = `/support`
        },
        async deleteEntry({ commit }, entry) {
            commit('REMOVE_LOG_ENTRY', entry)
        },
    },

    mutations: {
        SET_LOG_ENTRIES(state, entries) {
            state.logEntries = entries
        },
        INSERT_LOG_ENTRY(state, entry) {
            state.logEntries.push(entry)
        },
        REMOVE_LOG_ENTRY(state, entry) {
            const index = state.logEntries.findIndex(stateEntry => stateEntry.id == entry.id)
            if (index >= 0) state.logEntries.splice(index, 1)
        },
    },
}
