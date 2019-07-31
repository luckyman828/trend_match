import axios from 'axios'
import Comment from '../models/Comment'

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingComments: state => {
        return state.loading
      }
    },
  
    actions: {
      async fetchComments({commit}, {collection_id}) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/collection/${collection_id}/comments`

          // console.log(`Getting comments from ${apiUrl}`)
          const response = await axios.get(`${apiUrl}`) //Get the data from the api
          Comment.create({ data: response.data })
          commit('setLoading', false)
      },
      async createComment({commit}, {comment}) {
        
        commit('addComment', {comment: comment})

        const response = await axios.post(`/api/comment`, {

          user_id: comment.user_id,
          product_id: comment.product_id,
          comment_body: comment.comment,
          important: comment.important,
          final: comment.final,

        })
        console.log(response.data)

      }
    },

    mutations: {

      //Set the loading status of the app
      setLoading(state, bool) {
        state.loading = bool
      },
      addComment: (state, {comment} ) => {
        Comment.insert({
          data: comment
        })
      }
    }

  }