<template>
    <div class="teams">
        <h1>Teams</h1>
        <div class="underline"></div>
        <!-- <TeamsTopBar :itemsToFilter="teams" :title="'Teams'"/> -->
        <TeamsTable :teams="teams" :users="users" :loading="isLoading" :authUser="authUser" 
        @onNewUser="$refs.addUserModal.show()" @onSelect="setSelected" @onOpenInviteToTeam="openInviteToTeam"/>
        <!-- <TeamsTableAlt :teams="teams" :users="users" :loading="isLoading" :authUser="authUser" @onSelect="setSelected" @onOpenInviteToTeam="openInviteToTeam"/> -->
        <!-- <ModalInviteToTeam :teams="teams" :team="singleTeam" :users="users" :authUser="authUser" ref="modal"/> -->
        <AddUserModal ref="addUserModal" :visibilityKey="addNewUserModalVisible" 
        @hide="setAddNewUserModalVisible(false)" @show="setAddNewUserModalVisible(true)" :users="users"/>
        <!-- <Modal ref="newUserModal" :header="'Add new user to workspace'" :subHeader="'I am a subheader'" v-slot="slotProps"
        @hide="setAddNewUserModalVisible(false)" @show="setAddNewUserModalVisible(true)" :visibilityKey="addNewUserModalVisible">
            <form>
                <div class="form-element">
                    <label for="new-user-email">User Email</label>
                    <input class="input-wrapper" type="email" id="new-user-email" placeholder="email">
                </div>
                <div class="form-element">
                    <label for="new-user-name"> UserName</label>
                    <input class="input-wrapper" type="text" id="new-user-name" placeholder="name">
                </div>
                <div class="form-element">
                    <label for="new-user-password">User Password</label>
                    <input class="input-wrapper" type="password" id="new-user-password">
                </div>
                <div class="form">
                    <button class="md primary full-width"><span>Add user(s)</span></button>
                </div>
            </form>
        </Modal> -->
        
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Team from '../../store/models/Team'
import TeamsTopBar from '../TeamsTopBar'
import TeamsTable from '../TeamsTable'
import TeamsTableAlt from '../TeamsTableAlt'
import AddUserModal from '../AddUserModal'
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
        AddUserModal,
    },
    data: function () { return {
        selected: [],
        singleTeam: null,
        loadingOverwrite: false,
        users: []
        // unsub: '',
    }},
    computed: {
        ...mapGetters('entities/teams', ['loadingTeams', 'teams']),
        ...mapGetters('entities/userTeams', ['loadingUserTeams']),
        ...mapGetters('entities/users', ['loadingUsers', 'addNewUserModalVisible']),
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
        // users () {
        //     return User.query().with('teams|role|workspaceUsers').all()
        // },
        isLoading () {
            let loading = false
            if (!this.loadingOverwrite)
                if (this.loadingTeams || this.loadingUserTeams || this.loadingUsers || this.users == null || this.authUser == null)
                    loading = true
            return loading
        },
    },
    methods: {
        ...mapMutations('entities/users', ['setAddNewUserModalVisible']),
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
    },
    created () {
        this.singleTeam = this.$store.getters['entities/teams/teams'][0]
    },
    mounted() {
        this.users = User.query().with('teams|role|workspaceUsers|userTeams').all()
    },
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
