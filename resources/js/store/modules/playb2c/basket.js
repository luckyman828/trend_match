export default {
    namespaced: true,

    state: {
        basket: [],
    },

    getters: {
        getBasket: state => state.basket,
        getBasketTotal: state =>
            state.basket.reduce((acc, curr) => {
                return (acc += curr.variant.yourPrice.wholesale_price * curr.qty)
            }, 0),
        getVariantIsInBasket: state => variant => state.basket.find(basketItem => basketItem.variant.id == variant.id),
        getItemIsInBasket: state => item => {
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
        addToBasket({ getters, commit, dispatch }, { variant, sizeDetail, qty = 1 }) {
            dispatch(
                'playEmbed/postMessage',
                { action: 'addToBasket', items: [{ id: variant.extra_data.shopid, quantity: qty }] },
                { root: true }
            )

            const newBasketItem = { variant, sizeDetail, qty }
            const alreadyAdded = getters.getItemIsInBasket(newBasketItem)
            if (alreadyAdded) {
                commit('SET_ITEM_QTY', alreadyAdded.qty + qty)
                return
            }
            commit('ADD_ITEM', newBasketItem)
        },
        removeFromBasket({ getters, commit, dispatch }, { variant, sizeDetail }) {
            dispatch(
                'playEmbed/postMessage',
                { action: 'removeFromBasket', items: [{ id: variant.extra_data.shopid }] },
                { root: true }
            )

            console.log('remove from basket action', variant, sizeDetail)
            commit('REMOVE_ITEM', { variant, sizeDetail })
        },
        updateItemQty({ getters, commit }, { item, qty }) {
            commit('SET_ITEM_QTY', { item, qty })
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
        ADD_ITEM(state, { variant, sizeDetail, qty }) {
            state.basket.push({ variant, sizeDetail, qty })
        },
        SET_ITEM_QTY(state, { item, qty }) {
            item.qty = Math.max(qty, 0)
        },
        UPDATE_BASKET_ITEM(state, item) {},
    },
}
