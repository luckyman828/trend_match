import store from '../store'

export default (to, from, next) => {
    const toRoot = to.matched[0]
    const isAuthenticated = store.getters['auth/isAuthenticated']
    // GUARD REQUIRES AUTH
    if (toRoot.name != 'login' && !isAuthenticated) {
        store.commit('routes/SET_NEXT_URL', to.fullPath)
        console.log('this is the case', toRoot, to)
        next({ name: 'login' })
        return
    }
    if (toRoot.name == 'login' && isAuthenticated) {
        console.log('that is the sace')
        onRedirectSpace(next)
        return
    }
    // END GUARD AUTH

    // GUARD SPACES
    if (
        toRoot.meta &&
        toRoot.meta.space &&
        !store.getters['workspaces/getEnabledSpaces'].find(space => space.name == toRoot.meta.space)
    ) {
        console.log('space issue')
        onRedirectSpace(next)
        return
    }
    // END GUARD SPACES

    next()
}

const onRedirectSpace = next => {
    // Tell the user they are getting redirected
    store.commit('alerts/SHOW_SNACKBAR', {
        type: 'info',
        icon: 'far fa-info-circle',
        msg: "Redirected: You don' have access to this route.",
    })
    // Redirect to a space the user has access to
    const availableSpaces = store.getters['workspaces/getEnabledSpaces']
    if (availableSpaces.length > 0) next({ name: availableSpaces[0].name })
    else next('/')
}
