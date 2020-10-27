export default {
    namespaced: true,

    state: {
        presentationId: null,
        currentProduct: null,
    },

    getters: {
        getCurrentPresentationId: state => state.presentationId,
        getPresentationIsActive: state => !!state.presentationId,
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

            const apiUrl = `/presentation/${presentationId}?product_id=${product.id}`

            await axios.put(apiUrl).then(response => {
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
