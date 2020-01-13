<template>
    <ScreenLoader :loading="loading">
        <Teams/>
    </ScreenLoader>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Teams from '../Teams'
import ScreenLoader from './ScreenLoader'
import User from '../../../store/models/User'
import TeamInvite from '../../../store/models/TeamInvite'

export default {
    name: 'teamsLoader',
    components: {
        Teams,
        ScreenLoader
    },
    data: function () { return {
        unsub: '',
        loadingInit: true,
    }},
    computed: {
        ...mapGetters('persist', ['currentWorkspaceId']),
        ...mapGetters('entities/teams', ['loadingTeams']),
        ...mapGetters('entities/userTeams', ['loadingUserTeams']),
        ...mapGetters('entities/teamInvites', ['loadingTeamInvites']),
        ...mapGetters('entities/users', ['loadingUsers']),
        ...mapGetters('entities/workspaceUsers', ['loadingWorkspaceUsers']),
        loading () {
            return (this.loadingTeams || this.loadingUserTeams || this.loadingUsers || this.loadingTeamInvites || this.loadingInit || this.loadingWorkspaceUsers) ? true : false
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
        ...mapActions('entities/teamInvites', ['fetchTeamInvites']),
        ...mapActions('entities/teams', ['instantiateTeams']),
        async initRequiresWorkspace() {
            console.log('init')
            if (User.all().length <= 0)
                await this.fetchUsers(this.currentWorkspaceId)
            if (TeamInvite.all().length <= 0)
                await this.fetchTeamInvites(this.currentWorkspaceId)

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