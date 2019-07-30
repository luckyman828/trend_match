import axios from 'axios'
import Country from '../models/Country'

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingCountries: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchCountries({commit}) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/countries`

          // console.log(`Getting comments from ${apiUrl}`)
          const response = await axios.get(`${apiUrl}`) //Get the data from the api
          Country.create({ data: response.data })
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