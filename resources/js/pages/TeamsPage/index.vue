<template>
    <PageLoader :loading="loading" 
    @workspaceChange="fetchData">
        <TeamsPage/>
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TeamsPage from './TeamsPage'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'teamsPageLoader',
    components: {
        TeamsPage,
        PageLoader
    },
    data: function () { return {
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace', 'authUserWorkspaceRole']),
        ...mapGetters('teams', ['loadingTeams']),
        ...mapGetters('users', ['loadingUsers']),
        loading () {
            return (this.loadingTeams || this.loadingUsers)
        },
    },
    watch: {
    },
    methods: {
        ...mapActions('users', ['fetchUsers']),
        ...mapActions('teams', ['fetchTeams']),
        fetchData() {
            // Fetch workspace data
            this.fetchTeams(this.currentWorkspace.id)
            this.fetchUsers(this.currentWorkspace.id)
        }
    },
    created () {
        if (this.authUserWorkspaceRole != 'Admin') {
            this.$router.push({name: 'files'})
        }
        this.fetchData()
    },
}
</script>

<style scoped lang="scss">

</style>