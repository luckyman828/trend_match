<template>
    <div class="teams">
        <h1>Teams</h1>
        <div class="underline"></div>
        <TeamsTopBar :itemsToFilter="teams" :title="'Teams'"/>
        <TeamsTable :teams="teams" :users="users" :loading="loadingTeams" @onSelect="setSelected"/>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Team from '../../store/models/Team'
import TeamsTopBar from '../TeamsTopBar'
import TeamsTable from '../TeamsTable'
import User from '../../store/models/User'
import UserTeam from '../../store/models/UserTeam'

export default {
    name: 'teams',
    components: {
        TeamsTopBar,
        TeamsTable
    },
    data: function () { return {
        selected: [],
    }},
    computed: {
        ...mapGetters('entities/teams', ['loadingTeams']),
        authUser() {
            return this.$store.getters.authUser;
        },
        teams() {
            return Team.query().with('users').with('vegetables').all()
        },
        users() {
            return User.query().with('team').with('userTeam').all()
        },
        userTeams() {
            return UserTeam.query().with('team').with('user').all()
        },
    },
    methods: {
        ...mapActions(['getAuthUser']),
        ...mapActions('entities/teams', ['fetchTeams']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/userTeams', ['fetchUserTeams']),
        setSelected(index) {
            // Check if index already exists in array. If it exists remove it, else add it to array
            const selected = this.selected
            const found = selected.findIndex(el => el == index)
            const result = (found >= 0) ? selected.splice(found, 1) : selected.push(index)
        },
    },
    created () {
        this.fetchTeams({collection_id: 124124124})
        this.fetchUsers({collection_id: 124124124})
        this.fetchUserTeams()
    }
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
