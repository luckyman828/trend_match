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
    let theFileId = fileId
    if (selectionId && !fileId) {
        const selection = await store.dispatch(
            'selections/fetchSelection',
            { selectionId, addToState: false },
            { root: true }
        )
        theFileId = selection.file_id
    }
    if (theFileId) {
        const file = await store.dispatch('files/fetchFile', theFileId, { root: true })
        workspaceId = file.workspace_id
    }
    // console.log('fetch route workspaceId', selectionId, theFileId, workspaceId)
    return workspaceId
}

export async function triggerRouteGuards(to) {
    const toRoot = to.matched[0]
    const isAuthenticated = store.getters['auth/isAuthenticated']
    const authenticatedInitDone = store.getters['persist/getAuthenticatedInitDone']

    // console.log('trigger route guards', to, isAuthenticated, store.getters['workspaces/getCurrentWorkspaceId'])
    if (to && to.meta.isPublic) {
        return
    }

    // If the user is authenticated wait with applying guards until we have fetched the necessary data
    await awaitAuthInit()
    // GUARD REQUIRES AUTH
    if ((!toRoot || toRoot.name != 'login') && !isAuthenticated) {
        if (to.fullPath != '/') {
            store.commit('routes/SET_NEXT_URL', to.fullPath)
        }
        return { name: 'login' }
    }
    if (toRoot && toRoot.name == 'login' && isAuthenticated && !to.name == 'join') {
        return triggerAppRedirection()
    }
    // END GUARD AUTH

    // GUARD WORKSPACE
    if (to.params.fileId || to.params.selectionId) {
        const workspaceId = await fetchRouteWorkspace({ fileId: to.params.fileId, selectionId: to.params.selectionId })

        // console.log('guard workspace', workspaceId, store.getters['workspaces/getCurrentWorkspaceId'])

        // Test that the user has access to that workspace
        const workspaces = store.getters['workspaces/getWorkspaces']
        if (!workspaces.find(workspace => workspace.id == workspaceId)) {
            // console.log('guard workspace', workspaceId, workspaces)
            await store.dispatch('workspaces/setCurrentWorkspace', workspaceId)
            // Show info message
            store.commit('alerts/SHOW_SNACKBAR', {
                type: 'info',
                icon: 'far fa-info-circle',
                msg: "Redirected: You don' have access to this workspace.",
            })
            return triggerAppRedirection()
        }
        // Test if we are changing workspace
        if (workspaceId != store.getters['workspaces/getCurrentWorkspaceId']) {
            // console.log('change workspace')
            await store.dispatch('workspaces/setCurrentWorkspace', workspaceId)
        }

        // store.commit('workspaces/SET_CURRENT_WORKSPACE_ID', workspaceId)
    }

    // GUARD APPS
    if (
        authenticatedInitDone &&
        toRoot &&
        toRoot.meta &&
        toRoot.meta.app &&
        !store.getters['workspaces/getEnabledApps'].find(app => app.name == toRoot.meta.app)
    ) {
        // console.log('guard apps', store.getters['workspaces/getEnabledApps'])
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
    // console.log('trigger app redirect')

    await awaitAuthInit()
    // Redirect to a space the user has access to
    const availableApps = store.getters['workspaces/getEnabledApps']
    if (availableApps.length == 1) {
        const newApp = availableApps[0]
        store.commit('kollektApps/SET_KOLLEKT_APP', newApp.name)
        return { name: newApp.name }
    } else {
        await router.push({ name: 'selectApp' })
        store.commit('kollektApps/SET_KOLLEKT_APP', null)
        return false
    }
}
