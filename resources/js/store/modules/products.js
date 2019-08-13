import axios from 'axios'
import Product from '../models/Product'

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingProducts: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchProducts({commit}, {collection_id}) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/collection/${collection_id}/products`

          let tryCount = 3
          while(tryCount > 0) {
            try {
              tryCount --
              const response = await axios.get(`${apiUrl}`)
              Product.create({ data: response.data })
              commit('setLoading', false)
            }
            catch (err) {
              console.log('API error in products.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              tryCount --
              if (tryCount <= 0) throw err
            }
          }

          // console.log(`Getting products from ${apiUrl}`)
          // const response = await axios.get(`${apiUrl}`) //Get the data from the api
          // .catch(err => {
          //   console.log('API error in products.js :')
          //   console.log(err)
          // })
          // Product.create({ data: response.data })
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