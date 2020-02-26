<template>
    <BaseFlyin ref="flyin" :show="show" @close="$emit('close')">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" :title="'Selection Users: '+selection.name" disableNavigation=true 
            @close="$emit('close')"/>
        </template>
        <template v-slot>
            <SelectionTeamsTable v-if="show && !loading" :selection="selection"/>
            <SelectionUsersTable style="margin-top: 40px;" v-if="show && !loading" :selection="selection" :users="currentSelectionUsers"/>
        </template>
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectionUsersTable from './SelectionUsersTable'
import SelectionTeamsTable from './SelectionTeamsTable'
export default {
    name: 'selectionUsersFlyin',
    components: {
        SelectionUsersTable,
        SelectionTeamsTable,
    },
    props: [
        'show',
        'selection',
    ],
    data: function() { return {
        loadingSelectionTeamUsers: true,
    }},
    watch: {
        selection: async function(newVal, oldVal) {
            if (!oldVal || newVal.id != oldVal.id) {
                // If we have a new selection
                await this.fetchData()
            }
        }
    },
    computed: {
        ...mapGetters('users', ['users', 'loadingUsers']),
        ...mapGetters('teams', ['teams', 'loadingTeams']),
        ...mapGetters('selections', ['selectionUsersStatus', 'selectionTeamsStatus', 'currentSelectionUsers']),
        loading() {
            return this.loadingUsers 
            || this.loadingTeams
            || this.loadingSelectionTeamUsers
            || this.selectionUsersStatus != 'success' 
            || this.selectionTeamsStatus != 'success'
        }
    },
    methods: {
        ...mapActions('users', ['fetchUsers']),
        ...mapActions('teams', ['fetchTeams', 'fetchTeamUsers']),
        ...mapActions('selections', ['fetchSelectionUsers', 'fetchSelectionTeams']),
        async fetchData() {
            this.fetchSelectionUsers(this.selection)
            await this.fetchSelectionTeams(this.selection).then(teams => {
                this.fetchSelectionTeamsUsers(teams)
            })
        },
        async fetchSelectionTeamsUsers(teams) {
            this.loadingSelectionTeamUsers = true
            // Use of promise and map to fetch users for all teams in parallel
            await Promise.all(teams.map(async team => {
                await this.fetchTeamUsers(team)
            }))
            this.loadingSelectionTeamUsers = false
        }
    },
    created() {
        // Check if we have any workspace users, else fetch them
        if (this.users == null && !this.loadingUsers) this.fetchUsers()
        // Check if we have any workspace teams, else fetch them
        if (this.teams == null && !this.loadingTeams) this.fetchTeams()
    }
}
</script>

<style>

</style>