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

          let tryCount = 3
          let succes = false
          while(tryCount-- > 0 && !succes) {
            try {
              const response = await axios.get(`${apiUrl}`)
              UserTeam.create({ data: response.data })
              commit('setLoading', false)
              succes = true
            }
            catch (err) {
              console.log('API error in userTeams.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              if (tryCount <= 0) throw err
            }
          }

          // console.log(`Getting comments from ${apiUrl}`)
          // const response = await axios.get(`${apiUrl}`) //Get the data from the api
          // .catch(err => {
          //   console.log('API error in userTeams.js :')
          //   console.log(err)
          // })
          // UserTeam.create({ data: response.data })
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