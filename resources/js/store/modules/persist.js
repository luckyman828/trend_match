
export default {
    namespaced: true,

    state: {
      currentTeamId: -1,
      currentWorkspaceId: null,
      currentFileId: null,
      loadingInit: true,
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
        loadingInit: state => {
            return state.loadingInit
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
        setLoadingInit(state, bool) {
            state.loadingInit = bool
        }

    }

  }