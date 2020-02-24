<template>
    <div class="teams">
        <h1>Teams</h1>
        <div class="underline"></div>
        <TeamsTable :teams="teams" :users="users" :authUser="authUser"
        @onNewUser="setAddNewUserModalVisible(true)"/>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import TeamsTable from './TeamsTable'

export default {
    name: 'teamsPage',
    components: {
        TeamsTable,
    },
    data: function () { return {
    }},
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('teams', ['teams']),
        ...mapGetters('users', ['addNewUserModalVisible', 'users']),
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
