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
        fetchWishlist({ rootGetters, commit }, presentationId) {
            const localStorageEnabled = rootGetters['persist/getLocalStorageEnabled']
            if (!localStorageEnabled) return
            const storedWishlist = localStorage.getItem(`play-wishlist-${presentationId}`)
            if (!storedWishlist) return
            const wishlist = JSON.parse(storedWishlist)

            // Match the stored wishlist with our local products
            const products = rootGetters['products/getProducts']
            wishlist.map(wishlistItem => {
                let variant
                products.find(product => {
                    variant = product.variants.find(variant => variant.id == wishlistItem.id)
                    if (variant) return true
                })
                if (variant) {
                    commit('ADD_ITEM', variant)
                }
            })
        },
        toggleInWishlist({ dispatch, getters }, variant) {
            if (getters.getVariantIsInWishlist(variant)) {
                dispatch('removeFromWishlist', variant)
            } else {
                dispatch('addToWishlist', variant)
            }
        },
        addToWishlist({ commit, dispatch }, variant) {
            commit('ADD_ITEM', variant)
            // Save wishlist to localstorage
            dispatch('saveToLocalStorage')
        },
        removeFromWishlist({ commit, dispatch }, variant) {
            commit('REMOVE_ITEM', variant)
            dispatch('saveToLocalStorage')
        },
        addItems({ commit, getters, dispatch }, variants) {
            variants.map(variant => {
                if (!getters.getVariantIsInWishlist(variant)) {
                    commit('ADD_ITEM', variant)
                }
            })
            dispatch('saveToLocalStorage')
        },
        removeItems({ commit, getters, dispatch }, variants) {
            variants.map(variant => {
                if (getters.getVariantIsInWishlist(variant)) {
                    commit('REMOVE_ITEM', variant)
                }
            })
            dispatch('saveToLocalStorage')
        },
        saveToLocalStorage({ getters, rootGetters }) {
            const presentationId = rootGetters['playPresentation/getPresentation'].id
            const wishlist = getters.getWishlist
            localStorage.setItem(`play-wishlist-${presentationId}`, JSON.stringify(wishlist))
        },
    },

    mutations: {
        SET_WISHLIST(state, wishlist) {
            state.wishlist = wishlist
        },
        REMOVE_ITEM(state, variant) {
            const index = state.wishlist.findIndex(x => x.id == variant.id)
            if (index >= 0) {
                state.wishlist.splice(index, 1)
            }
        },
        ADD_ITEM(state, item) {
            state.wishlist.push(item)
        },
    },
}
