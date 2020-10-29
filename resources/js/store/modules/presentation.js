export default {
    namespaced: true,

    state: {
        presentationId: null,
        currentProduct: null,
    },

    getters: {
        getCurrentPresentationId: (state, getters, rootState, rootGetters) => {
            // Check if we currently have any active selection
            const selection = rootGetters['selections/getCurrentSelection']
            if (!selection) return
            return selection.presentation_id
        },
        getPresentationIsActive: (state, getters) => !!getters.getCurrentPresentationId,
        getCurrentProduct: state => !!state.currentProduct,
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
                commit('SET_CURRENT_PRODUCT', product.id)
            })
        },
    },

    mutations: {
        SET_CURRENT_PRESENTATION_ID(state, id) {
            console.log('set current presentation id', id)
            state.presentationId = id
        },
        SET_CURRENT_PRODUCT(state, product) {
            state.currentProduct = product
        },
    },
}
