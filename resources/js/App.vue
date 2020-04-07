<template>
    <div class="login-screen" v-if="$route.name == 'login'">
        <transition name="fade">
            <router-view></router-view>
        </transition>
    </div>
    <div class="app" id="app-component" v-else-if="authUser && currentWorkspace" :class="{'hide-nav': hideNav}">
        <TheNavbarLogo/>
        <TheNavbar/>
        <TheSidebar/>
        <div class="main" id="main" ref="main" @scroll="scrollHandler">
            <div class="container">
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
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
import TheNavbarLogo from './components/layout/TheNavbarLogo'

export default{
    name: 'app',
    store,
    components: {
        Sidebar,
        Navbar,
        NavbarLogo,
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
        ...mapGetters('auth', ['isAuthenticated', 'authUser', 'authStatus']),
    },
    methods: {
        ...mapActions('entities/authUser', ['getAuthUser']),
        ...mapActions('entities/teams', ['fetchTeams']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/userTeams', ['fetchUserTeams']),
        ...mapActions('entities/workspaces', ['fetchWorkspaces']),
        ...mapActions('entities/workspaceUsers', ['fetchWorkspaceUsers']),
        ...mapActions('entities/teamFiles', ['fetchTeamFiles']),
        ...mapActions('entities/roles', ['fetchRoles']),
        ...mapActions('entities/collections', ['fetchCollections']),
        ...mapActions('entities/taskTeams', ['fetchTaskTeams']),
        ...mapActions('entities/phases', ['fetchPhases']),
        ...mapActions('entities/tasks', ['fetchTasks']),
        ...mapActions('entities/taskParents', ['fetchTaskParents']),
        ...mapActions('entities/fileTasks', ['fetchFileTasks']),
        ...mapActions('entities/actions', ['updateAction']),
        ...mapActions('persist', ['setCurrentTeam', 'setTeamFilter', 'setCurrentWorkspace', 'setLoadingInit', 'setUserPermissionLevel']),
        async fetchInitialData() {
            // Get user
            console.log('App: Getting initial data')
            await Promise.all([
                this.getAuthUser(),
                this.fetchWorkspaceUsers(),
                this.fetchWorkspaces(),
            ])
            this.setUserPermissionLevel(this.authUser.role_id)
            if (this.authUser.workspaces.length > 1) console.log('multiple workspaces!');
            this.setCurrentWorkspace({workspace_id: this.authUser.workspaces[0].id, user_id: this.authUser.id})
        },
        async initRequiresWorkspace() {
            // Only get data for the current workspace
            console.log('getting init data from workspace: '+ this.currentWorkspaceId)
            this.setLoadingInit(true)
            if (this.authUser) {
                await (
                    this.fetchTeams(this.currentWorkspaceId),
                    this.fetchUserTeams(this.currentWorkspaceId),
                    this.fetchTeamFiles(this.currentWorkspaceId),
                    this.fetchTaskTeams(this.currentWorkspaceId),
                    this.fetchCollections(this.currentWorkspaceId),
                    this.fetchPhases(this.currentWorkspaceId),
                    this.fetchTasks(this.currentWorkspaceId),
                    this.fetchTaskParents(this.currentWorkspaceId),
                    this.fetchFileTasks(this.currentWorkspaceId),
                    this.fetchRoles()
                )
                
                if (this.authUser.role_id >= 5) {
                    this.setCurrentTeam(0)
                    this.setTeamFilter(0)
                }
                else if (this.authUser.teams.length > 0) {
                    this.setCurrentTeam(this.authUser.teams[0].id)
                    this.setTeamFilter(this.authUser.teams[0].id)
                }
                this.setLoadingInit(false)
                
            } else {
                this.loadingOverwrite = true
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
        ...mapActions('files', ['setCurrentFolder']),
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
            this.getUids()
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
        grid-template-columns: 160px auto;
        grid-template-rows: 72px auto;
        grid-template-areas: 
            "logo navbar" 
            "sidebar main";
        @media	only screen and (-webkit-min-device-pixel-ratio: 1.3),
        only screen and (-o-min-device-pixel-ratio: 13/10),
        only screen and (min-resolution: 120dpi) {
            .app {
                grid-template-columns: 200px auto;
            }
        }
        @media screen and (max-width: $screenSmall) {
            grid-template-columns: 80px auto;
        }
        &.hide-nav {
            // grid-template-rows: 0 auto;
            // margin-top: -72px;
        }
    }
    .main {
        box-shadow: 0 3px 6px rgba(0,0,0,.05) inset, 5px 0 6px rgba(0,0,0,.02) inset;
        padding: 20px 60px;
        overflow-y: scroll;
        overflow-x: auto;
        background: $light;
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
    .grid-3 {
        grid-template-columns: repeat(3, 1fr);
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
    .tabs {
        margin-left: -16px;
        margin-right: -16px;
        width: calc(100% + 32px);
        .tab {
            display: inline-block;
            font-size: 18px;
            opacity: .5;
            padding: 10px 25px;
            border-bottom: solid 3px transparent;
            margin-bottom: 8px;
            &.active {
                opacity: 1;
                border-color: $primary;
            }
            &:not(.active):hover {
                border-color: rgba($primary, .5);
                cursor: pointer;
            }
        }
    }
    .vdp-datepicker {
        display: grid;
        justify-items: end;
        &.disabled {
            pointer-events: none;
            opacity: .5;
        }
        > div::after {
            content: "";
            font-size: 11px;
            color: $dark2;
            display: block;
            position: absolute;
            z-index: 1;
            right: 12px;
            height: 32px;
            top: 0;
            line-height: 32px;
            font-weight: 900;
            font-family: "Font Awesome 5 Pro"
        }
        input {
            border: solid 1px $light2;
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0,0,0,.1);
            padding-left: 12px;
            height: 32px;
            width: 150px;
            font-size: 14px;
            cursor: pointer;
        }
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

    // Tables
    .flex-table {
        .card > & {
            margin-left: -16px;
            margin-right: -16px;
            width: calc(100% + 32px);
        }
        &.disabled {
            .flex-table-row:not(.header-row) {
                opacity: .5;
            }
        }
        .flex-table-row {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            min-height: 45px;
            > * {
                &.select {
                    margin-left: 16px;
                    min-width: 80px;
                }
            }
        }
        .header-row {
            font-weight: 700;
            font-size: 12px;
            height: 45px;
            border-bottom: solid 2px $light1;
        }
        .item-row {
            border-bottom: solid 1px $light1;
            &:hover {
                background: $light;
            }
        }
        th {
            text-transform: uppercase;
            font-size: 12px;
            font-weight: 600;
            color: $dark2;
            i {
                color: $light2;
                margin: 0;
                margin-left: 4px;
            }
            &.active {
                i {
                    color: $primary
                }
            }
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
            background: rgba($dark, .7);
            z-index: 110;
        }
        &.disabled {
            &::after {
                display: block;
            }
        }
    }

    // Icons
    i {
        &.green {
            color: $green;
        }
        &.red {
            color: $red;
        }
        &.dark {
            color: $dark;
        }
        &.primary {
            color: $primary;
        }
    }

    // Scrollbar
    *:not(.app) {
        /* width */
        &::-webkit-scrollbar {
            width: 3px;
            height: 7px;
        }
        /* Track */
        &::-webkit-scrollbar-track {
            background: $light2; 
        }
        /* Handle */
        &::-webkit-scrollbar-thumb {
            background: $dark2;
            border-radius: 2px;
            &:hover {
                background: $dark25;
            }
        }
        .dark > *, .dark {
            /* width */
            &::-webkit-scrollbar {
                width: 5px;
                height: 7px;
            }
            /* Track */
            &::-webkit-scrollbar-track {
                background: transparent; 
            }
            /* Handle */
            &::-webkit-scrollbar-thumb {
                background: white;
                box-shadow: -2px 0 #333 inset;
                &:hover {
                    background: $primary;
                }
            }
        }
    }

</style>
