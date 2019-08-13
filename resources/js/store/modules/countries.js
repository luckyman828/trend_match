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

          let tryCount = 3
          while(tryCount > 0) {
            try {
              tryCount --
              const response = await axios.get(`${apiUrl}`)
              Country.create({ data: response.data })
              commit('setLoading', false)
            }
            catch (err) {
              console.log('API error in countries.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              tryCount --
              if (tryCount <= 0) throw err
            }
          }

          // console.log(`Getting comments from ${apiUrl}`)
          // const response = await axios.get(`${apiUrl}`) //Get the data from the api
          // .catch(err => {
          //   console.log('API error in countries.js :')
          //   console.log(err)
          // })
          // Country.create({ data: response.data })
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