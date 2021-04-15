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
    if (toRoot.name == 'login' && isAuthenticated) {
        return triggerAppRedirection()
    }
    // END GUARD AUTH

    // GUARD SPACES
    if (
        authenticatedInitDone &&
        toRoot.meta &&
        toRoot.meta.space &&
        !store.getters['workspaces/getEnabledApps'].find(space => space.name == toRoot.meta.space)
    ) {
        // Tell the user they are getting redirected
        store.commit('alerts/SHOW_SNACKBAR', {
            type: 'info',
            icon: 'far fa-info-circle',
            msg: "Redirected: You don' have access to this route.",
        })
        return triggerAppRedirection()
    }
    // END GUARD SPACES
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
