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
          
          const apiUrl = `/api/collection/${collection_id}/teams`

          // console.log(`Getting users from ${apiUrl}`)
          const response = await axios.get(`${apiUrl}`) //Get the data from the api
          Team.create({ data: response.data })
          commit('setLoading', false)
      }
    },

    mutations: {

      //Set the loading status of the app
      setLoading(state, bool) {
        state.loading = bool
      }
    }

  }