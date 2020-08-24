export default {
    namespaced: true,

    state: {
        amountOfVisibleFlyins: 0,
    },

    getters: {
        getFlyinIsVisible: state => {
            return state.amountOfVisibleFlyins > 0
        },
        getVisibleFlyinCount: state => {
            return state.amountOfVisibleFlyins
        },
    },

    actions: {},

    mutations: {
        INCREMENT_VISIBLE_AMOUNT(state) {
            state.amountOfVisibleFlyins++
        },
        DECREMENT_VISIBLE_AMOUNT(state) {
            state.amountOfVisibleFlyins--
        },
    },
}
