<template>
    <div class="users">
        <Breadcrumbs />
        <h1>Users</h1>
        <!-- <UsersTable :users="users.filter(x => authUserWorkspaceRole == 'Admin' ? true : x.id == authUser.id)" -->
        <UsersTable @on-new-user="$emit('show-add-users-modal')" />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import UsersTable from './UsersTable'
import Breadcrumbs from '../../../components/common/Breadcrumbs'

export default {
    name: 'usersPage',
    components: {
        UsersTable,
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
