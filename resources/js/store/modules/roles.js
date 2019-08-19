import axios from 'axios'
import Role from '../models/Role'

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingRoles: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchRoles({commit}) {
          // Set the state to loading
          commit('setLoading', true)

          const apiUrl = `/api/roles`

          let tryCount = 3
          let succes = false
          while(tryCount-- > 0 && !succes) {
            try {
              const response = await axios.get(`${apiUrl}`)
              Role.create({ data: response.data })
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