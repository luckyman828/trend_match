<template>
    <div class="teams">
        <h1>Teams</h1>
        <div class="underline"></div>
        <!-- <TeamsTopBar :itemsToFilter="teams" :title="'Teams'"/> -->
        <TeamsTable :teams="teams" :users="users" :loading="isLoading" :authUser="authUser" @onSelect="setSelected" @onOpenInviteToTeam="openInviteToTeam"/>
        <!-- <TeamInviteModal v-if="singleTeam != null" :teams="teams" :team="singleTeam" :users="users" :authUser="authUser" @onCloseModal="closeModal"/> -->
        <ModalInviteToTeam :teams="teams" :team="singleTeam" :users="users" :authUser="authUser" ref="modal"/>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Team from '../../store/models/Team'
import TeamsTopBar from '../TeamsTopBar'
import TeamsTable from '../TeamsTable'
import ModalInviteToTeam from '../ModalInviteToTeam'
// import TeamInviteModal from '../TeamInviteModal';
import User from '../../store/models/User'
import UserTeam from '../../store/models/UserTeam'
import TeamInvite from '../../store/models/TeamInvite'
import AuthUser from '../../store/models/AuthUser'

export default {
    name: 'teams',
    components: {
        TeamsTopBar,
        TeamsTable,
        // TeamInviteModal,
        ModalInviteToTeam,
    },
    data: function () { return {
        selected: [],
        singleTeam: null,
        loadingOverwrite: false,
        unsub: '',
    }},
    computed: {
        ...mapGetters('entities/teams', ['loadingTeams']),
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
            return User.query().with('teams').with('role').all()
        },
        teams () {
            return this.$store.getters['entities/teams/teams']
        },
        // teams () {
        //     // Manually find the teams and the users belonging to each team.
        //     // This is only necessary because I cannot make the Vuex ORM realtionship work 
        //     // If you can make it work, please be my guest
        //     const teams = Team.query().with('users').with('invites').all()
        //     const users = this.users
        //     // Loop through the users and sort them between the teams
        //     users.forEach(user => {
        //         // First check that the user has a team and that the team has an id
        //         if (user.teams[0] != null) {
        //             if ('id' in user.teams[0]) {
        //                 // If we have a team with an id
        //                 // Set the users role
        //                 user.teams.forEach(userTeam => {
        //                     // Loop through each of the users teams and add the user
        //                     // Find the corresponding team
        //                     const foundTeam = teams.find(team => team.id == userTeam.id)
        //                     // Check that the user doesnt already exist in this team
        //                     if ( !foundTeam.users.includes(user) )
        //                         // Push the user to the team if the user is not already a member
        //                         foundTeam.users.push(user)
        //                 })
        //             }
        //         }
        //     })
        //     if (!this.isLoading) {
        //         if (this.authUser.role_id == 2) {
        //             // Get the users teams
        //             let userTeams = []
        //             teams.forEach(team => {
        //                 if (this.authUser.teams.find(x => x.id == team.id))
        //                     userTeams.push(team)
        //             })
        //             return userTeams
        //         }
        //         else if (this.authUser.role_id >= 3)
        //             return teams
        //     }
        //     return []
        // },
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
        initRequiresWorkspace() {
            if (User.all().length <= 0)
                    this.fetchUsers(this.currentWorkspaceId)
            if (TeamInvite.all().length <= 0)
                this.fetchTeamInvites(this.currentWorkspaceId)
            this.singleTeam = this.teams[0]
        }
    },
    created () {
        // If we already have a workspace id, fetch the data we are missing
        if (this.currentWorkspaceId != null)
            this.initRequiresWorkspace()
        // Else, wait till a workspace id is set, and then fetch the data
        this.unsub = this.$store.subscribe((mutation, state) => {
            if(mutation.type == 'persist/setCurrentWorkspace') {
                this.initRequiresWorkspace()
            } 
        })
        
    },
    destroyed() {
        this.unsub()
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
