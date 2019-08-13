import axios from 'axios'
import Collection from '../models/Collection';

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingCollections: state => {
        return state.loading
        //comment 
      }
    },
  
    actions: {
      async fetchCollections({commit}) {
          // Set the state to loading
          commit('setLoading', true)
          const catalogue_id = 1
          
          const apiUrl = `/api/catalogue/${catalogue_id}/collections`

          let tryCount = 3
          while(tryCount > 0) {
            try {
              tryCount --
              const response = await axios.get(`${apiUrl}`)
              Collection.create({ data: response.data })
              commit('setLoading', false)
            }
            catch (err) {
              console.log('API error in collections.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              tryCount --
              if (tryCount <= 0) throw err
            }
          }

          // console.log(`Getting comments from ${apiUrl}`)
          // const response = await axios.get(`${apiUrl}`) //Get the data from the api
          // .catch(err => {
          //   console.log('API error in collections.js :')
          //   console.log(err)
          // })
          // Collection.create({ data: response.data })
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