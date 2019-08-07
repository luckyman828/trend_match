import axios from 'axios'
import UserTeam from '../models/UserTeam';

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingUserTeams: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchUserTeams ({commit}) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/collection/user-teams`

          // console.log(`Getting comments from ${apiUrl}`)
          const response = await axios.get(`${apiUrl}`) //Get the data from the api
          UserTeam.create({ data: response.data })
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