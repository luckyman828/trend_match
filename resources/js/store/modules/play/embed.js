export default {
    namespaced: true,
    state: {},
    getters: {},
    actions: {
        postMessage({ rootGetters }, msg) {
            const targetWindow = window.parent
            if (!targetWindow || targetWindow == window) return
            const webshop = rootGetters['workspaces/getWebshop']
            if (!webshop) {
                console.log('no webshop linked!')
                return
            }
            const targetOrigin = webshop.url
            targetWindow.postMessage(msg, targetOrigin)
        },
    },
    mutations: {},
}
