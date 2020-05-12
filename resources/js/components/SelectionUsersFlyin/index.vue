<template>
    <BaseFlyin ref="flyin" :show="show" :status="status"
    @close="$emit('close')"
    loadingMsg="loading selection members"
    erorrMsg="error loading selection members"
    :errorCallback="() => fetchData()">
        <template v-slot:header>
            <BaseFlyinHeader v-if="show" disableNavigation=true 
            @close="$emit('close')">
                <template v-slot:left>
                    <h3>Selection Users: {{selection.name}}</h3>
                </template>
            </BaseFlyinHeader>
        </template>
        <template v-slot>
            <SelectionTeamsTable :selection="selection" :authUserIsOwner="authUserIsOwner"/>
            <SelectionUsersTable style="margin-top: 40px;" :selection="selection" :users="selection.users"
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
        ...mapGetters('users', ['users', 'getUsersStatus']),
        ...mapGetters('teams', ['teams', 'getTeamsStatus']),
        ...mapGetters('selections', ['currentSelectionUsers', 'currentSelectionStatus']),
        status() {
            if (this.getUsersStatus == 'error' || this.getTeamsStatus == 'error' || this.currentSelectionStatus == 'error') return 'error'
            if (this.getUsersStatus == 'loading' || this.getTeamsStatus == 'loading' || this.currentSelectionStatus == 'error' || this.fetchingData) return 'loading'
            return 'success'
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
        if (this.getUsersStatus != 'success' && this.getUsersStatus != 'loading') this.fetchUsers()
        // Check if we have any workspace teams, else fetch them
        if (this.getTeamsStatus != 'success' && this.getTeamsStatus != 'loading') this.fetchTeams()
    }
}
</script>

<style>

</style>