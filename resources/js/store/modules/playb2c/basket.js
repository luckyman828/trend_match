import Vue from 'vue'

export default {
    namespaced: true,

    state: {
        basket: [],
    },

    getters: {
        getBasket: state => state.basket,
        getBasketTotal: state =>
            state.basket.reduce((acc, curr) => {
                return (acc += curr.variant.yourPrice.wholesale_price * curr.quantity)
            }, 0),
        getVariantIsInBasket: state => variant => state.basket.find(basketItem => basketItem.variant.id == variant.id),
        getItemIsInBasket: state => item => {
            return state.basket.find(
                basketItem =>
                    basketItem.variant.id == item.variant.id &&
                    (!item.sizeDetail || basketItem.sizeDetail.size == item.sizeDetail.size)
            )
        },
        getBasketItem: state => item => {
            return state.basket.find(
                basketItem =>
                    basketItem.variant.id == item.variant.id &&
                    (!item.sizeDetail || basketItem.sizeDetail.size == item.sizeDetail.size)
            )
        },
    },

    actions: {
        fetchBasket({ state }, msg) {
            alert(msg)
        },
        async addToBasket({ getters, commit, dispatch }, { variant, sizeDetail, quantity = 1 }) {
            const newBasketItem = { variant, sizeDetail, quantity }
            const alreadyAdded = getters.getItemIsInBasket(newBasketItem)
            if (alreadyAdded) {
                console.log('already added!? :o ')
                commit('SET_ITEM_QTY', alreadyAdded.quantity + quantity)
            } else {
                commit('ADD_ITEM', newBasketItem)
            }

            await dispatch(
                'playEmbed/postMessage',
                { action: 'addToBasket', items: [{ variant, sizeDetail, quantity }] },
                { root: true }
            )
        },
        async removeFromBasket({ getters, commit, dispatch }, { variant, sizeDetail }) {
            commit('REMOVE_ITEM', { variant, sizeDetail })

            await dispatch(
                'playEmbed/postMessage',
                { action: 'removeFromBasket', items: [{ variant, sizeDetail }] },
                { root: true }
            )
        },
        async updateItemQty({ dispatch, commit }, { item, quantity }) {
            commit('SET_ITEM_QTY', { item, quantity })

            await dispatch('playEmbed/postMessage', { action: 'updateItemQuantity', item }, { root: true })
        },
        async changeItemSize({ dispatch, getters }, { item, newSizeDetail, oldSizeDetail }) {
            // Vue.set(item, 'sizeDetail', newSizeDetail)

            // Remove old and add new if the old item is still in the basket / has not already been updated
            const notUpdated = getters.getItemIsInBasket({ variant: item.variant, sizeDetail: oldSizeDetail })

            if (notUpdated) {
                // Remove the old item if it is still there
                await dispatch('removeFromBasket', { variant: item.variant, sizeDetail: oldSizeDetail })
                // Add the new item
                await dispatch('addToBasket', { variant: item.variant, sizeDetail: newSizeDetail })
            }

            // Post message to parent window
            await dispatch(
                'playEmbed/postMessage',
                { action: 'changeItemSize', updateDetail: { item, newSizeDetail, oldSizeDetail } },
                { root: true }
            )
        },
    },

    mutations: {
        SET_BASKET(state, basket) {
            state.basket = basket
        },
        REMOVE_ITEM(state, { variant, sizeDetail }) {
            // Find all basket items that match our criteria (all sizes of the variant if no size is provided)
            state.basket = state.basket.filter(
                basketItem =>
                    !(
                        basketItem.variant.id == variant.id &&
                        (!sizeDetail || basketItem.sizeDetail.size == sizeDetail.size)
                    )
            )
        },
        ADD_ITEM(state, { variant, sizeDetail, quantity }) {
            state.basket.push({ variant, sizeDetail, quantity })
        },
        SET_ITEM_QTY(state, { item, quantity }) {
            item.quantity = Math.max(quantity, 0)
        },
        UPDATE_BASKET_ITEM(state, item) {},
    },
}
