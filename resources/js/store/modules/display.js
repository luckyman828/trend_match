export default {
    namespaced: true,

    state: {
        visibleComponents: {},
    },

    getters: {
        getVisibleComponents: state => state.visibleComponents,
        getComponentIsVisible: state => componentName => state.visibleComponents[componentName],
    },

    actions: {},

    mutations: {
        SHOW_COMPONENT(state, componentName) {
            Vue.set(state.visibleComponents, componentName, true)
        },
        HIDE_COMPONENT(state, component) {
            state.visibleComponents[component] = false
        },
    },
}
