import axios from 'axios'
import Action from '../models/Action'

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingActions: state => {
        return state.loading
      }
    },
  
    actions: {

      // Get the actions
      async fetchActions({commit}, {collection_id}) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/collection/${collection_id}/actions`

          // console.log(`Getting actions from ${apiUrl}`)
          const response = await axios.get(`${apiUrl}`) //Get the data from the api
          Action.create({ data: response.data })
          commit('setLoading', false)
      },

      // Update the action of for a product for a user
      async updateAction({commit}, {user_id, productToUpdate, action_code}) {

        console.log("API updating record. Action type: " + action_code + " for user: " + user_id + " and product: " + productToUpdate)
        commit('setAction', {productToUpdate, user_id, action_code})

        // await axios.put(`/api/action`, {
        //   action_code: action_code,
        //   user_id: user_id,
        //   product_id: productToUpdate
        // }).then(response => {
        //   console.log(response.data)
        // }).catch(err =>{
        //   console.log(err);
        // })

      }

    },

    mutations: {

      //Set the loading status of the app
      setLoading(state, bool) {
        state.loading = bool
      },
      setAction: (state, {productToUpdate, user_id, action_code} ) => {
        console.log('setting action')
        Action.update({
          where: (action) => {
            return (action.product_id === productToUpdate && action.user_id === user_id)
          },
          data: {action: action_code}
        })
      }
        
    }

  }