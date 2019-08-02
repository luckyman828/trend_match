import axios from 'axios'
import CommentVote from '../models/CommentVote';

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingCommentVotes: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchCommentVotes({commit}, {collection_id}) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/collection/${collection_id}/comment-votes`

          // console.log(`Getting comments from ${apiUrl}`)
          const response = await axios.get(`${apiUrl}`) //Get the data from the api
          CommentVote.create({ data: response.data })
          commit('setLoading', false)
      }
    },

    mutations: {

      //Set the loading status of the app
      setLoading(state, bool) {
        state.loading = bool
      }
    }

  }