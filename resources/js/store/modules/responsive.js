import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        mobileBreakpoint: 800,
    },

    getters: {
        getIsMobile: state => {
            console.log('get is mobile', window.innerWidth < 800)
            return window.innerWidth < state.mobileBreakpoint
        },
    },

    actions: {},

    mutations: {},
}
