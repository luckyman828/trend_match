export default {
    namespaced: true,

    state: {
        wishlist: [],
    },

    getters: {
        getWishlist: state => state.wishlist,
        getWishlistTotal: state =>
            state.wishlist.reduce((acc, curr) => {
                return (acc += curr.yourPrice.wholesale_price)
            }, 0),
        getVariantIsInWishlist: state => variant => {
            return !!state.wishlist.find(wishlistItem => wishlistItem.id == variant.id)
        },
    },

    actions: {
        fetchWishlist({ state }, msg) {
            alert(msg)
        },
        toggleInWishlist({dispatch, getters}, variant) {
            if (getters.getVariantIsInWishlist(variant)) {
                dispatch('removeFromWishlist', variant)
            } else {
                dispatch('addToWishlist', variant)
            }

        },
        addToWishlist({commit}, variant) {
            commit('ADD_ITEM', variant)
        },
        removeFromWishlist({commit}, variant) {
            commit('REMOVE_ITEM', variant)
        },
        addItems({commit, getters}, variants) {
            variants.map(variant => {
                if (!getters.getVariantIsInWishlist(variant)) {
                    commit('ADD_ITEM', variant)
                }
            })
        },
        removeItems({commit, getters}, variants) {
            variants.map(variant => {
                if (getters.getVariantIsInWishlist(variant)) {
                    commit('REMOVE_ITEM', variant)
                }
            })
        },
    },

    mutations: {
        SET_WISHLIST(state, wishlist) {
            state.wishlist = wishlist
        },
        REMOVE_ITEM(state, index) {
            state.wishlist.splice(index, 1)
        },
        ADD_ITEM(state, item) {
            state.wishlist.push(item)
        },
    },
}
