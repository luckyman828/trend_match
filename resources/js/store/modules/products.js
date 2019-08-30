import axios from 'axios'
import Product from '../models/Product'

export default {
    namespaced: true,

    state: {
      loading: true,
      currentSingleProductId: -1
    },

    getters: {
      loadingProducts: state => {
        return state.loading
      },
      currentSingleProductId: state => {
        return state.currentSingleProductId
      }
    },
  
    actions: {
      async fetchProducts({commit}, file_id) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/file/${file_id}/products`

          let tryCount = 3
          let succes = false
          while(tryCount-- > 0 && !succes) {
            try {
              const response = await axios.get(`${apiUrl}`)
              Product.create({ data: response.data })
              commit('setLoading', false)
              succes = true
            }
            catch (err) {
              console.log('API error in products.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              if (tryCount <= 0) throw err
            }
          }

      }
    },

    mutations: {

      //Set the loading status of the app
      setLoading(state, bool) {
        state.loading = bool
      }
    }

  }