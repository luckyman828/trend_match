<template>
    <div class="teams">
        <h1 v-if="$route.name == 'teams'">Teams</h1>
        <h1 v-if="$route.name == 'users'">Users</h1>
        <div class="underline"></div>
        <TeamsTable :teams="teams" :users="users" :authUser="authUser"
        @onNewUser="setAddNewUserModalVisible(true)"/>
        <AddUserModal ref="addUserModal" :show="addNewUserModalVisible" 
        @close="setAddNewUserModalVisible(false)" :users="users"/>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import TeamsTable from './TeamsTable'
import AddUserModal from '../../components/AddUserModal'

export default {
    name: 'teamsPage',
    components: {
        TeamsTable,
        AddUserModal,
    },
    data: function () { return {
    }},
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('teams', ['loadingTeams', 'teams']),
        ...mapGetters('users', ['loadingUsers', 'addNewUserModalVisible', 'users']),
    },
    methods: {
        ...mapMutations('users', ['setAddNewUserModalVisible']),
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
