import UUID from 'vue-uuid'

export default {
    namespaced: true,

    state: {
        snackbarID: 0,
        snackbars: [],
    },

    getters: {
        getSnackbars: state => state.snackbars,
    },

    actions: {
        showAlert({ commit }, msg) {
            alert(msg)
        },
        showSnackbar({ commit }, { msg, callback }) {
            commit('SHOW_SNACKBAR', { msg, callback })
        },
    },

    mutations: {
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
