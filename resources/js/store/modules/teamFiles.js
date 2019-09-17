import axios from 'axios'
import TeamFile from '../models/TeamFile';

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingTeamFiles: state => {
        return state.loading
      }
    },
  
    actions: {
        async fetchTeamFiles({commit}, workspace_id) {
            // Set the state to loading
            commit('setLoading', true)
            
            const apiUrl = `/api/workspace/${workspace_id}/team-files`
  
            let tryCount = 3
            let succes = false
            while(tryCount-- > 0 && !succes) {
              try {
                const response = await axios.get(`${apiUrl}`)
                TeamFile.create({ data: response.data })
                commit('setLoading', false)
                succes = true
              }
              catch (err) {
                console.log('API error in teamFiles.js :')
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
      },

    }

  }