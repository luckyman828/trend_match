<template>
    <div class="login-screen" v-if="$route.name == 'login'">
        <transition name="fade">
            <router-view></router-view>
        </transition>
    </div>
    <div class="app" id="app-component" v-else-if="authUser && currentWorkspace">
        <TheNavbarLogo/>
        <TheNavbar/>
        <TheSidebar/>
        <div class="main" id="main">
            <div class="container">
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>
    <div class="loading-wrapper" v-else>
        <BaseLoader/>
    </div>
</template>

<script>
import { mapActions, mapGetters, Store, mapMutations } from 'vuex'
import TheSidebar from './components/layout/TheSidebar'
import TheNavbar from './components/layout/TheNavbar'
import TheNavbarLogo from './components/layout/TheNavbarLogo'
import AuthUser from './store/models/AuthUser';
import TeamFile from './store/models/TeamFile';
import Team from './store/models/Team';
import Workspace from './store/models/Workspace'

export default{
    name: 'app',
    components: {
        TheSidebar,
        TheNavbar,
        TheNavbarLogo,
    },
    data: function () { return {
        // currentWorkspaceId: null,
    }},
    computed: {
        ...mapGetters('persist', ['userPermissionLevel', 'currentWorkspaceId']),
        ...mapGetters('workspaces', ['workspaces', 'currentWorkspace']),
        ...mapGetters('auth', ['isAuthenticated', 'authUser', 'authStatus']),
        // authUser() {
        //     return AuthUser.query().with('teams').with('workspaces').first()
        // },
        // workspaces() {
        //     return Workspace.all()
        // },
        // teamFiles() {
        //     return TeamFile.all()
        // },
        // teams() {
        //     return Team.query().with('files').get()
        // },
    },
    watch : {
        // Watch for changes to the authStatus
        authStatus: function(newVal) {
            // When our auth status changes to success 
            // -> initialize the workspace
            if (newVal == 'success') {
                this.initWorkspace()
            }
        }
        // authUser(newVal) {
        //     if (newVal.teams != null) {
        //         if (newVal.teams.length > 0) {
        //             if (this.authUser.role_id >= 3) {
        //                 this.setCurrentTeam(0)
        //             }
        //             else {
        //                 this.setCurrentTeam(this.authUser.teams[0].id)
        //                 this.setLoadingInit(false)
        //             }
        //         }
        //     }
        // },
        // currentWorkspaceId: async function(newVal, oldVal) {
        //     console.log('There was a change in workspace!')
        //     if (oldVal && oldVal != newVal) {
        //         await this.initRequiresWorkspace()
        //         this.fetchUsers(this.currentWorkspaceId)
        //     }
        // }
    },
    methods: {
        ...mapActions('persist', ['getUids']),
        ...mapActions('auth', ['getAuthUser', 'logout']),
        ...mapActions('workspaces', ['fetchWorkspaces']),
        ...mapMutations('workspaces', ['setCurrentWorkspaceIndex']),
        initWorkspace() {
            // Get workspaces
            this.fetchWorkspaces().then(() => {
                // Set the current workspace
                this.setCurrentWorkspaceIndex(0)
            })
            // Fetch workspace user and teams
            // this.fetchTeams()
            // this.fetchTeams()
        }
        // ...mapActions('entities/teams', ['fetchTeams']),
        // ...mapActions('entities/users', ['fetchUsers']),
        // ...mapActions('entities/userTeams', ['fetchUserTeams']),
        // ...mapActions('entities/workspaces', ['fetchWorkspaces']),
        // ...mapActions('entities/folders', ['fetchFolders']),
        // ...mapActions('entities/workspaceUsers', ['fetchWorkspaceUsers']),
        // ...mapActions('entities/teamFiles', ['fetchTeamFiles']),
        // ...mapActions('entities/roles', ['fetchRoles']),
        // ...mapActions('entities/collections', ['fetchCollections']),
        // ...mapActions('entities/taskTeams', ['fetchTaskTeams']),
        // ...mapActions('entities/phases', ['fetchPhases']),
        // ...mapActions('entities/tasks', ['fetchTasks']),
        // ...mapActions('entities/taskParents', ['fetchTaskParents']),
        // ...mapActions('entities/fileTasks', ['fetchFileTasks']),
        // ...mapActions('entities/actions', ['updateAction']),
        // ...mapActions('entities/selections', ['fetchSelections']),
        // ...mapActions('persist', ['setCurrentTeam', 'setTeamFilter', 'setCurrentWorkspace', 'setLoadingInit', 'setUserPermissionLevel']),
        // async fetchInitialData() {
        //     // Get user
        //     console.log('App: Getting initial data')
        //     await Promise.all([
        //         this.getAuthUser(),
        //         this.fetchWorkspaces(),
        //     ])
        //     this.setUserPermissionLevel(this.authUser.role_id)
        //     if (this.authUser.workspaces.length > 1) console.log('multiple workspaces!');
        //     this.setCurrentWorkspace({workspace_id: this.workspaces[0].id, user_id: this.authUser.id})
        //     // this.setCurrentWorkspace({workspace_id: this.authUser.workspaces[0].id, user_id: this.authUser.id})
        // },
        // async initRequiresWorkspace() {
        //     // Only get data for the current workspace
        //     console.log('getting init data from workspace: '+ this.currentWorkspaceId)
        //     this.setLoadingInit(true)
        //     if (this.authUser) {
        //         await (
        //             this.fetchWorkspaceUsers(this.currentWorkspaceId),
        //             this.fetchFolders(this.currentWorkspaceId),
        //             this.fetchTeams(this.currentWorkspaceId),
        //             this.fetchUserTeams(this.currentWorkspaceId),
        //             this.fetchTeamFiles(this.currentWorkspaceId),
        //             this.fetchTaskTeams(this.currentWorkspaceId),
        //             this.fetchCollections(this.currentWorkspaceId),
        //             this.fetchPhases(this.currentWorkspaceId),
        //             this.fetchTasks(this.currentWorkspaceId),
        //             this.fetchTaskParents(this.currentWorkspaceId),
        //             this.fetchFileTasks(this.currentWorkspaceId),
        //             this.fetchRoles()
        //             // this.fetchSelections(this.currentWorkspaceId)
        //         )
                
        //         if (this.authUser.role_id >= 5) {
        //             this.setCurrentTeam(0)
        //             this.setTeamFilter(0)
        //         }
        //         else if (this.authUser.teams.length > 0) {
        //             this.setCurrentTeam(this.authUser.teams[0].id)
        //             this.setTeamFilter(this.authUser.teams[0].id)
        //         }
        //         this.setLoadingInit(false)
                
        //     } else {
        //         this.loadingOverwrite = true
        //     }
        // }
    },
    created() {
        // Set up a request intercepter that checks if the user is still authenticated
        axios.interceptors.response.use(response => response, (error) => {
            if (error.response.status === 401) {
                // if you ever get an unauthorized, logout the user
                this.logout()
            }
            return Promise.reject(error.response);
        });

        // Check if the user is authenticated. 
        // If that is the case get the auth user
        if (this.isAuthenticated) {
            this.getAuthUser()
            
            // Get some snowflake IDs now we're at it
            this.getUids()
        }
        
    },
}
</script>

<style lang="scss">
    @import '~@/_variables.scss';
    .loading-wrapper {
        min-height: 100vh;
        width: 100%;
        justify-content: center;
        align-items: center;
        display: flex;
        background: $bg;
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
        grid-template-columns: 260px auto;
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
    }
    .main {
        box-shadow: 0 3px 6px rgba(0,0,0,.05) inset, 5px 0 6px rgba(0,0,0,.02) inset;
        padding: 20px 60px;
        overflow-y: scroll;
        overflow-x: auto;
        background: $grey;
    }
    h1 {
        margin-bottom: 30px;
    }
    .grid-2, .grid-3 {
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
