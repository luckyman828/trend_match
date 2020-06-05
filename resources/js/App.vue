<template>
    <div class="login-screen" v-if="$route.name == 'login'">
        <transition name="fade">
            <router-view></router-view>
        </transition>
    </div>
    <div class="app" id="app-component" v-else-if="authUser && currentWorkspace" :class="{'hide-nav': hideNav}">
        <TheNavbar/>
        <TheSidebar/>
        <div class="main" id="main" ref="main">
        <!-- <div class="main" id="main" ref="main" @scroll.passive="scrollHandler"> -->
            <div class="container">
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
        <TheImageLightbox v-if="getLightboxIsVisible"/>
        <TheSnackbarSpawner/>
    </div>
    <div class="error-wrapper" v-else-if="error">
        <img class="logo" src="/images/kollekt-logo-color-2.svg" alt="Kollekt logo">
        <i class="xl far fa-exclamation-triangle"></i>
        <h3>There was an error connecting Kollekt.</h3>
        <p>Please try refreshing the page, or checking your connection.</p>
        <p>Contact Kollekt Support if the error persists.</p>
    </div>
    <div class="loading-wrapper" v-else>
        <img class="logo" src="/images/kollekt-logo-color-2.svg" alt="Kollekt logo">
        <BaseLoader/>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import TheSidebar from './components/layout/TheSidebar'
import TheNavbar from './components/layout/TheNavbar'
// import TheNavbarLogo from './components/layout/TheNavbarLogo'
import TheImageLightbox from './components/layout/TheImageLightbox'
import TheSnackbarSpawner from './components/layout/TheSnackbarSpawner'

export default{
    name: 'app',
    components: {
        TheSidebar,
        TheNavbar,
        // TheNavbarLogo,
        TheImageLightbox,
        TheSnackbarSpawner,
    },
    data: function() { return {
        error: false,
        didScroll: false,
        lastScrollTop: 0,
        scrollRef: 0,
        scrollDir: null,
        hideNav: false,
    }},
    computed: {
        ...mapGetters('workspaces', ['workspaces', 'currentWorkspace', 'currentWorkspaceIndex']),
        ...mapGetters('auth', ['isAuthenticated', 'authUser', 'authStatus', 'getAuthUserToken']),
        ...mapGetters('selections', ['getSelectionById', 'getCurrentSelectionById']),
        ...mapGetters('lightbox', ['getLightboxIsVisible']),
    },
    watch : {
        // Watch for changes to the authStatus
        authStatus: function(newVal) {
            // When our auth status changes to success 
            // -> initialize the workspace
            if (newVal == 'success') {
                this.initWorkspace()
                this.initSignalR()
            }
        },
        // Watch for workspace changes
        currentWorkspaceIndex: function(newVal) {
            // If we are in a selection -> send us back to files
            if (this.$route.name == 'selection' || this.$route.name == 'editFile') {
                this.$router.push({name: 'files'})
            }
        },
        // Watch router changes
        $route(to, from) {
            // Reset main window scroll on navigation
            if (this.$refs.main) {
                this.$refs.main.scrollTo(0,0)
                this.hideNav = false
            }
        }
    },
    methods: {
        ...mapActions('persist', ['getUids']),
        ...mapActions('auth', ['getAuthUser', 'logout']),
        ...mapActions('workspaces', ['fetchWorkspaces', 'setCurrentWorkspaceIndex']),
        ...mapMutations('selections', ['SET_SELECTION_PRESENTATION_MODE_ACTIVE']),
        initWorkspace() {
            // Get workspaces
            this.fetchWorkspaces().then(() => {
                // Set the current workspace
                // If we don't have a current workspace saved, then set index to 0
                if (this.currentWorkspaceIndex == null) {
                    this.setCurrentWorkspaceIndex(0)
                }
            })
        },
        async initSignalR() {
            console.log('init SignalR')
            // Connect to SignalR
            Vue.prototype.$connection = new signalR.HubConnectionBuilder()
            .withAutomaticReconnect()
            .withUrl(`${process.env.MIX_API_BASE_URL.substr(0,process.env.MIX_API_BASE_URL.length-3)}/live-update`)
            .configureLogging(signalR.LogLevel.Information)
            .build()
            const connection = this.$connection
            await connection.start().catch(err => {
                console.log(err)
            })

            // Authenticate our connection
            connection.invoke("Authenticate", this.getAuthUserToken).catch(function (err) {
                return console.error(err.toString())
            })

            connection.on('AuthenticatedSuccess', message => {})

            connection.on('OnSelectionPresentationChanged', (eventName, selectionIds) => {
                selectionIds.selection_ids.map(id => {
                    const selection = this.getSelectionById(id)
                    if (selection) {
                        if (eventName == 'Begin') {
                            this.SET_SELECTION_PRESENTATION_MODE_ACTIVE({selection, isActive: true})
                        }
                        if (eventName == 'Terminate') {
                            this.SET_SELECTION_PRESENTATION_MODE_ACTIVE({selection, isActive: false})
                        }
                    }
                    const currentSelection = this.getCurrentSelectionById(id)
                    if (currentSelection) {
                        if (eventName == 'Begin') {
                            this.SET_SELECTION_PRESENTATION_MODE_ACTIVE({selection: currentSelection, isActive: true})
                        }
                        if (eventName == 'Terminate') {
                            this.SET_SELECTION_PRESENTATION_MODE_ACTIVE({selection: currentSelection, isActive: false})
                        }
                    }
                })
            })
        },
        // onScroll(e) {
        //     this.didScroll = true
        //     // on scroll, let the interval function know the user has scrolled
        //     $(window).scroll(function(event){
        //     didScroll = true;
        //     });
        //     // run hasScrolled() and reset didScroll status
        //     setInterval(function() {
        //         if (didScroll) {
        //             this.scrollHandler();
        //             didScroll = false;
        //         }
        //     }, 250);
        // }
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

        }
    },
    async created() {
        // Set up a request intercepter that checks if the user is still authenticated
        axios.interceptors.response.use(response => response, (error) => {
            if (this.$route.name != 'login') {
                if (!!error.response && error.response.status === 401) {
                    // if you ever get an unauthorized, logout the user
                    this.logout()
                }
            }
            return Promise.reject(error.response);
        });

        // Check if the user is authenticated. 
        // If that is the case get the auth user
        if (this.isAuthenticated) {
            await this.getAuthUser().catch(err => {
                this.error = err
            })
            
            // Get some snowflake IDs now we're at it
            // this.getUids()
        }
        // this.$router.afterEach((to, from, next) => {
        //     console.log('router')
        // })
    },
}
</script>

<style lang="scss" scoped>
    @import '~@/_variables.scss';
    .loading-wrapper, .error-wrapper {
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
    html, body, #app {
        color: $dark;
        // font-family: 'Source Sans Pro', sans-serif;
        // background: white;
    }
    .app {
        // max-height: calc(100vh - 70px);
        // overflow: scroll;
        scroll-behavior: smooth;
        display: grid;
        min-height: 100vh;
        min-width: 100vw;
        transition: .3s;
        // grid-template-columns: 160px auto;
        grid-template-columns: 80px auto;
        // grid-template-rows: 72px auto;
        grid-template-rows: 52px auto;
        grid-template-areas: 
            "sidebar navbar" 
            "sidebar main";
        @media	only screen and (-webkit-min-device-pixel-ratio: 1.3),
        only screen and (-o-min-device-pixel-ratio: 13/10),
        only screen and (min-resolution: 120dpi) {
            .app {
                grid-template-columns: 200px auto;
            }
        }
        // @media screen and (max-width: $screenMd) {
        //     grid-template-columns: 80px auto;
        // }
        @media screen and (max-width: $screenSm) {
            grid-template-columns: 52px auto;
            grid-template-rows: 52px auto;
        }
        &.hide-nav {
            // grid-template-rows: 0 auto;
            // margin-top: -72px;
        }
    }
    .main {
        // box-shadow: 0 3px 6px rgba(0,0,0,.05) inset, 5px 0 6px rgba(0,0,0,.02) inset;
        padding: 20px 60px;
        overflow-y: scroll;
        overflow-x: auto;
        background: $bg;
        @media screen and (max-width: $screenSm) {
            padding: 20px;
        }
    }
    h1 {
        margin-bottom: 30px;
    }
    .grid-2, .grid-3, .grid-4 {
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
        box-shadow: 0 2px 6px rgba(0,0,0,.1);
        background: white;
    }
    .loading {
        animation: loading 2s;
        animation-iteration-count: infinite;
    }
    @keyframes loading {
        0% {opacity: 0;}
        50% {opacity: 1;}
        100% {opacity: 0;}
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
            background: rgba($dark, .7);
            z-index: 110;
        }
        &.disabled {
            &::after {
                display: block;
            }
        }
    }
</style>
