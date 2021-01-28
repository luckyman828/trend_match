export default {
    namespaced: true,

    state: {
        distributionScope: 'Feedback',
    },
    getters: {
        getDistributionScope: state => state.distributionScope,
        getActiveSelectionInput: (state, getters, rootState, rootGetters) => product => {
            const activeSelection = rootGetters['selections/getCurrentSelections'][0]
            return product.selectionInputList.find(selectionInput => selectionInput.selection_id == activeSelection.id)
        },
    },
    mutations: {
        SET_DISTRIBUTION_SCOPE(state, newScope) {
            state.distributionScope = newScope
        },
    },
}
