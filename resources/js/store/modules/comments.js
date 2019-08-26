import axios from 'axios'
import Comment from '../models/Comment'

export default {
    namespaced: true,

    state: {
      loading: true,
      submitting: false,
    },

    getters: {
      loadingComments: state => {
        return state.loading
      },
      submittingComment: state => {
        return state.submitting
      }
    },
  
    actions: {
      async fetchComments({commit}, file_id) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/file/${file_id}/comments`

          let tryCount = 3
          let succes = false
          while(tryCount-- > 0 && !succes) {
            try {
              const response = await axios.get(`${apiUrl}`)
              Comment.create({ data: response.data })
              commit('setLoading', false)
              succes = true
            }
            catch (err) {
              console.log('API error in comments.js :')
              console.log(err)
              console.log(`Trying to fetch again. TryCount = ${tryCount}`)
              if (tryCount <= 0) throw err
            }
          }

          // console.log(`Getting comments from ${apiUrl}`)
          // const response = await axios.get(`${apiUrl}`) //Get the data from the api
          // .catch(err => {
          //   console.log('API error in comments.js :')
          //   console.log(err)
          // })
          // Comment.create({ data: response.data })
          // commit('setLoading', false)
      },
      async createComment({commit}, {comment}) {

        commit('setSubmitting', true)

        const response = await axios.post(`/api/comment`, {

          user_id: comment.user_id,
          product_id: comment.product_id,
          team_id: comment.team_id,
          phase: comment.phase,
          comment_body: comment.comment,
          important: comment.important,
          final: comment.final,
          product_final: comment.product_final,

        })

        // Get and set the comment id equal to the id given by the database
        comment.id = response.data.id
        commit('addComment', {comment: comment})

        console.log(response.data)
        commit('setSubmitting', false)

      },
      // Update the action of for a product for a user
        async markAsFinal({commit}, {comment}) {
 
          console.log('Module updating comment')
          commit('updateFinal', {comment: comment})
    
          await axios.put(`/api/comment/update`, {

            id: comment.id,
            user_id: comment.user_id,
            product_id: comment.product_id,
            comment_body: comment.comment,
            important: comment.important,
            final: comment.final,
            product_final: comment.product_final,

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
      setSubmitting(state, bool) {
        state.submitting = bool
      },
      addComment: (state, {comment} ) => {
        Comment.insert({
          data: comment
        })
      },
      updateFinal: (state, {comment} ) => {
        // Remove final status from this products comments
        Comment.update({
          where: (existing_comment) => {
            return (existing_comment.product_final && existing_comment.product_id === comment.product_id)
          },
          data: {product_final: 0}
        })
        // Set new comment as final
        Comment.update({
          data: comment
        })
      }
    }

  }