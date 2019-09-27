import Workspace from '../../store/models/Workspace'
import Team from '../../store/models/Team'
import File from '../../store/models/Collection'
import AuthUser from '../../store/models/AuthUser'
import { RootGetters } from '@vuex-orm/core'

export default {
    namespaced: true,

    state: {
        currentTeamId: -1,
        teamFilterId: -1,
        currentWorkspaceId: null,
        currentFileId: null,
        currentTaskId: null,
        userPermissionLevel: 1,
        loadingInit: true,
        viewAdminPermissionLevel: 3,
        adminPermissionLevel: 4,
    },

    getters: {
        currentTeamId: state => {
            return state.currentTeamId
        },
        teamFilterId: state => {
            return state.teamFilterId
        },
        currentWorkspace: state => {
            return Workspace.find(state.currentWorkspaceId)
        },
        currentTeam: state => {
            return state.currentTeamId == 0
                ? 'Global'
                : Team.query()
                      .with('taskTeams.task.parents.completed')
                      .find(state.currentTeamId)
        },
        workspaceCurrency: state => {
            return 'EUR'
        },
        teamCurrency: state => {
            return 'SEK'
        },
        currentWorkspaceId: state => {
            return state.currentWorkspaceId
        },
        currentFileId: state => {
            return state.currentFileId
        },
        currentFile: state => {
            return state.currentFileId != null ? File.find(state.currentFileId) : null
        },
        currentTaskId: state => {
            return state.currentTaskId
        },
        currentTask: (state, getters, rootState, rootGetters) => {
            return state.currentTaskId != null && rootGetters['entities/tasks/tasks'] != null
                ? rootGetters['entities/tasks/tasks'].find(x => x.id == state.currentTaskId)
                : null
        },
        userPermissionLevel: state => {
            return state.userPermissionLevel
        },
        loadingInit: state => {
            return state.loadingInit
        },
        adminPermissionLevel: state => {
            return state.adminPermissionLevel
        },
        viewAdminPermissionLevel: state => {
            return state.viewAdminPermissionLevel
        },
        actionScope: state => {
            if (
                state.userPermissionLevel >= state.adminPermissionLevel ||
                state.userPermissionLevel == state.viewAdminPermissionLevel
            )
                // buyer
                return 'phaseAction'
            else if (state.userPermissionLevel >= 2) return 'teamAction'
            else return 'userAction'
        },
        actionScopeName: state => {
            if (
                state.userPermissionLevel >= state.adminPermissionLevel ||
                state.userPermissionLevel == state.viewAdminPermissionLevel
            )
                // buyer
                return 'Phase action'
            else if (state.userPermissionLevel >= 2) return 'Team action'
            else return 'Your action'
        },
        authUser() {
            return AuthUser.query()
                .with('teams.files|teamFiles|tasks.completed')
                .with('workspaces')
                .first()
        },
    },

    actions: {
        setCurrentTeam({ commit }, id) {
            commit('setCurrentTeam', id)
        },
        setTeamFilter({ commit }, id) {
            commit('setTeamFilter', id)
        },
        setCurrentWorkspace({ commit }, id) {
            commit('setCurrentWorkspace', id)
        },
        setCurrentTaskId({ commit }, id) {
            commit('setCurrentTaskId', id)
        },
        setCurrentFileId({ commit }, id) {
            commit('setcurrentFileId', id)
        },
        setUserPermissionLevel({ commit }, id) {
            commit('setUserPermissionLevel', id)
        },
        setLoadingInit({ commit }, bool) {
            commit('setLoadingInit', bool)
        },
    },

    mutations: {
        setCurrentTeam(state, id) {
            state.currentTeamId = id
        },
        setTeamFilter(state, id) {
            state.teamFilterId = id
        },
        setCurrentWorkspace(state, id) {
            state.currentWorkspaceId = id
        },
        setcurrentFileId(state, id) {
            state.currentFileId = id
        },
        setCurrentTaskId(state, id) {
            state.currentTaskId = id
        },
        setUserPermissionLevel(state, permissionLevel) {
            state.userPermissionLevel = permissionLevel
        },
        setLoadingInit(state, bool) {
            state.loadingInit = bool
        },
    },
}
