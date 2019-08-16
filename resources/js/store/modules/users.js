import axios from 'axios'
import User from '../models/User'

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingUsers: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchUsers({commit}, {collection_id}) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/collection/${collection_id}/users`

          let tryCount = 3
          let succes = false
          while(tryCount-- > 0 && !succes) {
            try {
              const response = await axios.get(`${apiUrl}`)
              User.create({ data: response.data })
              commit('setLoading', false)
              succes = true
            }
            catch (err) {
              console.log('API error in users.js :')
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