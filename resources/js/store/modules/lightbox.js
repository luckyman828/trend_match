export default {
    namespaced: true,

    state: {
        visible: false,
        images: [],
        index: 0,
    },

    getters: {
        getLightboxIsVisible: state => state.visible,
        getLightboxImages: state => state.images,
        getLightboxImageIndex: state => state.index,
    },

    actions: {},

    mutations: {
        SET_LIGHTBOX_VISIBLE(state, bool) {
            state.visible = bool
        },
        SET_LIGHTBOX_IMAGES(state, images) {
            state.images = images
        },
        SET_LIGHTBOX_IMAGE_INDEX(state, index) {
            state.index = index
        },
    },
}
