import axios from 'axios'

export default {
    namespaced: true,

    state: {
        presenterQueue: [],
        presenterQueueCurrentProductId: null,
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
    },

    actions: {
        async addProductToPresenterQueue({ commit }, { product, index }) {
            commit('ADD_PRODUCT_TO_PRESENTER_QUEUE', { product, index })
        },
        async removeProductFromPresenterQueue({ commit }, product) {
            commit('REMOVE_PRODUCT_FROM_PRESENTER_QUEUE', product)
        },
        async broadcastProduct({ getters, commit }, product) {
            console.log('Broadcast product!!', product.id)
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
            console.log('set current product id', id)
            state.presenterQueueCurrentProductId = id
        },
    },
}
