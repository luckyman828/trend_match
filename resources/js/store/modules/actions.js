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
          while(tryCount > 0) {
            try {
              tryCount --
              const response = await axios.get(`${apiUrl}`)
              Action.create({ data: response.data })
              commit('setLoading', false)
            }
            catch (err) {
              console.log('API error in actions.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              tryCount --
              if (tryCount <= 0) throw err
            }
          }

          // console.log(`Getting actions from ${apiUrl}`)
          // const response = await axios.get(`${apiUrl}`)
          // .catch(err => {
          //   console.log('API error in actions.js :')
          //   console.log(err)
          // })
          // Action.create({ data: response.data })
          // commit('setLoading', false)
      },

      // Update the action of for a product for a user
      async updateAction({commit}, {user_id, productToUpdate, action_code}) {

        console.log("API updating record. Action type: " + action_code + " for user: " + user_id + " and product: " + productToUpdate)
        commit('setAction', {productToUpdate, user_id, action_code})

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

      // Update multiple actions for the logged in user
      async updateActions({commit}, {user_id, productsToUpdate, action_code}) {

        console.log("API updating records. Action type: " + action_code + " for user: " + user_id + " and product: " + productsToUpdate)

        // Construct correctly formatted action objects from the received data
        const actionsToInsert = []
        productsToUpdate.forEach(product => {
          const data = {
            user_id: user_id,
            product_id: product,
            action: action_code
          }
          actionsToInsert.push(data)
        })

        commit('setActions', {actionsToInsert})

        // console.log(actionsToInsert)
        // let json = JSON.stringify(actionsToInsert)
        // let post_data={json_data:json}
        // console.log(post_data);
        actionsToInsert.forEach(action => {
          const response = axios.put(`/api/actions`, {
            user_id: action.user_id,
            product_id: action.user_id,
            action_code: action.action
          })
          console.log(response.data)
        })
        // console.log(response.err)

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
      },
      setActions: (state, {actionsToInsert} ) => {
        Action.insert({
          data: actionsToInsert
        })
      },
        
    }

  }