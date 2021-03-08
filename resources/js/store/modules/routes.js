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
        getCurrentRouteRoot: state => router.currentRoute.matched.find(route => route.isRoot && route.root),
    },

    actions: {},

    mutations: {
        SET_NEXT_URL(state, nextUrl) {
            state.nextUrl = nextUrl
        },
    },
}
