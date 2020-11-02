export default {
    namespaced: true,

    state: {
        activePresentationDetails: null,
        presentationId: null,
        currentProductId: null,
    },

    getters: {
        getCurrentPresentationId: (state, getters, rootState, rootGetters) => {
            // Check if we currently have any active selection
            const selection = rootGetters['selections/getCurrentSelection']
            if (!selection) return
            return selection.presentation_id
        },
        getPresentationIsActive: (state, getters) => {
            return getters.getCurrentPresentationId > 0
        },
        getCurrentProductId: state => state.activePresentationDetails.product.id,
        getCurrentProduct: (state, getters, rootState, rootGetters) => {
            const products = rootGetters['products/getProducts']
            if (!products) return
            const product = products.find(x => x.id == getters.getCurrentProductId)
            return product
        },
    },

    actions: {
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
    },
}
