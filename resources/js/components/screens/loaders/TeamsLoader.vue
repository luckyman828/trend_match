<template>
    <PageLoader :loading="loading" 
    @workspaceChange="fetchData">
        <UsersPage/>
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UsersPage from './UsersPage'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'teamsLoader',
    components: {
        Teams,
        ScreenLoader
    },
    data: function () { return {
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('users', ['loadingUsers']),
        loading () {
            return (this.loadingTeams || this.loadingUsers)
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