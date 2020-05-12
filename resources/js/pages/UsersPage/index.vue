<template>
    <PageLoader :status="status"
    :errorCallback="() => fetchData()"
    @workspaceChange="fetchData">
        <UsersPage/>
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UsersPage from './UsersPage'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'usersPageLoader',
    components: {
        UsersPage,
        PageLoader
    },
    data: function () { return {
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('users', ['loadingUsers', 'getUsersStatus']),
        status () {
            return this.getUsersStatus
        },
    },
    watch: {
    },
    methods: {
        ...mapActions('users', ['fetchUsers']),
        fetchData() {
            // Fetch workspace data
            this.fetchUsers(this.currentWorkspace.id)
        }
    },
    created () {
        this.fetchData()
    },
}
</script>

<style scoped lang="scss">

</style>