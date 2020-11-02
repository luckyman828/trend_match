export default {
    namespaced: true,

    state: {
        presentations: [],
        activePresentationDetails: null,
        presentationId: null,
        currentProductId: null,
    },

    getters: {
        getPresentations: state => state.presentations,
        getCurrentPresentationId: (state, getters, rootState, rootGetters) => {
            // Check if we currently have any active selection
            const selection = rootGetters['selections/getCurrentSelection']
            if (!selection) return
            return selection.presentation_id
        },
        getPresentationIsActive: (state, getters) => {
            return getters.getCurrentPresentationId > 0
        },
        getCurrentPresentationDetails: (state, getters) =>
            state.presentations.find(x => x.id == getters.getCurrentPresentationId),
        getCurrentProductId: state => state.activePresentationDetails.product.id,
        getCurrentProduct: (state, getters, rootState, rootGetters) => {
            const products = rootGetters['products/getProducts']
            if (!products) return
            const product = products.find(x => x.id == getters.getCurrentProductId)
            return product
        },
    },

    actions: {
        async fetchFilePresentations({ commit }, fileId) {
            const apiUrl = `files/${fileId}/presentations`
            let presentations = []
            await axios.get(apiUrl).then(response => {
                presentations = response.data
                commit('SET_PRESENTATIONS', presentations)
            })
            return presentations
        },
        async broadcastProduct({ getters, commit }, { product }) {
            const presentationId = getters.getCurrentPresentationId
            if (!presentationId) {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: `No presentation is active.`,
                        iconClass: 'fa-info-circle',
                        type: 'warning',
                    },
                    { root: true }
                )
                return
            }

            const apiUrl = `/presentation/${presentationId}/present?product_id=${product.id}`

            await axios.post(apiUrl).then(response => {
                commit('SET_CURRENT_PRODUCT_ID', product.id)
            })
        },
        async fetchPresentationDetails({ commit }, presentationId) {
            const apiUrl = `presentation/${presentationId}`
            let presentationDetails
            await axios.get(apiUrl).then(response => {
                presentationDetails = response.data
                commit('SET_ACTIVE_PRESENTATION_DETAILS', presentationDetails)
                commit('SET_CURRENT_PRESENTATION_ID', presentationDetails.id)
                commit('INSERT_PRESENTATION', presentationDetails)
            })
            return presentationDetails
        },
    },

    mutations: {
        SET_CURRENT_PRESENTATION_ID(state, id) {
            state.presentationId = id
        },
        SET_CURRENT_PRODUCT_ID(state, id) {
            state.currentProductId = id
        },
        SET_ACTIVE_PRESENTATION_DETAILS(state, details) {
            state.activePresentationDetails = details
        },
        INSERT_PRESENTATION(state, presentation) {
            if (!state.presentations.find(x => x.id == presentation.id)) {
                state.presentations.push(presentation)
            }
        },
        SET_PRESENTATIONS(state, presentations) {
            state.presentations = presentations
        },
    },
}
