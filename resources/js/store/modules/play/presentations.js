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
            await dispatch('initPresentations', [newPresentation])
            return newPresentation
        },
        async fetchPresentations({ commit, dispatch }) {
            let presentations
            await dispatch('files/fetchFiles', true, { root: true }).then(async files => {
                presentations = files
                await dispatch('initPresentations', presentations)
                commit('SET_PRESENTATIONS', presentations)
            })
            return presentations
        },
        async fetchPresentationDetails() {},
        async insertPresentation({ commit, rootGetters }, presentation) {
            const workspaceId = rootGetters['workspaces/getCurrentWorkspaceId']
            const apiUrl =
                !presentation.parent_id || presentation.parent_id == 0
                    ? `/workspaces/${workspaceId}/files`
                    : `/files/${presentation.parent_id}/children`

            await axios.post(apiUrl, presentation).then(response => {
                Object.assign(presentation, response.data)
                commit('INSERT_PRESENTATION', presentation)
            })
        },
        async updatePresentationDetails({}, presentation) {
            const apiUrl = `files/${presentation.id}`
            await axios.put(apiUrl, {
                name: presentation.name,
                thumbnail: presentation.thumbnail,
            })
        },
        async initPresentations({ rootGetters }, presentations) {
            presentations.map(presentation => {
                Object.defineProperty(presentation, 'uploadChannel', {
                    get: function() {
                        return rootGetters['videos/getUploadChannels'].find(
                            uploadChannel => uploadChannel.presentationId == presentation.id
                        )
                    },
                })
            })
        },
    },

    mutations: {
        SET_PRESENTATIONS(state, payload) {
            state.presentations = payload
        },
        INSERT_PRESENTATION(state, presentation) {
            state.presentations.push(presentation)
        },
        SET_CURRENT_PRESENTATION(state, presentation) {
            state.currentPresentation = presentation
        },
    },
}
