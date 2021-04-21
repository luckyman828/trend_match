import router from '../router'
import store from '../store'

const awaitAuthInit = async () => {
    const isAuthenticated = store.getters['auth/isAuthenticated']
    const authenticatedInitDone = store.getters['persist/getAuthenticatedInitDone']
    if (isAuthenticated && !authenticatedInitDone) {
        await new Promise(resolve => {
            const unwatch = store.watch(
                () => store.getters['persist/getAuthenticatedInitDone'],
                isDone => {
                    if (isDone) {
                        resolve()
                        unwatch()
                    }
                }
            )
        })
    }
}

const fetchRouteWorkspace = async ({ fileId, selectionId }) => {
    let workspaceId
    if (selectionId && !fileId) {
        const selection = await store.dispatch(
            'selections/fetchSelection',
            { selectionId, addToState: false },
            { root: true }
        )
        // fileId = selection.file_id
    }
    if (fileId) {
        const file = await store.dispatch('files/fetchFile', fileId, { root: true })
        workspaceId = file.workspace_id
    }
    return workspaceId
}

export async function triggerRouteGuards(to) {
    const toRoot = to.matched[0]
    const isAuthenticated = store.getters['auth/isAuthenticated']
    const authenticatedInitDone = store.getters['persist/getAuthenticatedInitDone']

    // If the user is authenticated wait with applying guards until we have fetched the necessary data
    await awaitAuthInit()
    // GUARD REQUIRES AUTH
    if (toRoot.name != 'login' && !isAuthenticated) {
        if (to.fullPath != '/') {
            store.commit('routes/SET_NEXT_URL', to.fullPath)
        }
        return { name: 'login' }
    }
    if (toRoot.name == 'login' && isAuthenticated && !to.name == 'join') {
        return triggerAppRedirection()
    }
    // END GUARD AUTH

    // GUARD WORKSPACE
    if (to.params.fileId || to.params.selectionId) {
        const workspaceId = await fetchRouteWorkspace({ fileId: to.params.fileId, selectionId: to.params.selectionId })

        // Test that the user has access to that workspace
        const workspaces = store.getters['workspaces/getWorkspaces']
        if (!workspaces.find(workspace => workspace.id == workspaceId)) {
            store.commit('workspaces/SET_CURRENT_WORKSPACE_ID', workspaceId)
            // Show info message
            store.commit('alerts/SHOW_SNACKBAR', {
                type: 'info',
                icon: 'far fa-info-circle',
                msg: "Redirected: You don' have access to this workspace.",
            })
            return triggerAppRedirection()
        }
        store.commit('workspaces/SET_CURRENT_WORKSPACE_ID', workspaceId)
    }

    // GUARD APPS
    if (
        authenticatedInitDone &&
        toRoot.meta &&
        toRoot.meta.app &&
        !store.getters['workspaces/getEnabledApps'].find(app => app.name == toRoot.meta.app)
    ) {
        // Tell the user they are getting redirected
        store.commit('alerts/SHOW_SNACKBAR', {
            type: 'info',
            icon: 'far fa-info-circle',
            msg: "Redirected: You don' have access to this route.",
        })
        return triggerAppRedirection()
    }
    // END GUARD APPS
}

export async function triggerAppRedirection() {
    await awaitAuthInit()
    // Redirect to a space the user has access to
    const availableApps = store.getters['workspaces/getEnabledApps']
    if (availableApps.length == 1) {
        const newApp = availableApps[0]
        store.commit('kollektApps/SET_KOLLEKT_APP', newApp.name)
        return { name: newApp.name }
    } else {
        await router.push('/')
        store.commit('kollektApps/SET_KOLLEKT_APP', null)
        return false
    }
}
