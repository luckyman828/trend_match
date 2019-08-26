import axios from 'axios'
import Team from '../models/Team'

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingTeams: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchTeams({commit}, workspace_id) {
          // Set the state to loading
          if (workspace_id) {

            commit('setLoading', true)
  
            const apiUrl = `/api/workspace/${workspace_id}/teams`
            console.log('fetching teams from: ' + apiUrl)
  
            let tryCount = 3
            let succes = false
            while(tryCount-- > 0 && !succes) {
              try {
                const response = await axios.get(`${apiUrl}`)
                Team.create({ data: response.data })
                commit('setLoading', false)
                succes = true
              }
              catch (err) {
                console.log('API error in teams.js :')
                console.log(err)
                console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                if (tryCount <= 0) throw err
              }
            }

          }
      }
    },

    mutations: {

      //Set the loading status of the app
      setLoading(state, bool) {
        state.loading = bool
      }
    }

  }