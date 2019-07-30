//import axios from 'axios';

const state ={
    user: []
};

const getters = {
    // Get the current state of the user
    authUser: (state) => state.user
};

const actions = {
    // Get the authenticated user object.
    // The auth_user object is passed through the homeController throuhg the auth-middleware
    async getAuthUser({ commit }) {
        commit('setAuthUser', await window.auth_user);
    }
};

const mutations = {
    // Update the user state
    setAuthUser(state, user) {
        state.user = user;
    }
    // When the user state has been updated dispatch an event

    // This event should be picked up by the products component and trigger the fetch products action in the products module.
};

export default {
    state,
    getters,
    actions,
    mutations
};