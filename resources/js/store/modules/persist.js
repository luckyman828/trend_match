import axios from 'axios'

export default {
    namespaced: true,

    state: {
        initDone: false,
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
        uids: [],
        availableCurrencies: [
            'EUR',
            'GBP',
            'DKK',
            'NOK',
            'SEK',
            'CHF',
            'USD',
            'AUD',
            'AED',
            'AFN',
            'ALL',
            'AMD',
            'ANG',
            'AOA',
            'ARS',
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
            'DOP',
            'DZD',
            'EGP',
            'ERN',
            'ETB',
            'FJD',
            'FKP',
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
        currentFolderId: null,
        uids: [],
    },

    getters: {
        getInitDone: state => state.initDone,
        uids: state => state.uids,
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
        async getUids({ commit, state }) {
            const apiUrl = `/snowflake/ids?count=2000`
            await axios.get(apiUrl).then(response => {
                state.uids = state.uids.concat(response.data)
            })
        },
        async useUid({ commit, state }) {
            const uid = state.uids[state.uids.length - 1]
            state.uids.pop()
            return uid
        },
        SET_CURRENT_TEAM({ commit }, id) {
            commit('SET_CURRENT_TEAM', id)
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
                .then(response => {})
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
        SET_INIT_DONE(state, payload) {
            state.initDone = payload
        },
        SET_CURRENT_TEAM(state, id) {
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
