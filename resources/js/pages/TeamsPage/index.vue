<template>
    <PageLoader :loading="loading">
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
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('teams', ['loadingTeams']),
        ...mapGetters('users', ['loadingUsers']),
        loading () {
            return (this.loadingTeams || this.loadingUsers) ? true : false
        },
    },
    methods: {
        ...mapActions('users', ['fetchUsers']),
        ...mapActions('teams', ['fetchTeams']),
    },
    created () {
        this.fetchTeams(this.currentWorkspace.id)
        this.fetchUsers(this.currentWorkspace.id)
    },
}
</script>

<style scoped lang="scss">

</style>