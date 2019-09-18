import axios from 'axios'
import Collection from '../models/Collection';
import User from '../models/User'

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingCollections: state => {
        return state.loading
        //comment 
      },
      files: (state, getters, rootState, rootGetters) => {
        if (!rootGetters['persist/loadingInit'] && !rootGetters['products/loadingProducts']) {
            const files = Collection.query().with('teams').with('teamFiles').all()
            const users = User.query().with('teams.teamFiles').with('actions').all()

            // Get the users that has access to the file
            files.forEach(file => {
                file.users = []
                const usersCopy = JSON.parse(JSON.stringify(users))
                usersCopy.forEach(user => {
                    // Determine if the user has access
                    let hasAccess = false
                    if (user.role_id <= 2) {
                        user.teams.forEach(team => {
                            team.teamFiles.forEach(teamFile => {
                                if (teamFile.file_id == file.id && teamFile.role_level <= user.role_id)
                                    hasAccess = true
                            })
                        })
                    }
                    else hasAccess = true
                    if (hasAccess) {
                        file.users.push(user)

                        // Calculate progress for the user
                        if (user.actions.length > 0) {
                            // user.progress = ( (user.actions.length / file.products.length) * 100).toFixed(0)
                            user.progress = (user.actions.length / file.products.length)
                        }
                        else user.progress = 0
                    }
                })
            })

            


            // Calculate progress for every TEAM

            return files
        }

      }
    },
  
    actions: {
      async fetchCollections({commit}, workspace_id) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/workspace/${workspace_id}/files`

          let tryCount = 3
          let succes = false
          while(tryCount-- > 0 && !succes) {
            try {
              const response = await axios.get(`${apiUrl}`)
              Collection.create({ data: response.data })
              commit('setLoading', false)
              succes = true
            }
            catch (err) {
              console.log('API error in collections.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              if (tryCount <= 0) throw err
            }
          }

          // console.log(`Getting comments from ${apiUrl}`)
          // const response = await axios.get(`${apiUrl}`) //Get the data from the api
          // .catch(err => {
          //   console.log('API error in collections.js :')
          //   console.log(err)
          // })
          // Collection.create({ data: response.data })
          // commit('setLoading', false)
      }
    },

    mutations: {

      //Set the loading status of the app
      setLoading(state, bool) {
        state.loading = bool
      }
    }

  }