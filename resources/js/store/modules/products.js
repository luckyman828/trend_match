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

          // console.log(`Getting products from ${apiUrl}`)
          const response = await axios.get(`${apiUrl}`) //Get the data from the api
          Product.create({ data: response.data })
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