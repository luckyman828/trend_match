<template>
    <!-- <PageLoader :status="status"
    loadingMsg="loading teams"
    errorMsg="error loading teams"
    :errorCallback="() => fetchData()"
    @workspaceChange="fetchData"> -->
    <PageLoader>
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
        ...mapGetters('teams', ['loadingTeams', 'getTeamsStatus']),
        ...mapGetters('users', ['loadingUsers', 'getUsersStatus']),
        loading () {
            return (this.loadingTeams || this.loadingUsers)
        },
        status () {
            if (this.getUsersStatus == 'error' || this.getTeamsStatus == 'error') return 'error'
            if (this.getUsersStatus == 'loading' || this.getTeamsStatus == 'loading') return 'loading'
            return 'success'
        },
    },
    watch: {
    },
    methods: {
        ...mapActions('users', ['fetchUsers']),
        ...mapActions('teams', ['fetchTeams']),
        fetchData() {
            // Fetch workspace data
            // this.fetchTeams(this.currentWorkspace.id)
            // this.fetchUsers(this.currentWorkspace.id)
        }
    },
    created () {
        if (this.authUserWorkspaceRole != 'Admin') {
            this.$router.push({name: 'files'})
        }
        // this.fetchData()
    },
}
</script>

<style scoped lang="scss">

</style>