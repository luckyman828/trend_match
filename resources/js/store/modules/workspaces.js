import axios from 'axios'
import Workspace from '../models/Workspace'

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingWorkspaces: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchWorkspaces({commit}) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/workspaces`

          let tryCount = 3
          let succes = false
          while(tryCount-- > 0 && !succes) {
            try {
              const response = await axios.get(`${apiUrl}`)
              Workspace.create({ data: response.data })
              commit('setLoading', false)
              succes = true
            }
            catch (err) {
              console.log('API error in workspaces.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              if (tryCount <= 0) throw err
            }
          }
      },

    },

    mutations: {

      //Set the loading status of the app
      setLoading(state, bool) {
        state.loading = bool
      }
    }

  }