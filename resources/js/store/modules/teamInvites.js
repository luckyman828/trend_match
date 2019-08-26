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
      async fetchTeamInvites ({commit}, workspace_id) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/workspace/${workspace_id}/team-invites`

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
      async resend({commit}, {email, team, authUser}) {

        const newUser = {
          email: email,
          name: ''
        }

        let succes
        // Handle the invite in the DB via API
        await axios.post(`/api/resend-invite`, {
          user: newUser,
          team: team,
          sender: authUser
        }).then(response => {
          console.log(response.data)
          succes = true
        }).catch(err =>{
          console.log(err);
          succes = false
        })
        return succes


      },
      async deleteInvite({commit}, {email, team_id}) {

        commit('deleteTeamInvite', {email: email, team_id: team_id})

        const apiUrl = `/api/team-invite`
        // Handle the invite in the DB via API
        await axios.delete(`${apiUrl}`, {
          data: {
            email: email,
            team_id: team_id
          }
        }).then(response => {
          console.log(response.data)
        }).catch(err =>{
          console.log(err);
        })


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
        TeamInvite.delete(invite => {
          return ( invite.email == email && invite.team_id == team_id)
        })
      }
    }

  }