<template>
    <div class="teams">
        <h1>Teams</h1>
        <div class="underline"></div>
        <TeamsTopBar :itemsToFilter="teams" :title="'Teams'"/>
        <TeamsTable :teams="teams" :users="users" :loading="loadingTeams" @onSelect="setSelected" @onOpenInviteToTeam="openInviteToTeam"/>
        <InviteToTeamModal v-if="singleTeam != null" :team="singleTeam" :users="users" :authUser="authUser" @onCloseModal="closeModal"/>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Team from '../../store/models/Team'
import TeamsTopBar from '../TeamsTopBar'
import TeamsTable from '../TeamsTable'
import User from '../../store/models/User'
import UserTeam from '../../store/models/UserTeam'
import InviteToTeamModal from '../InviteToTeamModal';

export default {
    name: 'teams',
    components: {
        TeamsTopBar,
        TeamsTable,
        InviteToTeamModal
    },
    data: function () { return {
        selected: [],
        singleTeam: null,
    }},
    watch: {
        singleTeam: function (newVal, oldVal) {
            console.log
            if (newVal != null)
                document.querySelector('body').classList.add('disabled')
            else document.querySelector('body').classList.remove('disabled')
        }
    },
    computed: {
        ...mapGetters('entities/teams', ['loadingTeams']),
        ...mapGetters('entities/userTeams', ['loadingUserTeams']),
        ...mapGetters('entities/users', ['loadingUsers']),
        authUser() {
            return this.$store.getters.authUser;
        },
        userTeams() {
            return UserTeam.query().with('team').with('user').all()
        },
        users () {
            return User.query().with('teams').all()
        },
        teams () {
            // Manually find the teams and the users belonging to each team.
            // This is only necessary because I cannot make the Vuex ORM realtionship work 
            // If you can make it work, please be my guest
            const teams = Team.query().with('users').all()
            const users = this.users
            // Loop through the users and sort them between the teams
            users.forEach(user => {
                // First check that the user has a team and that the team has an id
                if (user.teams[0] != null) {
                    if ('id' in user.teams[0]) {
                        // If we have a team with an id
                        // Set the users role
                        user.role = (user.role_id == 1) ? 'Sales' : (user.role_id == 2) ? 'Sales Rep' : 'Admin'
                        user.teams.forEach(userTeam => {
                            // Loop through each of the users teams and add the user
                            // Find the corresponding team
                            const foundTeam = teams.find(team => team.id == userTeam.id)
                            // Check that the user doesnt already exist in this team
                            if ( !foundTeam.users.includes(user) )
                                // Push the user to the team if the user is not already a member
                                foundTeam.users.push(user)
                        })
                    }
                }
            })
            return teams
        },
    },
    methods: {
        ...mapActions(['getAuthUser']),
        ...mapActions('entities/teams', ['fetchTeams']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/userTeams', ['fetchUserTeams']),
        setSelected(index) {
            // Check if index already exists in array. If it exists remove it, else add it to array
            const selected = this.selected
            const found = selected.findIndex(el => el == index)
            const result = (found >= 0) ? selected.splice(found, 1) : selected.push(index)
        },
        openInviteToTeam(team) {
            this.singleTeam = team
        },
        closeModal() {
            this.singleTeam = null;
        }
    },
    created () {
        this.fetchTeams({collection_id: 124124124})
        this.fetchUsers({collection_id: 124124124})
        this.fetchUserTeams()
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
