import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        presentations: [],
        currentPresentation: null,
    },

    getters: {
        getPresentations: state => state.presentations,
        getCurrentPresentation: state => state.currentPresentation,
    },

    actions: {
        async instantiateBasePresentation({ dispatch }) {
            console.log('instatniate base presentation')
            const newPresentation = await dispatch('files/instantiateBaseFile', null, { root: true })
            newPresentation.name = `New presentation`
            return newPresentation
        },
        async fetchPresentations({ commit, dispatch }) {
            let presentations
            await dispatch('files/fetchFiles', true, { root: true }).then(files => {
                presentations = files
                commit('SET_PRESENTATIONS', presentations)
            })
            return presentations
        },
        async fetchPresentationDetails() {},
        async updatePresentationDetails({}, presentation) {
            const apiUrl = `files/${presentation.id}`
            await axios.put(apiUrl, {
                name: presentation.name,
                thumbnail: presentation.thumbnail,
            })
        },
    },

    mutations: {
        SET_PRESENTATIONS(state, payload) {
            state.presentations = payload
        },
        SET_CURRENT_PRESENTATION(state, presentation) {
            state.currentPresentation = presentation
        },
    },
}
