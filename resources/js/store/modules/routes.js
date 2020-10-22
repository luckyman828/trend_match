import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        nextUrl: null,
    },

    getters: {
        getNextUrl: state => state.nextUrl,
    },

    actions: {},

    mutations: {
        SET_NEXT_URL(state, nextUrl) {
            state.nextUrl = nextUrl
        },
    },
}
