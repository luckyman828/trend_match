import axios from 'axios'

export default {
    namespaced: true,

    state: {
        presenterQueue: [],
        presenterQueueCurrentProductId: null,
        searchItemDragActive: false,
    },

    getters: {
        getPresenterQueue: state => state.presenterQueue,
        getPresenterQueueCurrentProductId: state => state.presenterQueueCurrentProductId,
        getPresenterQueueCurrentProduct: state =>
            state.presenterQueue.find(x => x.id == state.presenterQueueCurrentProductId),
        getPresenterQueueCurrentProductIndex: state =>
            state.presenterQueue.findIndex(x => x.id == state.presenterQueueCurrentProductId),
        getNextProduct: (state, getters) => {
            // Find the index of the current product
            const index = getters.getPresenterQueueCurrentProductIndex
            // Check that the current is not the last in the array
            if (index + 1 < state.presenterQueue.length) {
                return state.presenterQueue[index + 1]
            }
        },
        getPrevProduct: (state, getters) => {
            // Find the index of the current product
            const index = getters.getPresenterQueueCurrentProductIndex
            // Check that the current is not the first in the array
            if (index > 0) {
                return state.presenterQueue[index - 1]
            }
        },
        getSearchItemDragActive: state => state.searchItemDragActive,
        getPresentationActive: state,
    },

    actions: {
        async addProductToPresenterQueue({ getters, commit }, { product, index }) {
            commit('ADD_PRODUCT_TO_PRESENTER_QUEUE', { product, index })

            // If no product is currently being broadcast, broadcast this product
            const currentProduct = getters.getPresenterQueueCurrentProduct
            if (!currentProduct) {
                commit('SET_PRESENTER_QUEUE_CURRENT_PRODUCT_ID', product.id)
            }
        },
        async addMultipleProductsToPresenterQueue({ getters, state, commit }, products) {
            // Filter the products to not add products that are already in the queue
            const productsFiltered = products.filter(product => !state.presenterQueue.find(x => x.id == product.id))
            commit('ADD_MULTIPLE_PRODUCTs_TO_PRESENTER_QUEUE', productsFiltered)

            // If no product is currently being broadcast, broadcast the first product product
            const currentProduct = getters.getPresenterQueueCurrentProduct
            if (!currentProduct) {
                commit('SET_PRESENTER_QUEUE_CURRENT_PRODUCT_ID', productsFiltered[0].id)
            }
        },
        async removeProductFromPresenterQueue({ getters, commit, dispatch }, product) {
            const currentProduct = getters.getPresenterQueueCurrentProduct
            // Disallow removing the current product
            if (currentProduct.id == product.id) {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: 'You cannot remove the currently broadcast product',
                        type: 'warning',
                        iconClass: 'fa-exclamation-triangle',
                    },
                    { root: true }
                )
                return
            }
            // If the current product is getting removed, set the next product as active if any
            commit('REMOVE_PRODUCT_FROM_PRESENTER_QUEUE', product)
        },
        async broadcastProduct({ getters, rootGetters, dispatch, commit }, product) {
            const selection = rootGetters['selections/getCurrentSelection']
            const apiUrl = `/selections/${selection.id}/presentation/${product.id}`

            let success = true
            await axios.put(apiUrl).catch(err => {
                commit(
                    'alerts/SHOW_SNACKBAR',
                    {
                        msg: 'Something went wrong trying to broadcast product. Please try again.',
                        type: 'warning',
                        iconClass: 'fa-exclamation-triangle',
                        callback: () => dispatch('broadcastProduct', product),
                        callbackLabel: 'Retry',
                        duration: 0,
                    },
                    { root: true }
                )
                success = false
            })
            if (!success) return

            // If the product is not currently in our queue, add it right after the current product
            const newProductIndex = getters.getPresenterQueue.findIndex(x => x.id == product.id)
            const currentProductIndex = getters.getPresenterQueueCurrentProductIndex
            if (newProductIndex < 0) {
                commit('ADD_PRODUCT_TO_PRESENTER_QUEUE', { product, index: currentProductIndex + 1 })
            }
            commit('SET_PRESENTER_QUEUE_CURRENT_PRODUCT_ID', product.id)
        },
    },

    mutations: {
        ADD_PRODUCT_TO_PRESENTER_QUEUE(state, { product, index }) {
            // If we have been provided an index, then insert at that position
            if (index) {
                state.presenterQueue.splice(index, 0, product)
            } else {
                state.presenterQueue.push(product)
            }
        },
        ADD_MULTIPLE_PRODUCTs_TO_PRESENTER_QUEUE(state, products) {
            state.presenterQueue.push(...products)
        },
        REMOVE_PRODUCT_FROM_PRESENTER_QUEUE(state, product) {
            const index = state.presenterQueue.findIndex(x => x.id == product.id)
            state.presenterQueue.splice(index, 1)
        },
        SET_PRESENTER_QUEUE(state, newQueue) {
            state.presenterQueue = newQueue
        },
        SET_PRESENTER_QUEUE_CURRENT_PRODUCT_ID(state, id) {
            state.presenterQueueCurrentProductId = id
        },
        SET_SEARCH_ITEM_DRAG_ACTIVE(state, bool) {
            state.searchItemDragActive = bool
        },
    },
}
