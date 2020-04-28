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
        // nextProduct: state => {
        //     // Find the index of the current product
        //     const index = state.availableProducts.findIndex(x => x.id == state.currentProduct.id)
        //     // Check that the current is not the last in the array
        //     if (index + 1 < state.availableProducts.length) {
        //         return state.availableProducts[index + 1]
        //     }
        // },
        // prevProduct: state => {
        //     // Find the index of the current product
        //     const index = state.availableProducts.findIndex(x => x.id == state.currentProduct.id)
        //     // Check that the current is not the first in the array
        //     if (index > 0) {
        //         return state.availableProducts[index - 1]
        //     }
        // },
    },

    actions: {
        async addProductToPresenterQueue({ commit }, product) {
            commit('ADD_PRODUCT_TO_PRESENTER_QUEUE', product)
        },
        async removeProductFromPresenterQueue({ commit }, product) {
            commit('REMOVE_PRODUCT_FROM_PRESENTER_QUEUE', product)
        },
        async setPresenterQueueCurrentProductId({ commit }, productId) {
            commit('SET_PRESENTER_QUEUE_CURRENT_PRODUCT_ID', productId)
        },
    },

    mutations: {
        ADD_PRODUCT_TO_PRESENTER_QUEUE(state, product) {
            state.presenterQueue.push(product)
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
