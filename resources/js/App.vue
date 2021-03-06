<template>
    <!-- NEW -->
    <div
        class="app"
        id="app-component"
        :class="[
            { 'drag-active': dragActive },
            { 'full-screen': $route.meta.isFullscreen },
            { 'hide-crisp': $route.meta.hideCrisp },
            { public: !isAuthenticated },
        ]"
    >
        <!-- <LoginRoot v-if="!isAuthenticated" /> -->

        <!-- <transition name="fade" v-if="!isAuthenticated">
            <router-view></router-view>
        </transition>
        <router-view v-else-if="!!isAuthenticated && !loadingWorkspace" :key="$route.path"></router-view> -->

        <router-view
            v-if="
                (!noWorkspaceAvailable && (!isAuthenticated || (!!isAuthenticated && !!authenticatedInitDone))) ||
                    ($route.meta && $route.meta.isPublic)
            "
        ></router-view>

        <div class="error-wrapper" v-else-if="noWorkspaceAvailable">
            <img class="logo" src="/images/kollekt-logo-color-2.svg" alt="Kollekt logo" />
            <i class="xl far fa-exclamation-triangle"></i>
            <h3>No workspaces available</h3>
            <p>You have not been added to any workspaces.</p>
            <p>Contact your Kollekt responsible to gain access.</p>
        </div>

        <div class="error-wrapper" v-else-if="error">
            <img class="logo" src="/images/kollekt-logo-color-2.svg" alt="Kollekt logo" />
            <i class="xl far fa-exclamation-triangle"></i>
            <h3>There was an error connecting to Kollekt.</h3>
            <p>Please try refreshing the page, or checking your connection.</p>
            <p>Contact Kollekt Support if the error persists.</p>
        </div>

        <BaseLoader class="app-loader loading-wrapper" msg="Getting Kollekt ready" v-else />
    </div>
    <!-- END NEW -->
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SELECTRoot from './pages/SELECT/'
import PLAYB2CRoot from './pages/PLAYB2C/'
import LoginRoot from './pages/Login/'
import RootLoader from './components/common/RootLoader'
import { triggerRouteGuards } from './helpers/routeGuards'

export default {
    name: 'app',
    components: {
        SELECTRoot,
        PLAYB2CRoot,
        LoginRoot,
        RootLoader,
    },
    data: function() {
        return {
            error: false,
            loadingWorkspace: true,
            loadingIsAuthInit: true,
            noWorkspaceAvailable: false,
        }
    },
    computed: {
        ...mapGetters('workspaces', ['workspaces', 'currentWorkspace', 'getCurrentWorkspaceId']),
        ...mapGetters('workspaces', {
            currentWorkspaceId: 'getCurrentWorkspaceId',
            currentWorkspace: 'getCurrentWorkspace',
        }),
        ...mapGetters('auth', ['isAuthenticated', 'authUser', 'authStatus', 'getAuthUserToken']),
        ...mapGetters('selections', ['getSelectionById', 'getCurrentSelectionById']),
        ...mapGetters('videoPlayer', {
            isDragging: 'getTimelineKnobIsBeingDragged',
        }),
        ...mapGetters('presentation', {
            presentations: 'getPresentations',
        }),
        ...mapGetters('liveUpdates', {
            liveUpdateIsConnected: 'getIsConnected',
        }),
        ...mapGetters('persist', {
            authenticatedInitDone: 'getAuthenticatedInitDone',
        }),
        dragActive() {
            return this.isDragging
        },
    },
    watch: {
        // Watch for changes to the authStatus
        authStatus: async function(newVal) {
            // When our auth status changes to success
            // -> initialize the workspace
            if (newVal == 'success') {
                this.initSignalR()
                this.getActiveJobs()
                await this.initWorkspace()
                this.initCanny()
                this.SET_AUTHENTICATED_INIT_DONE(true)
                this.initCrispChat()
            }
        },
        // Watch for workspace changes
        currentWorkspaceId: async function(newVal, oldVal) {
            // if (oldVal != null && newVal != oldVal) {
            //     this.SET_CURRENT_FILE(null)
            //     this.SET_CURRENT_FOLDER(null)
            //     this.SET_CURRENT_SELECTION_ID(null)
            //     this.SET_CURRENT_SELECTIONS([])
            //     // Fetch data for the new workspace
            //     await this.fetchWorkspace(newVal)
            //     // Trigger route auth
            //     // const newRoute = await triggerRouteGuards(this.$route)
            //     // if (newRoute) {
            //     //     this.$router.push(newRoute)
            //     // }
            // }
            // // If we are in a selection -> send us back to files
            // if (oldVal != null && (this.$route.name == 'selection' || this.$route.name == 'editFile')) {
            //     this.$router.push({ name: 'files' })
            // }
        },
    },
    methods: {
        ...mapActions('persist', ['getUids']),
        ...mapActions('auth', ['getAuthUser', 'logout']),
        ...mapActions('workspaces', ['fetchWorkspaces', 'fetchWorkspace']),
        ...mapActions('presentation', ['fetchPresentationDetails']),
        ...mapActions('backgroundJobs', ['getActiveJobs']),
        ...mapMutations('selections', [
            'SET_SELECTION_PRESENTATION_MODE_ACTIVE',
            'SET_CURRENT_SELECTIONS',
            'SET_CURRENT_SELECTION_ID',
        ]),
        ...mapMutations('files', ['SET_CURRENT_FILE', 'SET_CURRENT_FOLDER']),
        ...mapMutations('routes', ['SET_NEXT_URL']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        ...mapMutations('liveUpdates', ['SET_IS_CONNECTED']),
        ...mapMutations('workspaces', ['SET_CURRENT_WORKSPACE_ID']),
        ...mapMutations('persist', ['SET_AUTHENTICATED_INIT_DONE']),
        async initWorkspace() {
            this.loadingWorkspace = true
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
            if (fetchedWorkspaces.length <= 0) {
                this.noWorkspaceAvailable = true
                return
            }

            // Set the current workspace
            // If we don't have a current workspace saved, then set index to 0
            if (
                !this.currentWorkspaceId ||
                !fetchedWorkspaces.find(workspace => workspace.id == this.currentWorkspaceId)
            ) {
                this.SET_CURRENT_WORKSPACE_ID(fetchedWorkspaces[0].id)
            }

            await this.fetchWorkspace(this.currentWorkspaceId)
            this.loadingWorkspace = false
        },
        async initSignalR() {
            // Connect to SignalR
            Vue.prototype.$connection = new signalR.HubConnectionBuilder()
                .withAutomaticReconnect()
                .withUrl(
                    `${process.env.MIX_API_BASE_URL.substr(
                        0,
                        process.env.MIX_API_BASE_URL.lastIndexOf('/')
                    )}/live-update`,
                    {
                        skipNegotiation: true,
                        transport: signalR.HttpTransportType.WebSockets,
                    }
                )
                .configureLogging(signalR.LogLevel.Information)
                .build()
            const connection = this.$connection

            // Attempt to connect to signalR
            let failCount = 0
            console.log('connec to SignalR')
            while (!this.liveUpdateIsConnected) {
                try {
                    console.log('attempt ' + (1 + failCount))
                    await connection.start().then(response => {
                        console.log('success connecting!')
                        this.SET_IS_CONNECTED(true)
                    })
                } catch (err) {
                    const delay = 300
                    failCount++
                    console.log(`error connecting to SignalR. Retrying in ${delay} ms. Fail number: ${failCount}`)
                    await new Promise(resolve => {
                        setTimeout(() => resolve(), delay)
                    })
                    continue
                }
            }

            // Authenticate our connection
            connection.invoke('Authenticate', this.getAuthUserToken).catch(err => {
                console.log('error authenticating SignalR', err)
            })

            connection.on('AuthenticatedSuccess', message => {})

            connection.on('OnSelectionPresentationChanged', (eventName, args) => {
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
            this.connectedToSignalR = true
        },
        initCrispChat() {
            $crisp.push(['set', 'user:email', this.authUser.email])
            $crisp.push(['set', 'user:nickname', this.authUser.name ? this.authUser.name : 'No name'])
        },
        initCanny() {
            Canny('identify', {
                appID: '6086a09f2bb0b5460b28712a',
                user: {
                    companies: this.currentWorkspace
                        ? [
                              {
                                  name: this.currentWorkspace.title.replaceAll(/[^\w\ ]/g, ''),
                                  id: this.currentWorkspace.id,
                                  created: this.currentWorkspace.created_at,
                              },
                          ]
                        : [],
                    email: this.authUser.email,
                    name: this.authUser.name,
                    id: this.authUser.id,
                    created: this.authUser.created_at,
                    customFields: {
                        role: this.authUser.role,
                    },
                },
            })
        },
    },
    async created() {
        // Set up a request intercepter that checks if the user is still authenticated
        axios.interceptors.response.use(
            response => response,
            async error => {
                if (this.$route.name != 'login') {
                    if (!!error.response && error.response.status === 401) {
                        // if you ever get an unauthorized, logout the user
                        await this.logout()
                        this.error = null
                        this.SET_NEXT_URL(this.$route.fullPath)
                    }
                }
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
.loading-wrapper,
.error-wrapper {
    min-height: 100vh;
    width: 100%;
    min-width: 100vw;
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
.app {
    scroll-behavior: smooth;
    min-height: 100vh;
    min-width: 100vw;
    max-height: 100vh;
    overflow: hidden;
    background: $bg;
    position: relative;
    &.hide-crisp {
        z-index: 2;
    }
    // transition: 0.3s;
    // &:not(.full-screen) {
    //     display: grid;
    //     grid-template-columns: 80px auto;
    //     grid-template-rows: 60px auto;
    //     grid-template-areas:
    //         'sidebar navbar'
    //         'sidebar main';
    //     @media only screen and (-webkit-min-device-pixel-ratio: 1.3),
    //         only screen and (-o-min-device-pixel-ratio: 13/10),
    //         only screen and (min-resolution: 120dpi) {
    //         .app {
    //             grid-template-columns: 200px auto;
    //         }
    //     }
    //     @media screen and (max-width: $screenSm) {
    //         grid-template-columns: 52px auto;
    //         grid-template-rows: 52px auto;
    //     }
    // }
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
        background: #b08818;
        min-height: 100vh;
        position: relative;
        scroll-behavior: smooth;
        min-width: 100vw;
        max-height: 100vh;
        overflow: hidden;
        // transition: 0.3s;
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
    overflow-y: scroll;
    overflow-x: auto;
    background: $bg;
    position: relative;
    max-height: calc(100vh - #{$navbarHeight});
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
.grid-2 {
    grid-template-columns: repeat(3, 1fr);
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
