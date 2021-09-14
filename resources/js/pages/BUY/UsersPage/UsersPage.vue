<template>
    <div class="users">
        <Breadcrumbs />
        <h1>Users</h1>
        <!-- <UsersTable :users="users.filter(x => authUserWorkspaceRole == 'Admin' ? true : x.id == authUser.id)" -->
        <UsersTable @onNewUser="setAddNewUserModalVisible(true)" />

        <AddUsersModal
            ref="addUserModal"
            :show="addNewUserModalVisible"
            @close="setAddNewUserModalVisible(false)"
            :users="users"
        />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import UsersTable from './UsersTable'
import AddUsersModal from '../../UsersPage/AddUsersModal/'
import Breadcrumbs from '../../../components/common/Breadcrumbs'

export default {
    name: 'usersPage',
    components: {
        UsersTable,
        AddUsersModal,
        Breadcrumbs,
    },
    data: function() {
        return {}
    },
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
h1 {
    margin-bottom: 16px;
}
.underline {
    width: 100%;
    border-bottom: solid 2px $light2;
    margin-bottom: 20px;
}
</style>
