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
      async fetchTeams({commit}, {collection_id}) {
          // Set the state to loading
          commit('setLoading', true)
          if (collection_id == null) {
            collection_id = 1234
          }

          const apiUrl = `/api/collection/${collection_id}/teams`

          let tryCount = 3
          while(tryCount > 0) {
            try {
              tryCount --
              const response = await axios.get(`${apiUrl}`)
              Team.create({ data: response.data })
              commit('setLoading', false)
            }
            catch (err) {
              console.log('API error in teams.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              tryCount --
              if (tryCount <= 0) throw err
            }
          }

          // console.log(`Getting users from ${apiUrl}`)
          // const response = await axios.get(`${apiUrl}`) //Get the data from the api
          // .catch(err => {
          //   console.log('API error in teams.js :')
          //   console.log(err)
          // })
          // Team.create({ data: response.data })
          // commit('setLoading', false)
      }
    },

    mutations: {

      //Set the loading status of the app
      setLoading(state, bool) {
        state.loading = bool
      }
    }

  }