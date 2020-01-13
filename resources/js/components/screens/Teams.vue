<template>
    <div class="teams">
        <h1>Teams</h1>
        <div class="underline"></div>
        <!-- <TeamsTopBar :itemsToFilter="teams" :title="'Teams'"/> -->
        <TeamsTable :teams="teams" :users="users" :loading="isLoading" :authUser="authUser" @onSelect="setSelected" @onOpenInviteToTeam="openInviteToTeam"/>
        <!-- <TeamsTableAlt :teams="teams" :users="users" :loading="isLoading" :authUser="authUser" @onSelect="setSelected" @onOpenInviteToTeam="openInviteToTeam"/> -->
        <ModalInviteToTeam :teams="teams" :team="singleTeam" :users="users" :authUser="authUser" ref="modal"/>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Team from '../../store/models/Team'
import TeamsTopBar from '../TeamsTopBar'
import TeamsTable from '../TeamsTable'
import TeamsTableAlt from '../TeamsTableAlt'
import ModalInviteToTeam from '../ModalInviteToTeam'
import User from '../../store/models/User'
import UserTeam from '../../store/models/UserTeam'
import TeamInvite from '../../store/models/TeamInvite'
import AuthUser from '../../store/models/AuthUser'

export default {
    name: 'teams',
    components: {
        TeamsTopBar,
        TeamsTable,
        TeamsTableAlt,
        ModalInviteToTeam,
    },
    data: function () { return {
        selected: [],
        singleTeam: null,
        loadingOverwrite: false,
        // unsub: '',
    }},
    computed: {
        ...mapGetters('entities/teams', ['loadingTeams', 'teams']),
        ...mapGetters('entities/userTeams', ['loadingUserTeams']),
        ...mapGetters('entities/users', ['loadingUsers']),
        ...mapGetters('persist', ['currentTeamId', 'currentWorkspaceId']),
        test() {
            return this.$store.getters['persist/actionScope']
        },
        authUser() {
            return AuthUser.query().with('workspaces').with('teams').with('role').first()
        },
        teamInvites() {
            return TeamInvite.query().all()
        },
        userTeams() {
            return UserTeam.query().with('team').with('user').all()
        },
        users () {
            return User.query().with('teams|role|workspaceUsers').all()
        },
        isLoading () {
            let loading = false
            if (!this.loadingOverwrite)
                if (this.loadingTeams || this.loadingUserTeams || this.loadingUsers || this.users[0].role == null || this.authUser == null)
                    loading = true
            return loading
        },
    },
    methods: {
        ...mapActions('entities/authUser', ['getAuthUser']),
        ...mapActions('entities/teams', ['fetchTeams']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/userTeams', ['fetchUserTeams']),
        ...mapActions('entities/teamInvites', ['fetchTeamInvites']),
        ...mapActions('entities/workspaces', ['fetchWorkspaces']),
        ...mapActions('entities/workspaceUsers', ['fetchWorkspaceUsers']),
        ...mapActions('persist', ['setCurrentTeam']),
        setSelected(index) {
            // Check if index already exists in array. If it exists remove it, else add it to array
            const selected = this.selected
            const found = selected.findIndex(el => el == index)
            const result = (found >= 0) ? selected.splice(found, 1) : selected.push(index)
        },
        openInviteToTeam(team) {
            this.singleTeam = team
            console.log('Teams: Openeing')
            this.$refs.modal.toggle()
        },
        // initRequiresWorkspace() {
        //     if (User.all().length <= 0)
        //             this.fetchUsers(this.currentWorkspaceId)
        //     if (TeamInvite.all().length <= 0)
        //         this.fetchTeamInvites(this.currentWorkspaceId)
        //     this.singleTeam = this.teams[0]
        // }
    },
    created () {
        this.singleTeam = this.$store.getters['entities/teams/teams'][0]
        // If we already have a workspace id, fetch the data we are missing
        // if (this.currentWorkspaceId != null)
        //     this.initRequiresWorkspace()
        // // Else, wait till a workspace id is set, and then fetch the data
        // this.unsub = this.$store.subscribe((mutation, state) => {
        //     if(mutation.type == 'persist/setCurrentWorkspace') {
        //         this.initRequiresWorkspace()
        //     } 
        // })
        
    },
    destroyed() {
        // this.unsub()
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    h1 {
        margin-bottom: 16px;
    }
    .underline {
        width: 100%;
        border-bottom: solid 2px $light2;
        margin-bottom: 20px;
    }
</style>
