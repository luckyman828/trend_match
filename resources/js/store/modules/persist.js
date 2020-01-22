import Workspace from '../../store/models/Workspace'
import Team from '../../store/models/Team'
import File from '../../store/models/Collection'
import Action from '../../store/models/Action'
import AuthUser from '../../store/models/AuthUser'
import { RootGetters } from '@vuex-orm/core'
import axios from 'axios'
import Folder from '../models/Folder'

export default {
    namespaced: true,

    state: {
        currentTeamId: -1,
        teamFilterId: -1,
        currentWorkspaceId: null,
        currentFileId: null,
        // editFile: false,
        currentTaskId: null,
        userPermissionLevel: 1,
        loadingInit: true,
        viewAdminPermissionLevel: 3,
        adminPermissionLevel: 4,
        availableCurrencies: [
            'AED',
            'AFN',
            'ALL',
            'AMD',
            'ANG',
            'AOA',
            'ARS',
            'AUD',
            'AWG',
            'AZN',
            'BAM',
            'BBD',
            'BDT',
            'BGN',
            'BHD',
            'BIF',
            'BMD',
            'BND',
            'BOB',
            'BRL',
            'BSD',
            'BTC',
            'BTN',
            'BWP',
            'BYN',
            'BZD',
            'CAD',
            'CDF',
            'CHF',
            'CLF',
            'CLP',
            'CNH',
            'CNY',
            'COP',
            'CRC',
            'CUC',
            'CUP',
            'CVE',
            'CZK',
            'DJF',
            'DKK',
            'DOP',
            'DZD',
            'EGP',
            'ERN',
            'ETB',
            'EUR',
            'FJD',
            'FKP',
            'GBP',
            'GEL',
            'GGP',
            'GHS',
            'GIP',
            'GMD',
            'GNF',
            'GTQ',
            'GYD',
            'HKD',
            'HNL',
            'HRK',
            'HTG',
            'HUF',
            'IDR',
            'ILS',
            'IMP',
            'INR',
            'IQD',
            'IRR',
            'ISK',
            'JEP',
            'JMD',
            'JOD',
            'JPY',
            'KES',
            'KGS',
            'KHR',
            'KMF',
            'KPW',
            'KRW',
            'KWD',
            'KYD',
            'KZT',
            'LAK',
            'LBP',
            'LKR',
            'LRD',
            'LSL',
            'LYD',
            'MAD',
            'MDL',
            'MGA',
            'MKD',
            'MMK',
            'MNT',
            'MOP',
            'MRO',
            'MRU',
            'MUR',
            'MVR',
            'MWK',
            'MXN',
            'MYR',
            'MZN',
            'NAD',
            'NGN',
            'NIO',
            'NOK',
            'NPR',
            'NZD',
            'OMR',
            'PAB',
            'PEN',
            'PGK',
            'PHP',
            'PKR',
            'PLN',
            'PYG',
            'QAR',
            'RON',
            'RSD',
            'RUB',
            'RWF',
            'SAR',
            'SBD',
            'SCR',
            'SDG',
            'SEK',
            'SGD',
            'SHP',
            'SLL',
            'SOS',
            'SRD',
            'SSP',
            'STD',
            'STN',
            'SVC',
            'SYP',
            'SZL',
            'THB',
            'TJS',
            'TMT',
            'TND',
            'TOP',
            'TRY',
            'TTD',
            'TWD',
            'TZS',
            'UAH',
            'UGX',
            'USD',
            'UYU',
            'UZS',
            'VEF',
            'VES',
            'VND',
            'VUV',
            'WST',
            'XAF',
            'XAG',
            'XAU',
            'XCD',
            'XDR',
            'XOF',
            'XPD',
            'XPF',
            'XPT',
            'YER',
            'ZAR',
            'ZMW',
            'ZWL',
        ],
        availableWorkspaceRoles: [
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
        availableTeamRoles: [
            {
                id: 0,
                name: 'External',
                description: 'No rights what so ever',
            },
            {
                id: 1,
                name: 'Member',
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
        currentFolderId: null,
    },

    getters: {
        currentTeamId: state => {
            return state.currentTeamId
        },
        currentFolderId: state => {
            return state.currentFolderId
        },
        currentFolder: state => {
            return state.currentFolderId
                ? Folder.query()
                      .with('folders|files')
                      .find(state.currentFolderId)
                : null
        },
        // editFile: state => {
        //     return state.editFile
        // },
        availableCurrencies: state => {
            return state.availableCurrencies
        },
        availableWorkspaceRoles: state => {
            return state.availableWorkspaceRoles
        },
        availableTeamRoles: state => {
            return state.availableTeamRoles
        },
        teamFilterId: state => {
            return state.teamFilterIdx
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

            return currentTask
        },
        currentTaskProgress: (state, getters, rootState, rootGetters) => {
            const productTotals = rootGetters['entities/products/productsScopedTotals']
            const currentTask = getters.currentTask
            let progress = 0
            // Find task progress
            if (currentTask) {
                const currentTaskActions = Action.query()
                    .where('task_id', currentTask.id)
                    .get()
                if (currentTaskActions) {
                    if (currentTask.type == 'approval' && productTotals) {
                        progress =
                            Math.round((currentTaskActions.length / productTotals.totalDecisionsToMake) * 100 * 1) / 1
                    } else if (currentTask.type == 'decision') {
                        progress = 100
                    } else if (getters.userPermissionLevel > 1) {
                        progress =
                            currentTask.type == 'feedback'
                                ? Math.round(
                                      (currentTaskActions.length /
                                          (currentTask.input.length * getters.currentFile.products.length)) *
                                          100 *
                                          1
                                  ) / 1
                                : Math.round(
                                      (currentTaskActions.length / getters.currentFile.products.length) * 100 * 1
                                  ) / 1
                    } else {
                        progress =
                            Math.round(
                                (currentTaskActions.filter(x => x.user_id == getters.authUser.id).length /
                                    getters.currentFile.products.length) *
                                    100 *
                                    1
                            ) / 1
                    }

                    if (currentTask.type == 'feedback') {
                        currentTask.input.forEach(user => {
                            user.progress =
                                Math.round(
                                    (currentTaskActions.filter(x => x.user_id == user.id).length /
                                        getters.currentFile.products.length) *
                                        100 *
                                        1
                                ) / 1
                        })
                    }
                }
            }
            return progress
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
                .with('role')
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
                .put(
                    `/api/cache/workspace`,
                    {
                        workspace_id: workspace_id,
                        user_id: user_id,
                    },
                    { headers: {} }
                )
                .then(response => {
                    console.log('cached workspace id')
                })
                .catch(err => {
                    console.log(err)
                })
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
        // async getAvailableCurrencies({ commit }) {
        //     const apiUrl = 'https://openexchangerates.org/api/currencies.json'
        //     const response = await axios.get(`${apiUrl}`)
        //     commit('setAvailableCurrencies', response)
        // },
    },

    mutations: {
        setCurrentTeam(state, id) {
            state.currentTeamId = id
        },
        setCurrentFolderId(state, id) {
            state.currentFolderId = id
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
        // setEditFile(state, bool) {
        //     state.editFile = bool
        // },
        // setAvailableCurrencies(state, currencies) {
        //     state.availableCurrencies = currencies
        // },
    },
}
