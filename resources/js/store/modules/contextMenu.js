export default {
    namespaced: true,

    state: {
        amountOfVisibleContextMenus: 0,
    },

    getters: {
        getContextMenuIsVisible: state => {
            return state.amountOfVisibleContextMenus > 0
        },
    },

    actions: {},

    mutations: {
        INCREMENT_VISIBLE_AMOUNT(state) {
            state.amountOfVisibleContextMenus++
        },
        DECREMENT_VISIBLE_AMOUNT(state) {
            state.amountOfVisibleContextMenus--
        },
    },
}
