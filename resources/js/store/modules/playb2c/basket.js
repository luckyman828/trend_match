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
        getItemIsInBasket: state => item =>
            state.basket.find(basketItem => basketItem.variant.id == item.variant.id && basketItem.size == item.size),
    },

    actions: {
        fetchBasket({ state }, msg) {
            alert(msg)
        },
        addToBasket({ getters, commit, dispatch }, { variant, size, qty = 1 }) {
            
            dispatch('playEmbed/postMessage', { action: 'addToBasket', items: [{id: variant.extra_data.shopid, quantity: qty}] }, {root: true})

            const newBasketItem = { variant, size, qty }
            const alreadyAdded = getters.getItemIsInBasket(newBasketItem)
            if (alreadyAdded) {
                commit('SET_ITEM_QTY', alreadyAdded.qty + qty)
                return
            }
            commit('ADD_ITEM', newBasketItem)
        },
        updateItemQty({ getters, commit }, { item, qty }) {
            commit('SET_ITEM_QTY', { item, qty })
        },
    },

    mutations: {
        SET_BASKET(state, basket) {
            state.basket = basket
        },
        REMOVE_ITEM(state, index) {
            state.basket.splice(index, 1)
        },
        ADD_ITEM(state, { variant, size, qty }) {
            state.basket.push({ variant, size, qty })
        },
        SET_ITEM_QTY(state, { item, qty }) {
            item.qty = Math.max(qty, 0)
        },
    },
}
