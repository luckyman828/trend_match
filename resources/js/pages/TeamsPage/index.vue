<template>
    <PageLoader :loading="loading">
        <TeamsPage/>
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TeamsPage from './TeamsPage'
import PageLoader from '../../components/common/PageLoader'
import User from '../../store/models/User'

export default {
    name: 'teamsPageLoader',
    components: {
        TeamsPage,
        PageLoader
    },
    data: function () { return {
        unsub: '',
        loadingInit: true,
    }},
    computed: {
        ...mapGetters('persist', ['currentWorkspaceId']),
        ...mapGetters('entities/teams', ['loadingTeams']),
        ...mapGetters('entities/userTeams', ['loadingUserTeams']),
        ...mapGetters('entities/users', ['loadingUsers']),
        ...mapGetters('entities/workspaceUsers', ['loadingWorkspaceUsers']),
        loading () {
            return (this.loadingTeams || this.loadingUserTeams || this.loadingUsers || this.loadingInit || this.loadingWorkspaceUsers || this.loadingUsers) ? true : false
        },
    },
    watch: {
        loading: function(newVal, oldVal) {
            if (newVal == false) {
                this.instantiateTeams()
            }
        }
    },
    methods: {
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/teams', ['instantiateTeams']),
        async initRequiresWorkspace() {
            console.log('init')
            if (User.all().length <= 0)
                await this.fetchUsers(this.currentWorkspaceId)

            this.loadingInit = false
        },
    },
    created () {
        if (this.currentWorkspaceId != null) {
            this.initRequiresWorkspace()
        }
        // Else, wait till a workspace id is set, and then fetch the data
        this.unsub = this.$store.subscribe((mutation, state) => {
            if(mutation.type == 'persist/setCurrentWorkspace') {
                this.initRequiresWorkspace()
            } 
        })
    },
    mounted() {
        if (!this.loading) {
            this.instantiateTeams()
        }
    },
    destroyed () {
        this.unsub()
    }
}
</script>

<style scoped lang="scss">

</style>