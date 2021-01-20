<template>
    <!-- PUBLIC ROUTES -->
    <!-- <div class="public" id="app-component" v-if="!isAuthenticated">
        <LoginPage v-if="$route.path.startsWith('/login')" />
        <div class="main" id="main" ref="main" v-else>
            <div class="public-page">
                <img src="/images/graphs.svg" class="bg-left" />
                <img src="/images/graphs.svg" class="bg-right" />
                <div class="container">
                    <div class="inner">
                        <img class="logo" src="/images/kollekt-logo.svg" />
                        <transition name="fade">
                            <router-view></router-view>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
        <TheSnackbarSpawner />
    </div> -->
    <div class="loading-wrapper" v-if="isAuthenticated && !currentWorkspace">
        <img class="logo" src="/images/kollekt-logo-color-2.svg" alt="Kollekt logo" />
        <BaseLoader />
    </div>

    <div
        class="app"
        id="app-component"
        v-else-if="!error"
        :class="[
            { 'hide-nav': hideNav, 'drag-active': dragActive },
            { 'full-screen': fullScreenContent },
            { public: !isAuthenticated },
        ]"
    >
        <template v-if="!fullScreenContent && isAuthenticated">
            <TheNavbar />
            <TheSidebar />
        </template>
        <div class="main" id="main" ref="main" :class="{ 'hide-crisp': hideCrisp }">
            <template v-if="!isAuthenticated">
                <div
                    class="background-cover"
                    v-if="getLoginBackgroundImage"
                    :style="`background-image: url(${getLoginBackgroundImage}); filter: brightness(0.8);`"
                ></div>
                <div
                    class="background-cover"
                    v-else
                    :style="`background-image: url(/images/pexels-andrew-neel-3178875.jpg); filter: brightness(0.5);`"
                ></div>
                <!-- <template v-else>
                    <img src="/images/graphs.svg" class="bg-left" />
                    <img src="/images/graphs.svg" class="bg-right" />
                </template> -->
            </template>
            <div class="inner">
                <img
                    class="logo"
                    :src="getLoginLogo ? getLoginLogo : '/images/kollekt-logo.svg'"
                    v-if="!isAuthenticated"
                />

                <transition name="fade">
                    <router-view :key="$route.path"></router-view>
                </transition>
            </div>
        </div>
        <TheImageLightbox v-if="getLightboxIsVisible" />
        <TheSnackbarSpawner />
        <TheChangelogModal v-if="getShowChangelog" />
    </div>
    <!-- <div class="loading-wrapper" v-else>
        <img class="logo" src="/images/kollekt-logo-color-2.svg" alt="Kollekt logo" />
        <BaseLoader />
    </div> -->
    <div class="error-wrapper" v-else>
        <img class="logo" src="/images/kollekt-logo-color-2.svg" alt="Kollekt logo" />
        <i class="xl far fa-exclamation-triangle"></i>
        <h3>There was an error connecting Kollekt.</h3>
        <p>Please try refreshing the page, or checking your connection.</p>
        <p>Contact Kollekt Support if the error persists.</p>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import TheSidebar from './components/layout/TheSidebar'
import TheNavbar from './components/layout/TheNavbar'
// import TheNavbarLogo from './components/layout/TheNavbarLogo'
import TheImageLightbox from './components/layout/TheImageLightbox'
import TheSnackbarSpawner from './components/layout/TheSnackbarSpawner'
import LoginPage from './pages/LoginPage/'

export default {
    name: 'app',
    components: {
        TheSidebar,
        TheNavbar,
        LoginPage,
        TheImageLightbox,
        TheSnackbarSpawner,
        TheChangelogModal: () => import('./components/layout/TheChangelogModal/index'),
    },
    data: function() {
        return {
            error: false,
            didScroll: false,
            lastScrollTop: 0,
            scrollRef: 0,
            scrollDir: null,
            hideNav: false,
        }
    },
    computed: {
        ...mapGetters('workspaces', ['workspaces', 'currentWorkspace', 'currentWorkspaceIndex']),
        ...mapGetters('auth', [
            'isAuthenticated',
            'authUser',
            'authStatus',
            'getAuthUserToken',
            'getLoginBackgroundImage',
            'getLoginLogo',
            'getLoginWorkspaceName',
        ]),
        ...mapGetters('selections', ['getSelectionById', 'getCurrentSelectionById']),
        ...mapGetters('lightbox', ['getLightboxIsVisible']),
        ...mapGetters('changelog', ['getShowChangelog']),
        ...mapGetters('videoPlayer', {
            isDragging: 'getTimelineKnobIsBeingDragged',
        }),
        ...mapGetters('presentation', {
            presentations: 'getPresentations',
        }),
        dragActive() {
            return this.isDragging
        },
        fullScreenContent() {
            return [
                'watchVideoPresentation',
                'watchLivestream',
                'mobileVideoPresentation',
                'mobileVideoViewer',
                'results',
                'liveResults',
            ].includes(this.$route.name)
        },
        hideCrisp() {
            return [
                'watchLivestream',
                'createLivestream',
                'watchVideoPresentation',
                'editVideoPresentation',
                'mobileVideoPresentation',
                'liveResults',
            ].includes(this.$route.name)
        },
    },
    watch: {
        // Watch for changes to the authStatus
        authStatus: function(newVal) {
            // When our auth status changes to success
            // -> initialize the workspace
            if (newVal == 'success') {
                this.initWorkspace()
                this.initSignalR()
                this.initCrispChat()
            }
        },
        // Watch for workspace changes
        currentWorkspaceIndex: function(newVal) {
            // If we are in a selection -> send us back to files
            if (this.$route.name == 'selection' || this.$route.name == 'editFile') {
                this.$router.push({ name: 'files' })
            }
        },
        // Watch router changes
        $route(to, from) {
            // Reset main window scroll on navigation
            if (this.$refs.main) {
                this.$refs.main.scrollTo(0, 0)
                this.hideNav = false
            }
        },
    },
    methods: {
        ...mapActions('persist', ['getUids']),
        ...mapActions('auth', ['getAuthUser', 'logout']),
        ...mapActions('workspaces', ['fetchWorkspaces', 'setCurrentWorkspaceIndex', 'fetchWorkspace']),
        ...mapActions('presentation', ['fetchPresentationDetails']),
        ...mapMutations('selections', ['SET_SELECTION_PRESENTATION_MODE_ACTIVE']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        async initWorkspace() {
            // Get workspaces
            const fetchedWorkspaces = await this.fetchWorkspaces()
            if (fetchedWorkspaces.length <= 0) {
                this.SHOW_SNACKBAR({
                    msg: `You dont have access to any workspaces.`,
                    type: 'warning',
                    iconClass: 'fa-exclamation-triangle',
                    duration: 10000, // 10 seconds
                })
                this.logout()
            }
            // Set the current workspace
            // If we don't have a current workspace saved, then set index to 0
            if (!this.currentWorkspaceIndex || this.currentWorkspaceIndex < 0) {
                this.setCurrentWorkspaceIndex(0)
            }
            await this.fetchWorkspace(this.currentWorkspace.id)
        },
        async initSignalR() {
            // Connect to SignalR
            Vue.prototype.$connection = new signalR.HubConnectionBuilder()
                .withAutomaticReconnect()
                .withUrl(
                    `${process.env.MIX_API_BASE_URL.substr(
                        0,
                        process.env.MIX_API_BASE_URL.lastIndexOf('/')
                    )}/live-update`
                )
                .configureLogging(signalR.LogLevel.Information)
                .build()
            const connection = this.$connection
            await connection.start().catch(err => {
                console.log(err)
            })

            // Authenticate our connection
            connection.invoke('Authenticate', this.getAuthUserToken).catch(function(err) {
                return console.error(err.toString())
            })

            connection.on('AuthenticatedSuccess', message => {})

            connection.on('OnSelectionPresentationChanged', (eventName, args) => {
                // console.log('on selection oresentqito', eventName, args)
                args.selection_ids.map(async id => {
                    const selection = this.getSelectionById(id)
                    const presentationGroupId = args.detail.find(x => x.selection_id == id).presentation_group_id
                    if (selection) {
                        if (eventName == 'Begin') {
                            // Fetch the presentation details
                            if (!this.presentations.find(x => x.id == presentationGroupId)) {
                                await this.fetchPresentationDetails(presentationGroupId)
                            }
                            this.SET_SELECTION_PRESENTATION_MODE_ACTIVE({
                                selection,
                                isActive: true,
                                presentationGroupId,
                            })
                        }
                        if (eventName == 'Terminate') {
                            this.SET_SELECTION_PRESENTATION_MODE_ACTIVE({
                                selection,
                                isActive: false,
                                presentationGroupId,
                            })
                        }
                    }
                    const currentSelection = this.getCurrentSelectionById(id)
                    if (currentSelection) {
                        if (eventName == 'Begin') {
                            this.SET_SELECTION_PRESENTATION_MODE_ACTIVE({
                                selection: currentSelection,
                                isActive: true,
                                presentationGroupId,
                            })
                        }
                        if (eventName == 'Terminate') {
                            this.SET_SELECTION_PRESENTATION_MODE_ACTIVE({
                                selection: currentSelection,
                                isActive: false,
                                presentationGroupId,
                            })
                        }
                    }
                })
            })
        },
        initCrispChat() {
            $crisp.push(['set', 'user:email', this.authUser.email])
            $crisp.push(['set', 'user:nickname', this.authUser.name])
        },
        scrollHandler(e) {
            // this.didScroll = false
            let scrollDiff = 0
            const threshold = 100
            const el = e.target
            const scrollDist = el.scrollTop
            // Check if we are scrolling up or down

            // Scrolling down
            if (this.lastScrollTop < scrollDist) {
                // Save a reference to the current scroll position
                if (this.scrollDir != 'down') {
                    this.scrollDir = 'down'
                    this.scrollRef = scrollDist
                }
                // console.log('scroll down')
                // Check if we have scrolled further than the threshold
                if (scrollDist > this.scrollRef + threshold && !this.hideNav) {
                    this.hideNav = true
                }
            }
            // Scrolling up
            else {
                // Save a reference to the current scroll position
                if (this.scrollDir != 'up') {
                    this.scrollDir = 'up'
                    this.scrollRef = scrollDist
                }
                if (scrollDist < this.scrollRef - threshold && this.hideNav) {
                    this.hideNav = false
                }
            }
            // Save this as the new lastScrollTop
            this.lastScrollTop = scrollDist
        },
    },
    async created() {
        // Set up a request intercepter that checks if the user is still authenticated
        axios.interceptors.response.use(
            response => response,
            error => {
                if (this.$route.name != 'login') {
                    if (!!error.response && error.response.status === 401) {
                        // if you ever get an unauthorized, logout the user
                        this.logout()
                    }
                }
                // if (!!error.response && error.response.status === 404) {
                //     this.SHOW_SNACKBAR({
                //         msg: `You dont have access to any workspaces.`,
                //         type: 'warning',
                //         iconClass: 'fa-exclamation-triangle',
                //         duration: 10000, // 10 seconds
                //     })
                // }
                return Promise.reject(error.response)
            }
        )

        // Check if the user is authenticated.
        // If that is the case get the auth user
        if (this.isAuthenticated) {
            await this.getAuthUser().catch(err => {
                this.error = err
            })
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.loading-wrapper,
.error-wrapper {
    min-height: 100vh;
    width: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
    background: $bg;
    flex-direction: column;
    .logo {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        top: 60px;
        width: 120px;
    }
}
html,
body,
#app {
    color: $dark;
}
.app {
    scroll-behavior: smooth;
    min-height: 100vh;
    min-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
    transition: 0.3s;
    &:not(.full-screen) {
        display: grid;
        grid-template-columns: 80px auto;
        grid-template-rows: 60px auto;
        grid-template-areas:
            'sidebar navbar'
            'sidebar main';
        @media only screen and (-webkit-min-device-pixel-ratio: 1.3),
            only screen and (-o-min-device-pixel-ratio: 13/10),
            only screen and (min-resolution: 120dpi) {
            .app {
                grid-template-columns: 200px auto;
            }
        }
        @media screen and (max-width: $screenSm) {
            grid-template-columns: 52px auto;
            grid-template-rows: 52px auto;
        }
    }
    &.drag-active {
        cursor: grabbing;
    }
    &.full-screen {
        .main {
            max-height: 100vh;
            height: 100vh;
            // overflow: auto;
            overflow: hidden;
            .inner {
                height: 100%;
            }
        }
    }

    &.public {
        display: block;
        background: $dark05;
        min-height: 100vh;
        position: relative;
        scroll-behavior: smooth;
        min-width: 100vw;
        max-height: 100vh;
        overflow: hidden;
        transition: 0.3s;
        .main {
            // box-shadow: 0 3px 6px rgba(0,0,0,.05) inset, 5px 0 6px rgba(0,0,0,.02) inset;
            overflow-y: auto;
            overflow-x: hidden;
            background: $dark;
            position: relative;
            min-height: 100vh;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .inner {
                height: auto;
                max-width: 800px;
                background: white;
                z-index: 1;
                padding: 32px 60px 60px;
                text-align: center;
                box-shadow: $shadowModule;
                border-radius: $borderRadiusModule;
                border: $borderModule;
            }
        }
        .bg-left,
        .bg-right {
            position: fixed;
            bottom: 0;
            width: 50%;
            &.bg-left {
                left: 0;
            }
            &.bg-right {
                right: 0;
            }
        }
    }
}
.main {
    // box-shadow: 0 3px 6px rgba(0,0,0,.05) inset, 5px 0 6px rgba(0,0,0,.02) inset;
    overflow-y: scroll;
    overflow-x: auto;
    background: $bg;
    position: relative;
    max-height: calc(100vh - #{$navbarHeight});
    &.hide-crisp {
        z-index: 2;
    }
}
h1 {
    margin-bottom: 30px;
}
.grid-2,
.grid-3,
.grid-4 {
    display: grid;
    grid-gap: 17px;
    &.small-gap {
        grid-gap: 12px;
    }
}
.grid-2 {
    grid-template-columns: repeat(2, 1fr);
}
.card {
    padding: 1em;
    border-radius: 6px;
    margin: 30px 0;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    background: white;
}
.loading {
    animation: loading 2s;
    animation-iteration-count: infinite;
}
@keyframes loading {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
.clickable {
    cursor: pointer;
}

// Disabled body
body {
    &::after {
        content: '';
        display: none;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba($dark, 0.7);
        z-index: 110;
    }
    &.disabled {
        &::after {
            display: block;
        }
    }
}
.background-cover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
}
.logo {
    max-height: 40px;
    max-width: 200px;
    object-fit: contain;
}
@include mobile {
    html {
        // min-height: 100vh;
        // max-height: 100vh;
        height: -webkit-fill-available;
        body {
            height: 100vh;
            min-height: 100vh;
            max-height: 100vh;
            min-height: -webkit-fill-available;
            height: -webkit-fill-available;
            max-height: -webkit-fill-available;
            overflow: hidden;
            #app,
            .main {
                height: 100%;
                min-height: 100%;
                max-height: 100%;
            }
        }
    }
    .app,
    .app.public,
    .app.full-screen .main {
        // min-height: calc(100vh - 60px);
        // height: calc(100vh - 60px);
        /* mobile viewport bug fix */
        // height: 100vh;
        // min-height: 100vh;
        // max-height: 100vh;
        // min-height: -webkit-fill-available;
        // height: -webkit-fill-available;
        // max-height: -webkit-fill-available;
        // overflow: hidden;
        &.public {
            .main {
                .inner {
                    width: calc(100% - 16px);
                    padding: 32px 32px 60px;
                }
            }
        }
    }
}
</style>
