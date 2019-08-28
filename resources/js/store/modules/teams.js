import axios from 'axios'
import Team from '../models/Team'

export default {
    namespaced: true,

    state: {
      loading: true,
    },

    getters: {
      loadingTeams: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchTeams({commit}, workspace_id) {
          // Set the state to loading
          if (workspace_id) {

            commit('setLoading', true)
  
            const apiUrl = `/api/workspace/${workspace_id}/teams`
  
            let tryCount = 3
            let succes = false
            while(tryCount-- > 0 && !succes) {
              try {
                const response = await axios.get(`${apiUrl}`)
                Team.create({ data: response.data })
                commit('setLoading', false)
                succes = true
              }
              catch (err) {
                console.log('API error in teams.js :')
                console.log(err)
                console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                if (tryCount <= 0) throw err
              }
            }

          }
      },
      async createTeam({commit}, {name, workspace_id}) {

        const data = {
          title: name
        }
        const apiUrl = `/api/workspace/${workspace_id}/team`

        let succes
        let team_id = null
        // Handle the invite in the DB via API
        await axios.post(apiUrl, data
          ).then(response => {
          console.log(response.data)
          team_id = response.data.id
          succes = true
        }).catch(err =>{
          console.log(err);
          succes = false
        })
        
        commit('createTeam', {name: name, workspace_id: workspace_id, team_id: team_id})
        
        return succes

      },
    },

    mutations: {

      //Set the loading status of the app
      setLoading(state, bool) {
        state.loading = bool
      },
      createTeam(state, {name, workspace_id, team_id}) {
        Team.insert({
          data: {
            id: team_id,
            title: name,
            workspace_id: workspace_id
          }
        })
        console.log(name + workspace_id + team_id)
      }
    }

  }