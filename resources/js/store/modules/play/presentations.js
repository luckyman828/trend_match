import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        presentations: [],
        presentationsFilteredBySearch: [],
    },

    getters: {
        getPresentations: state => state.presentations,
        getPresentationsFilteredBySearch: state => state.presentationsFilteredBySearch,
        getCurrentPresentation: (state, getters, rootState, rootGetters) =>
            rootGetters['playPresentation/getPresentation'],
    },

    actions: {
        async instantiateBasePresentation({ dispatch }) {
            const newPresentation = await dispatch('files/instantiateBaseFile', null, { root: true })
            newPresentation.name = `New presentation`
            newPresentation.apps.push('play')
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
        async fetchPresentationDetails({ dispatch }, presentationId) {
            const presentation = await dispatch('files/fetchFile', presentationId, { root: true })
            await dispatch('initPresentations', [presentation])
            return presentation
        },
        async insertPresentation({ commit, rootGetters, dispatch }, presentation) {
            const workspaceId = rootGetters['workspaces/getCurrentWorkspaceId']
            const apiUrl =
                !presentation.parent_id || presentation.parent_id == 0
                    ? `/workspaces/${workspaceId}/files`
                    : `/files/${presentation.parent_id}/children`

            await axios.post(apiUrl, presentation).then(response => {
                Object.assign(presentation, response.data)
                commit('INSERT_PRESENTATION', presentation)
            })
            dispatch('insertDefaultPresentationSelectionSetup', presentation)
        },
        async insertDefaultPresentationSelectionSetup({ dispatch }, presentation) {
            // Create a default MASTER selection on the presentation
            const selection = await dispatch('selections/instantiateBaseSelection', null, { root: true })
            selection.type = 'Master'
            selection.name = 'Master'

            dispatch(
                'selections/insertSelection',
                { file: presentation, selection, addToState: false, displaySnackbar: false },
                { root: true }
            )
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
        SET_PRESENTATIONS_FILTERED_BY_SEARCH(state, presentations) {
            state.presentationsFilteredBySearch = presentations
        },
    },
}
