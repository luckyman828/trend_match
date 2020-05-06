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
    },

    actions: {
        async addProductToPresenterQueue({ commit }, { product, index }) {
            commit('ADD_PRODUCT_TO_PRESENTER_QUEUE', { product, index })
        },
        async removeProductFromPresenterQueue({ getters, commit, dispatch }, product) {
            const currentProduct = getters.getPresenterQueueCurrentProduct
            const nextProduct = getters.getNextProduct
            if (currentProduct.id == product.id && nextProduct) {
                dispatch('broadcastProduct', nextProduct)
            }
            // If the current product is getting removed, set the next product as active if any
            commit('REMOVE_PRODUCT_FROM_PRESENTER_QUEUE', product)
        },
        async broadcastProduct({ getters, rootGetters, dispatch, commit }, product) {
            const selection = rootGetters['selections/getCurrentSelection']
            const apiUrl = `/selections/${selection.id}/presentation/${product.id}`

            let success = true
            await axios.put(apiUrl).catch(err => {
                dispatch('alerts/showAlert', 'Something went wrong trying to broadcast product. Please try again.', {
                    root: true,
                })
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
