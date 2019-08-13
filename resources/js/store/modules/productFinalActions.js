import axios from 'axios'
import ProductFinalAction from '../models/ProductFinalAction'

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingFinalActions: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchFinalActions({commit}, {collection_id}) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/collection/${collection_id}/final-actions`

          let tryCount = 3
          while(tryCount > 0) {
            try {
              tryCount --
              const response = await axios.get(`${apiUrl}`)
              ProductFinalAction.create({ data: response.data })
              commit('setLoading', false)
            }
            catch (err) {
              console.log('API error in productFinalAction.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              tryCount --
              if (tryCount <= 0) throw err
            }
          }
          
          // const response = await axios.get(`${apiUrl}`) //Get the data from the api
          // .catch(err => {
          //   console.log('API error in productFinalAction.js :')
          //   console.log(err)
          //   console.log('Trying to fetch again')
          // })
          // ProductFinalAction.create({ data: response.data })
          // commit('setLoading', false)
      },
      // Update the action of for a product for a user
      async updateFinalAction({commit}, {phase, productToUpdate, action_code}) {

        commit('setFinalAction', {productToUpdate, phase, action_code})

        await axios.put(`/api/final-action`, {
          action_code: action_code,
          phase: phase,
          product_id: productToUpdate
        }).then(response => {
          console.log(response.data)
        }).catch(err =>{
          console.log(err);
        })

      },
    },

    mutations: {

      //Set the loading status of the app
      setLoading(state, bool) {
        state.loading = bool
      },
      setFinalAction: (state, {productToUpdate, phase, action_code} ) => {
        console.log('setting action')
        ProductFinalAction.insert({
          data: {
              action: action_code,
              product_id: productToUpdate,
              phase: phase,
            }
        })
      },
    }

  }