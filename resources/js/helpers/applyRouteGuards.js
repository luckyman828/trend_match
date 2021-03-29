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

export default async function applyRouteGuards(to, from, next) {
    const toRoot = to.matched[0]
    const isAuthenticated = store.getters['auth/isAuthenticated']
    const authenticatedInitDone = store.getters['persist/getAuthenticatedInitDone']
    console.log('apply route guards', isAuthenticated, authenticatedInitDone)

    // If the user is authenticated wait with applying guards until we have fetched the necessary data
    await awaitAuthInit()
    // GUARD REQUIRES AUTH
    if (toRoot.name != 'login' && !isAuthenticated) {
        store.commit('routes/SET_NEXT_URL', to.fullPath)
        console.log('this is the case', toRoot, to)
        next({ name: 'login' })
        return
    }
    if (toRoot.name == 'login' && isAuthenticated) {
        redirectSpace()
        return
    }
    // END GUARD AUTH

    // GUARD SPACES
    if (
        authenticatedInitDone &&
        toRoot.meta &&
        toRoot.meta.space &&
        !store.getters['workspaces/getEnabledSpaces'].find(space => space.name == toRoot.meta.space)
    ) {
        console.log('guard routes', toRoot, to)
        // Tell the user they are getting redirected
        store.commit('alerts/SHOW_SNACKBAR', {
            type: 'info',
            icon: 'far fa-info-circle',
            msg: "Redirected: You don' have access to this route.",
        })
        redirectSpace()
        return
    }
    // END GUARD SPACES

    next()
}

export async function redirectSpace() {
    await awaitAuthInit()
    console.log('redirect space')
    // Redirect to a space the user has access to
    const availableSpaces = store.getters['workspaces/getEnabledSpaces']
    if (availableSpaces.length > 0) {
        console.log('redirect space')
        const newSpace = availableSpaces[0]
        store.commit('kollektSpaces/SET_KOLLEKT_SPACE', newSpace.name)
        router.push({ name: newSpace.name })
    } else router.push('/')
}
