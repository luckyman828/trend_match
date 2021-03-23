export default {
    namespaced: true,

    state: {
        isConnected: false,
    },

    getters: {
        getIsConnected: state => state.isConnected,
    },

    actions: {},

    mutations: {
        SET_IS_CONNECTED(state, isConnected) {
            state.isConnected = isConnected
        },
    },
}
