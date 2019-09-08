export default {
    namespaced: true,

    state: {
      currentTeamId: -1,
      currentWorkspaceId: null,
      currentFileId: null,
      userPermissionLevel: 1,
      loadingInit: true,
      viewAdminPermissionLevel: 3,
      adminPermissionLevel: 4,
    },

    getters: {
        currentTeamId: state => { return state.currentTeamId },
        workspaceCurrency: state => { return 'EUR' },
        teamCurrency: state => { return 'SEK' },
        currentWorkspaceId: state => { return state.currentWorkspaceId },
        currentFileId: state => { return state.currentFileId },
        userPermissionLevel: state => { return state.userPermissionLevel },
        loadingInit: state => { return state.loadingInit },
        adminPermissionLevel: state => { return state.adminPermissionLevel },
        viewAdminPermissionLevel: state => { return state.viewAdminPermissionLevel },
        test: state => { return state.adminLevel },
        actionScope: state => {
            if ( (state.userPermissionLevel >= state.adminPermissionLevel) || (state.userPermissionLevel == state.viewAdminPermissionLevel) ) // buyer
                return 'phaseAction'
            else if (state.userPermissionLevel >= 2)
                return 'teamAction'
            else return 'userAction'
        },
        actionScopeName: state => {
            if (state.userPermissionLevel >= state.adminPermissionLevel || state.userPermissionLevel == state.viewAdminPermissionLevel ) // buyer
                return 'Phase action'
            else if (state.userPermissionLevel >= 2)
                return 'Team action'
            else return 'Your action'
        },
    },
  
    actions: {

        setCurrentTeam({commit}, id) {
            commit('setCurrentTeam', id)
        },
        setCurrentWorkspace({commit}, id) {
            commit('setCurrentWorkspace', id)
        },
        setCurrentFileId({commit}, id) {
            commit('setcurrentFileId', id)
        },
        setUserPermissionLevel({commit}, id) {
            commit('setUserPermissionLevel', id)
        },
        setLoadingInit({commit}, bool) {
            commit('setLoadingInit', bool)
        },
        
      
    },

    mutations: {

        setCurrentTeam(state, id) {
            state.currentTeamId = id
        },
        setCurrentWorkspace(state, id) {
            state.currentWorkspaceId = id
        },
        setcurrentFileId(state, id) {
            state.currentFileId = id
        },
        setUserPermissionLevel(state, permissionLevel) {
            state.userPermissionLevel = permissionLevel
        },
        setLoadingInit(state, bool) {
            state.loadingInit = bool
        }

    }

  }