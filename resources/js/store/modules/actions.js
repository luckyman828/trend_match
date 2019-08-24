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

          let tryCount = 3
          let succes = false
          while(tryCount-- > 0 && !succes) {
            try {
              const response = await axios.get(`${apiUrl}`)
              Action.create({ data: response.data })
              commit('setLoading', false)
              succes = true
            }
            catch (err) {
              console.log('API error in actions.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              if (tryCount <= 0) throw err
            }
          }
      },

      // Update the action of for a product for a user
      async updateAction({commit}, {user_id, productToUpdate, action_code}) {

        commit('setAction', {productToUpdate, user_id, action_code})
        console.log(' Updating action: ' + user_id + ', ' + productToUpdate + ', ' + action_code)

        await axios.put(`/api/action`, {
          action_code: action_code,
          user_id: user_id,
          product_id: productToUpdate
        }).then(response => {
          console.log(response.data)
        }).catch(err =>{
          console.log(err)
        })

      },

      async updateManyActions({commit}, {productIds, user_id, action_code}) {

        commit('setManyActions', {productIds, user_id, action_code})
        console.log('updating actions')

        await axios.put(`/api/many-actions`, {
          product_ids: productIds,
          user_id: user_id,
          action_code: action_code
        }).then(response => {
          console.log(response.data)
        }).catch(err =>{
          console.log(err);
        })

      },

      async createManyActions({commit}, {productIds, user_id, action_code}) {

        commit('setManyActions', {productIds, user_id, action_code})
        console.log('creating actions')

        await axios.post(`/api/many-actions`, {
          product_ids: productIds,
          user_id: user_id,
          action_code: action_code
        }).then(response => {
          console.log(response.data)
        }).catch(err =>{
          console.log(err);
        })

      },

      async deleteAction({commit}, {productToUpdate, user_id}) {

        commit('deleteAction', {productToUpdate, user_id})

        await axios.delete(`/api/action`, {
          data: {
            user_id: user_id,
            product_id: productToUpdate
          }
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
      setAction: (state, {productToUpdate, user_id, action_code} ) => {
        Action.insert({
          data: {
              action: action_code,
              product_id: productToUpdate,
              user_id: user_id,
            }
        })
      },
      deleteAction: (state, {productToUpdate, user_id} ) => {
        console.log('deleting action')

        Action.delete( (record) => {
          return record.product_id == productToUpdate && record.user_id == user_id
        } )

      },
      setManyActions: (state, {productIds, user_id, action_code} ) => {

        // Prepare the data
        let data = []
        
        productIds.forEach(product => {
          const productData = {
            product_id: product,
            user_id: user_id,
            action: action_code 
          }
          data.push(productData)
        })

        Action.insert({
          data: data
        })
      },
        
    }

  }