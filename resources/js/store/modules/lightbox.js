export default {
    namespaced: true,

    state: {
        visible: false,
    },

    getters: {
        getLightboxIsVisible: state => state.visible,
    },

    actions: {},

    mutations: {
        SET_LIGHTBOX_VISIBLE(state, bool) {
            state.visible = bool
        },
    },
}
