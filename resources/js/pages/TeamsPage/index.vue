<template>
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
    },
    created () {
        if (this.authUserWorkspaceRole != 'Admin') {
            this.$router.push({name: 'files'})
        }
    },
}
</script>

<style scoped lang="scss">

</style>