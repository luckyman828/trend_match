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
        SHOW_SNACKBAR(state, { msg, type, iconClass, callback, callbackLabel, duration, timeoutCallback }) {
            // TYPE = success | danger | warning | info

            // If we already have a snackbar with the same message add our count to the count of that snackbar
            const duplicateSnackbarIndex = state.snackbars.findIndex(x => x.msg == msg)
            if (duplicateSnackbarIndex >= 0 && !['warning'].includes(type) && !timeoutCallback) {
                state.snackbars[duplicateSnackbarIndex].count++
                return
            }

            state.snackbars.push({
                id: state.snackbarID,
                msg,
                count: 1,
                type,
                iconClass,
                callback,
                callbackLabel,
                duration,
                timeoutCallback,
            })
            state.snackbarID++
        },
        DELETE_SNACKBAR(state, snackbar) {
            const index = state.snackbars.findIndex(x => x.id == snackbar.id)
            state.snackbars.splice(index, 1)
        },
    },
}
