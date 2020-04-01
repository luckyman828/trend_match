<template>
    <BaseFlyin ref="flyin" :show="show" :loading="loading"
    @close="$emit('close')">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" disableNavigation=true 
            @close="$emit('close')">
                <template v-slot:left>
                    <h3>Selection Users: {{selection.name}}</h3>
                </template>
            </BaseFlyinHeader>
        </template>
        <template v-slot>
            <SelectionTeamsTable v-if="show && !loading" :selection="selection" :authUserIsOwner="authUserIsOwner"/>
            <SelectionUsersTable style="margin-top: 40px;" v-if="show && !loading" :selection="selection" :users="selection.users"
            :authUserIsOwner="authUserIsOwner"/>
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
        loadingSelectionTeamUsers: false,
        loadingSelection: false,
        fetchingData: true,
        authUserIsOwner: false,
    }},
    watch: {
        // selection: async function(newVal, oldVal) {
        //     if (!oldVal || newVal.id != oldVal.id) {
        //         // If we have a new selection
        //         await this.fetchData()
        //     }
        // }
        show: async function(newVal, oldVal) {
            if (newVal) {
                // await this.fetchSelection(this.selection.id)
                this.fetchData()
                // console.log(JSON.parse(JSON.stringify(this.selection)))
            }
        }
    },
    computed: {
        ...mapGetters('users', ['users', 'loadingUsers']),
        ...mapGetters('teams', ['teams', 'loadingTeams']),
        ...mapGetters('selections', ['currentSelectionUsers']),
        loading() {
            return this.loadingUsers 
            || this.loadingTeams
            || this.fetchingData
        }
    },
    methods: {
        ...mapActions('users', ['fetchUsers']),
        ...mapActions('teams', ['fetchTeams', 'fetchTeamUsers']),
        ...mapActions('selections', ['fetchSelection']),
        async fetchData() {
            this.fetchingData = true
            // Save a reference to our role, since the fetchSelection request will overwrite our role with our job
            this.authUserIsOwner = this.selection.your_role
            await this.fetchSelection({selectionId: this.selection.id}) // Fetches selection with users and teams
            // await this.fetchSelectionTeamsUsers(this.selection.teams)
            this.fetchingData = false
        },
        async fetchSelectionTeamsUsers(teams) {
            // Use of promise and map to fetch users for all teams in parallel
            await Promise.all(teams.map(async team => {
                await this.fetchTeamUsers(team)
            }))
        }
    },
    created() {
        // Check if we have any workspace users, else fetch them
        if (!this.loadingUsers) this.fetchUsers()
        // Check if we have any workspace teams, else fetch them
        if (!this.loadingTeams) this.fetchTeams()
    }
}
</script>

<style>

</style>