import axios from 'axios'
import Category from '../models/Category';

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingCategories: state => {
        return state.loading
        //comment 
      }
    },
  
    actions: {
      async fetchCategories({commit}) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/collection/categories`

          let tryCount = 3
          while(tryCount > 0) {
            try {
              tryCount --
              const response = await axios.get(`${apiUrl}`)
              Category.create({ data: response.data })
              commit('setLoading', false)
            }
            catch (err) {
              console.log('API error in categories.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              tryCount --
              if (tryCount <= 0) throw err
            }
          }

          // console.log(`Getting comments from ${apiUrl}`)
          // const response = await axios.get(`${apiUrl}`) //Get the data from the api
          // .catch(err => {
          //   console.log('API error in categories.js :')
          //   console.log(err)
          // })
          // Category.create({ data: response.data })
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