import axios from 'axios'
import Category from '../models/Category';

export default {
    namespaced: true,

    state: {
      loading: true
    },

    getters: {
      loadingCategories: state => {
        return state.loading
        //comment 
      }
    },
  
    actions: {
      async fetchCategories({commit}) {
          // Set the state to loading
          commit('setLoading', true)
          
          const apiUrl = `/api/collection/categories`

          // console.log(`Getting comments from ${apiUrl}`)
          const response = await axios.get(`${apiUrl}`) //Get the data from the api
          Category.create({ data: response.data })
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