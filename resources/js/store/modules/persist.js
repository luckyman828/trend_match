import Workspace from '../../store/models/Workspace'
import Team from '../../store/models/Team'
import File from '../../store/models/Collection'
import AuthUser from '../../store/models/AuthUser'
import { RootGetters } from '@vuex-orm/core'
import axios from 'axios'

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
            let currentTask =
                state.currentTaskId != null && rootGetters['entities/tasks/tasks'] != null
                    ? rootGetters['entities/tasks/tasks'].find(x => x.id == state.currentTaskId)
                    : null

            // Find task progress
            if (currentTask) {
                if (getters.userPermissionLevel > 1) {
                    currentTask.progress =
                        currentTask.type == 'feedback'
                            ? Math.round(
                                  (currentTask.actions.length /
                                      (currentTask.input.length * getters.currentFile.products.length)) *
                                      100 *
                                      1
                              ) / 1
                            : Math.round((currentTask.actions.length / getters.currentFile.products.length) * 100 * 1) /
                              1
                } else {
                    currentTask.progress =
                        Math.round(
                            (currentTask.actions.filter(x => x.user_id == getters.authUser.id).length /
                                getters.currentFile.products.length) *
                                100 *
                                1
                        ) / 1
                }

                if (currentTask.type == 'feedback') {
                    currentTask.input.forEach(user => {
                        user.progress =
                            Math.round(
                                (currentTask.actions.filter(x => x.user_id == user.id).length /
                                    getters.currentFile.products.length) *
                                    100 *
                                    1
                            ) / 1
                    })
                }
            }

            return currentTask
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
        currentTaskPermissions: (state, getters, rootState, rootGetters) => {
            if (getters.currentTask) {
                return {
                    select: getters.currentTask.type != 'approval' ? true : false,
                    feedback: getters.currentTask.type != 'approval' ? true : false,
                    comments: true,
                    requests: getters.currentTask.type != 'feedback' ? true : false,
                    // actions: getters.currentTask.type != 'approval' ? true : false,
                    actions: true,
                    focus: true,
                }
            }
        },
    },

    actions: {
        setCurrentTeam({ commit }, id) {
            commit('setCurrentTeam', id)
        },
        setTeamFilter({ commit }, id) {
            commit('setTeamFilter', id)
        },
        async setCurrentWorkspace({ commit }, { workspace_id, user_id }) {
            commit('setCurrentWorkspace', workspace_id)

            // Cache the curent workspace id
            await axios
                .put(`/api/cache/workspace`, {
                    workspace_id: workspace_id,
                    user_id: user_id,
                })
                .then(response => {
                    console.log('cached workspace id')
                })
                .catch(err => {
                    console.log(err)
                })
        },
        setCurrentTaskId({ commit }, id) {
            console.log('Setting current task ID!')
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
