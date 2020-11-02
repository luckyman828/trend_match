import axios from 'axios'

export default {
    namespaced: true,

    state: {
        presentationQueue: [],
        presentationQueueCurrentProductId: null,
        searchItemDragActive: false,
    },

    getters: {
        getpresentationQueue: state => state.presentationQueue,
        getpresentationQueueCurrentProductId: state => state.presentationQueueCurrentProductId,
        getpresentationQueueCurrentProduct: state =>
            state.presentationQueue.find(x => x.id == state.presentationQueueCurrentProductId),
        getpresentationQueueCurrentProductIndex: state =>
            state.presentationQueue.findIndex(x => x.id == state.presentationQueueCurrentProductId),
        getNextProduct: (state, getters) => {
            // Find the index of the current product
            const index = getters.getpresentationQueueCurrentProductIndex
            // Check that the current is not the last in the array
            if (index + 1 < state.presentationQueue.length) {
                return state.presentationQueue[index + 1]
            }
        },
        getPrevProduct: (state, getters) => {
            // Find the index of the current product
            const index = getters.getpresentationQueueCurrentProductIndex
            // Check that the current is not the first in the array
            if (index > 0) {
                return state.presentationQueue[index - 1]
            }
        },
        getSearchItemDragActive: state => state.searchItemDragActive,
    },

    actions: {
        async addProductTopresentationQueue({ getters, commit }, { product, index }) {
            commit('ADD_PRODUCT_TO_PRESENTER_QUEUE', { product, index })

            // If no product is currently being broadcast, broadcast this product
            const currentProduct = getters.getpresentationQueueCurrentProduct
            if (!currentProduct) {
                commit('SET_PRESENTER_QUEUE_CURRENT_PRODUCT_ID', product.id)
            }
        },
        async addMultipleProductsTopresentationQueue({ getters, state, commit }, products) {
            // Filter the products to not add products that are already in the queue
            const productsFiltered = products.filter(product => !state.presentationQueue.find(x => x.id == product.id))
            commit('ADD_MULTIPLE_PRODUCTs_TO_PRESENTER_QUEUE', productsFiltered)

            // If no product is currently being broadcast, broadcast the first product product
            const currentProduct = getters.getpresentationQueueCurrentProduct
            if (!currentProduct) {
                commit('SET_PRESENTER_QUEUE_CURRENT_PRODUCT_ID', productsFiltered[0].id)
            }
        },
        async removeProductFrompresentationQueue({ getters, commit, dispatch }, product) {
            const currentProduct = getters.getpresentationQueueCurrentProduct
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
            const newProductIndex = getters.getpresentationQueue.findIndex(x => x.id == product.id)
            const currentProductIndex = getters.getpresentationQueueCurrentProductIndex
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
                state.presentationQueue.splice(index, 0, product)
            } else {
                state.presentationQueue.push(product)
            }
        },
        ADD_MULTIPLE_PRODUCTs_TO_PRESENTER_QUEUE(state, products) {
            state.presentationQueue.push(...products)
        },
        REMOVE_PRODUCT_FROM_PRESENTER_QUEUE(state, product) {
            const index = state.presentationQueue.findIndex(x => x.id == product.id)
            state.presentationQueue.splice(index, 1)
        },
        SET_PRESENTER_QUEUE(state, newQueue) {
            state.presentationQueue = newQueue
        },
        SET_PRESENTER_QUEUE_CURRENT_PRODUCT_ID(state, id) {
            state.presentationQueueCurrentProductId = id
        },
        SET_SEARCH_ITEM_DRAG_ACTIVE(state, bool) {
            state.searchItemDragActive = bool
        },
    },
}
