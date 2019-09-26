<template>
    <div class="app" id="app-component">
        <NavbarLogo/>
        <Navbar/>
        <Sidebar :authUser="authUser"/>
        <div class="main" id="main">
            <div class="container">
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import store from './store'
import { mapActions, mapGetters } from 'vuex'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import NavbarLogo from './components/NavbarLogo'
import AuthUser from './store/models/AuthUser';
import TeamFile from './store/models/TeamFile';
import Team from './store/models/Team';
import { Query } from '@vuex-orm/core';

export default{
    name: 'app',
    store,
    components: {
        Sidebar,
        Navbar,
        NavbarLogo,
    },
    data: function () { return {
        // currentWorkspaceId: null,
    }},
    computed: {
        ...mapGetters('persist', ['userPermissionLevel', 'currentWorkspaceId']),
        authUser() {
            return AuthUser.query().with('teams').with('workspaces').first()
        },
        teamFiles() {
            return TeamFile.all()
        },
        teams() {
            return Team.query().with('files').get()
        },
    },
    methods: {
        ...mapActions('entities/authUser', ['getAuthUser']),
        // ...mapActions('entities/collections', ['fetchCollections']),
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
            this.setCurrentWorkspace(this.authUser.workspaces[0].id)
            // this.currentWorkspaceId = this.authUser.workspaces[0].id
        },
    },
    watch : {
        authUser(newVal) {
            if (newVal.teams != null) {
                if (newVal.teams.length > 0) {
                    if (this.authUser.role_id >= 3) {
                        this.setCurrentTeam(0)
                    }
                    else {
                        this.setCurrentTeam(this.authUser.teams[0].id)
                        this.setLoadingInit(false)
                    }
                }
            }
        }
    },
    created() {
        this.fetchInitialData()
        // Fetch data based on the Auth User
        .then( async response => {
            // Only get data for the current workspace
            console.log(this.userPermissionLevel)
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
        })
    },
}
</script>

<style lang="scss">
    @import '~@/_variables.scss';
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
        grid-template-rows: 70px auto;
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
        background: $light;
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
    .pill {
        background: $light1;
        height: 20px;
        font-size: 13px;
        border-radius: 20px;
        width: 85px;
        height: 25px;
        display: inline-block;
        line-height: 25px;
        text-align: center;
        &.positive {
            background: $secondaryLight;
        }
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
