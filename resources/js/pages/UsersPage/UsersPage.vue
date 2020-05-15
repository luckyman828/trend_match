<template>
    <div class="users">
        <div class="breadcrumbs">
            <button class="invisible white-hover">
                <i class="far fa-building"></i><span>{{currentWorkspace.title}}</span>
            </button>
            <!-- <div class="breadcrumb">
                <button class="invisible white-hover">
                    <i class="far fa-folder-open"></i>
                    <span>Teams</span>
                </button>
            </div> -->
        </div>
        <h1>Users</h1>
        <!-- <UsersTable :users="users.filter(x => authUserWorkspaceRole == 'Admin' ? true : x.id == authUser.id)" -->
        <UsersTable @onNewUser="setAddNewUserModalVisible(true)"/>
        
        <AddUserModal ref="addUserModal" :show="addNewUserModalVisible" 
        @close="setAddNewUserModalVisible(false)" :users="users"/>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import UsersTable from './UsersTable'
import AddUserModal from '../../components/AddUserModal'

export default {
    name: 'usersPage',
    components: {
        UsersTable,
        AddUserModal,
    },
    data: function () { return {
    }},
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('users', ['addNewUserModalVisible', 'users']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole', 'currentWorkspace']),
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
