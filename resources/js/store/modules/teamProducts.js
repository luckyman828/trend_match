import axios from 'axios'
import TeamProduct from '../models/TeamProduct'

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingTeamProducts: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchTeamProducts({commit}, file_id) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/file/${file_id}/team-products`

          let tryCount = 3
          let succes = false
          while(tryCount-- > 0 && !succes) {
            try {
              const response = await axios.get(`${apiUrl}`)
              TeamProduct.create({ data: response.data })
              commit('setLoading', false)
              succes = true
            }
            catch (err) {
              console.log('API error in teamProduct.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              if (tryCount <= 0) throw err
            }
          }
      },
      // Update the action of for a product for a user
      async updateTeamProduct({commit}, {team_id, product_id, phase_id, action}) {

        commit('setTeamProduct', {team_id, product_id, phase_id, action})

        await axios.put(`/api/team-product`, {
            team_id: team_id,
            product_id: product_id,
            phase_id: phase_id,
            action: action
        }).then(response => {
          console.log(response.data)
        }).catch(err =>{
          console.log(err);
        })

      },

      async updateManyTeamProducts({commit}, {team_id, product_ids, phase_id, action}) {

        commit('setManyTeamProducts', {team_id, product_ids, phase_id, action})

        await axios.put(`/api/many-team-products`, {
            team_id: team_id,
            product_ids: product_ids,
            phase_id: phase_id,
            action: action
        }).then(response => {
          console.log(response.data)
        }).catch(err =>{
          console.log(err);
        })

      },

      async createManyTeamProducts({commit}, {team_id, product_ids, phase_id, action}) {

        commit('setManyTeamProducts', {team_id, product_ids, phase_id, action})

        await axios.post(`/api/many-team-products`, {
            team_id: team_id,
            product_ids: product_ids,
            phase_id: phase_id,
            action: action
        }).then(response => {
          console.log(response.data)
        }).catch(err =>{
          console.log(err);
        })

      },

      async deleteTeamProduct({commit}, {team_id, product_id, phase_id}) {

        commit('deleteTeamProduct', {team_id, product_id, phase_id})

        await axios.delete(`/api/team-product`, {
          data: {
            team_id: team_id,
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
      setTeamProduct: (state, {team_id, product_id, phase_id, action} ) => {
        TeamProduct.insert({
          data: {
                team_id: team_id,
                product_id: product_id,
                phase_id: phase_id,
                action: action
            }
        })
      },
      setManyTeamProducts: (state, {team_id, product_ids, phase_id, action} ) => {

        // Prepare the data
        let data = []
        
        product_ids.forEach(product_id => {
          const productData = {
            team_id: team_id,
            product_id: product_id,
            phase_id: phase_id,
            action: action
          }
          data.push(productData)
        })

        TeamProduct.insert({
          data: data
        })
      },
      deleteTeamProduct: (state, {team_id, product_id, phase_id} ) => {

        TeamProduct.delete( (record) => {
          return record.team_id == team_id && record.product_id == product_id && record.phase_id == phase_id
        } )

      },
    }

  }