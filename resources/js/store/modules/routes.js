import axios from 'axios'
import Vue from 'vue'
import router from '../../router'

export default {
    namespaced: true,

    state: {
        nextUrl: null,
    },

    getters: {
        getNextUrl: state => state.nextUrl,
        getCurrentRouteRoot: state => router.currentRoute.matched[0],
    },

    actions: {},

    mutations: {
        SET_NEXT_URL(state, nextUrl) {
            state.nextUrl = nextUrl
        },
    },
}
