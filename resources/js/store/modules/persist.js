
export default {
    namespaced: true,

    state: {
      currentTeamId: -1,
      currentWorkspaceId: null,
      currentFileId: null,
      userPermissionLevel: 1,
      loadingInit: true,
    //   actionScope: 'userAction',
    },

    getters: {
        currentTeamId: state => {
            return state.currentTeamId
        },
        currentWorkspaceId: state => {
            return state.currentWorkspaceId
        },
        currentFileId: state => {
            return state.currentFileId
        },
        userPermissionLevel: state => {
            return state.userPermissionLevel
        },
        loadingInit: state => {
            return state.loadingInit
        },
        actionScope: state => {
            if (state.userPermissionLevel >= 3 )
                return 'phaseAction'
            else if (state.userPermissionLevel >= 2)
                return 'teamAction'
            else return 'userAction'
        },
        actionScopeName: state => {
            if (state.userPermissionLevel >= 3 )
                return 'Phase action'
            else if (state.userPermissionLevel >= 2)
                return 'Team action'
            else return 'Your action'
        }
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