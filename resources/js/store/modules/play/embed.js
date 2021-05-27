export default {
    namespaced: true,
    state: {},
    getters: {},
    actions: {
        postMessage({}, msg) {
            const targetWindow = window.parent
            if (!targetWindow || targetWindow == window) return 
            const targetOrigin = `https://kollektteststore.myshopify.com`
            targetWindow.postMessage(msg, targetOrigin)
        },
    },
    mutations: {},
}
