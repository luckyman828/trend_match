import axios from 'axios'
import TeamInvite from '../models/TeamInvite';
// import User from '../models/User';

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingTeamInvites: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchTeamInvites ({commit}) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/team-invites`

          let tryCount = 3
          let succes = false
          while(tryCount-- > 0 && !succes) {
            try {
              const response = await axios.get(`${apiUrl}`)
              TeamInvite.create({ data: response.data })
              commit('setLoading', false)
              succes = true
            }
            catch (err) {
              console.log('API error in teamInvites.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              if (tryCount <= 0) throw err
            }
          }

      },
      async resend({commit}, {email, team_title}) {
        
        console.log(email)
        console.log(team_title)

        // // Handle the invite in the DB via API
        // console.log('Sending request to /api/invite-user')
        // await axios.post(`/api/invite-user`, {
        //   user: user,
        //   team: team,
        //   sender: authUser
        // }).then(response => {
        //   console.log(response.data)
        // }).catch(err =>{
        //   console.log(err);
        // })


      },
      async deleteInvite({commit}, {email, team_id}) {
        
        console.log(email)
        console.log(team_id)

        commit('deleteTeamInvite', {email: email, team_id: team_id})

        // // Handle the invite in the DB via API
        // console.log('Sending request to /api/invite-user')
        // await axios.post(`/api/invite-user`, {
        //   user: user,
        //   team: team,
        //   sender: authUser
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
  
      addTeamInvite(state, {email, team_id}) {
        TeamInvite.insert({
          data: {
              email: email,
              team_id: team_id,
            }
        })
      },

      deleteTeamInvite(state, {email, team_id}) {
        TeamInvite.insert({
          data: {
              email: email,
              team_id: team_id,
            }
        })
      }
    }

  }