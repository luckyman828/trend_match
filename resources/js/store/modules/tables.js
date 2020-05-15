import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        usersTable: {},
        teamsTable: {},
        teamUsersTable: {},
        filesTable: {},
        selectionsTable: {},
        selectionUsersTable: {},
        selectionTeamsTable: {},
    },

    getters: {
        getUsersTable: state => state.usersTable,
        getTeamsTable: state => state.teamsTable,
        getTeamUsersTable: state => state.teamUsersTable,
        getFilesTable: state => state.filesTable,
        getSelectionsTable: state => state.selectionsTable,
        getSelectionUsersTable: state => state.selectionUsersTable,
        getSelectionTeamsTable: state => state.selectionTeamsTable,
    },

    actions: {},

    mutations: {
        SET_TABLE_PROPERTY(state, { table, property, value }) {
            Vue.set(state, table, value)
        },
    },
}
