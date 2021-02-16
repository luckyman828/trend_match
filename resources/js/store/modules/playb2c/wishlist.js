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
        getVariantIsInWishlist: state => variant => state.wishlist.find(wishlistItem => wishlistItem.id == variant.id),
    },

    actions: {
        fetchWishlist({ state }, msg) {
            alert(msg)
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
