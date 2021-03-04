export default {
    namespaced: true,
    state: {
        currentProductSpace: localStorage.getItem('kollektSpace') || null,
    },
    getters: {
        getCurrentProductSpace: state => state.currentProductSpace,
    },
    actions: {},
    mutations: {
        SET_KOLLEKT_SPACE(state, productSpace) {
            state.currentProductSpace = productSpace
            localStorage.setItem('kollektSpace', productSpace)
        },
    },
}
