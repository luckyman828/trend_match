export default {
    namespaced: true,

    state: {
        scannerMode: null,
    },

    getters: {
        getScannerModeActive: state => !!state.scannerMode,
        getScannerMode: state => state.scannerMode,
    },

    actions: {},

    mutations: {
        SET_SCANNER_MODE(state, mode) {
            state.scannerMode = mode
        },
    },
}
