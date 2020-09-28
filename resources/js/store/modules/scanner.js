export default {
    namespaced: true,

    state: {
        scannerMode: null,
        variantMode: null,
    },

    getters: {
        getScannerModeActive: state => !!state.scannerMode,
        getScannerMode: state => state.scannerMode,
        getScannerVariantMode: state => state.variantMode,
    },

    actions: {},

    mutations: {
        SET_SCANNER_MODE(state, mode) {
            state.scannerMode = mode
        },
        SET_SCANNER_VARIANT_MODE(state, boolean) {
            state.variantMode = boolean
        },
    },
}
