import axios from 'axios'
import PhaseProduct from '../models/PhaseProduct'

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingPhaseProduct: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchPhaseProducts({commit}, file_id) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/file/${file_id}/phase-products`

          let tryCount = 3
          let succes = false
          while(tryCount-- > 0 && !succes) {
            try {
              const response = await axios.get(`${apiUrl}`)
              PhaseProduct.create({ data: response.data })
              commit('setLoading', false)
              succes = true
            }
            catch (err) {
              console.log('API error in haseProducts.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              if (tryCount <= 0) throw err
            }
          }
      },
      // Update the action of for a product for a user
      async updatePhaseProduct({commit}, {product_id, phase_id, action}) {

        commit('setPhaseProduct', {product_id, phase_id, action})

        await axios.put(`/api/phase-product`, {
            product_id: product_id,
            phase_id: phase_id,
            action: action
        }).then(response => {
          console.log(response.data)
        }).catch(err =>{
          console.log(err);
        })

      },

      async updateManyPhaseProducts({commit}, {product_ids, phase_id, action}) {

        commit('setManyPhaseProducts', {product_ids, phase_id, action})

        await axios.put(`/api/many-phase-products`, {
            product_ids: product_ids,
            phase_id: phase_id,
            action: action
        }).then(response => {
          console.log(response.data)
        }).catch(err =>{
          console.log(err);
        })

      },

      async createManyPhaseProducts({commit}, {product_ids, phase_id, action}) {

        commit('setManyPhaseProducts', {product_ids, phase_id, action})

        await axios.post(`/api/many-phase-products`, {
            product_ids: product_ids,
            phase_id: phase_id,
            action: action
        }).then(response => {
          console.log(response.data)
        }).catch(err =>{
          console.log(err);
        })

      },

      async deletePhaseProduct({commit}, {product_id, phase_id}) {

        commit('deletePhaseProduct', {product_id, phase_id})

        await axios.delete(`/api/phase-product`, {
          data: {
            product_id: product_id,
            phase_id: phase_id,
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
      setPhaseProduct: (state, {product_id, phase_id, action} ) => {

        PhaseProduct.insert({
          data: {
                product_id: product_id,
                phase_id: phase_id,
                action: action
            }
        })
      },
      setManyPhaseProducts: (state, {product_ids, phase_id, action} ) => {

        // Prepare the data
        let data = []
        
        product_ids.forEach(product_id => {
          const productData = {
            product_id: product_id,
            phase_id: phase_id,
            action: action
          }
          data.push(productData)
        })

        PhaseProduct.insert({
          data: data
        })
      },
      deletePhaseProduct: (state, {product_id, phase_id} ) => {

        PhaseProduct.delete( (record) => {
          return record.product_id == product_id && record.phase_id == phase_id
        } )

      },
    }

  }