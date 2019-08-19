import AuthUser from "../models/AuthUser";

//import axios from 'axios';


export default {
    namespaced: true,

    state: {
        user: []
    },

    getters: {
        // Get the current state of the user
        authUser: (state) => state.user
    },

    actions: {
        // Get the authenticated user object.
        // The auth_user object is passed through the homeController throuhg the auth-middleware
        async getAuthUser({ commit }) {
            commit('setAuthUser', await window.auth_user);
        }
    },

    mutations: {
        // Update the user state
        setAuthUser(state, user) {
            state.user = user;
            AuthUser.create({ data: user})
        }
        // When the user state has been updated dispatch an event

        // This event should be picked up by the products component and trigger the fetch products action in the products module.
    },

}