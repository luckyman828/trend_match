import UUID from 'vue-uuid'

export default {
    namespaced: true,

    state: {
        snackbarID: 0,
        snackbars: [],
        showDialogue: false,
    },

    getters: {
        getSnackbars: state => state.snackbars,
        getAlert: state => state.alert,
        getDialogueIsVisible: state => state.showDialogue,
    },

    actions: {
        testAlert({ state }, msg) {
            alert(msg)
        },
    },

    mutations: {
        SHOW_ALERT(state, {}) {},
        SHOW_SNACKBAR(state, { msg, type, iconClass, callback, callbackLabel }) {
            // TYPE = success | danger | warning | info
            state.snackbars.push({
                id: state.snackbarID,
                msg,
                type,
                iconClass,
                callback,
                callbackLabel,
            })
            state.snackbarID++
        },
        DELETE_SNACKBAR(state, snackbar) {
            const index = state.snackbars.findIndex(x => x.id == snackbar.id)
            state.snackbars.splice(index, 1)
        },
    },
}
