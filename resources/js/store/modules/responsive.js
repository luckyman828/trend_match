import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        mobileBreakpoint: 800,
    },

    getters: {
        getIsMobile: state => {
            return window.innerWidth < state.mobileBreakpoint || window.innerHeight > window.innerWidth
        },
    },

    actions: {},

    mutations: {},
}
