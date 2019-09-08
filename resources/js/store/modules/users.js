import axios from 'axios'
import User from '../models/User'

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingUsers: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchUsers({commit}, workspace_id) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/workspace/${workspace_id}/users`

          let tryCount = 3
          let succes = false
          while(tryCount-- > 0 && !succes) {
            try {
              const response = await axios.get(`${apiUrl}`)
              User.create({ data: response.data })
              commit('setLoading', false)
              succes = true
            }
            catch (err) {
              console.log('API error in users.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              if (tryCount <= 0) throw err
            }
          }
      },
      async changeRole({commit}, {user_id, role_id}) {

          commit('updateRole', {user_id, role_id})
          // commit('setManyActions', {productIds, user_id, action_code})
  
          await axios.put(`/api/user/role`, {
            user_id: user_id,
            role_id: role_id,
          }).then(response => {
            console.log(response.data)
          }).catch(err =>{
            console.log(err)
          })
  
        },

    },

    mutations: {

      //Set the loading status of the app
      setLoading(state, bool) {
        state.loading = bool
      },
      updateRole(state, {user_id, role_id}) {
        console.log(user_id)
        console.log(role_id)
        User.update({
          where: user_id,
          data: {role_id: role_id}
        })
      }
    }

  }