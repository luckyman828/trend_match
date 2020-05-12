<template>
    <div class="teams-table">

        <BaseFlexTable v-if="currentTab == 'Teams'" stickyHeader="true"
        :contentStatus="readyStatus"
        loadingMsg="loading teams"
        errorMsg="error loading teams"
        :errorCallback="() => initData()">
            <template v-slot:tabs>
                <BaseTableTabs :tabs="['Teams','Users']" v-model="currentTab" :activeTab="currentTab"/>
            </template>
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <BaseSearchField :searchKey="['title']" :arrayToSearch="teams" v-model="teamsFilteredBySearch"/>
                    </template>
                    <template v-slot:right>
                        <span>showing <strong>{{teamsFilteredBySearch.length}}</strong> of <strong>{{teams.length}}</strong> records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select">
                    <BaseCheckbox :value="selectedTeams.length > 0" :modelValue="true" 
                    @change="(checked) => checked ? selectedTeams = teams : selectedTeams = []"/>
                </BaseTableHeader>
                <BaseTableHeader :sortKey="'title'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams">Name</BaseTableHeader>
                <!-- <BaseTableHeader :sortKey="'owner'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams">Owner</BaseTableHeader> -->
                <BaseTableHeader :sortKey="'users'" :currentSortKey="sortKey" :sortAsc="sortAsc" :descDefault="true" @sort="sortTeams">Members</BaseTableHeader>
                <!-- <BaseTableHeader :sortKey="'files'" :currentSortKey="sortKey" :sortAsc="sortAsc" :descDefault="true" @sort="sortTeams">Files</BaseTableHeader> -->
                <BaseTableHeader :sortKey="'currency'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams">Team Currency</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <TeamsTableRow :ref="'teamRow-'+team.id" v-for="team in teamsFilteredBySearch" :key="team.id" :team="team" :contextTeam="contextTeam"
                @showContextMenu="showTeamContext($event, team)" @showSingle="showSingleTeam" @editCurrency="onEditTeamCurrency($event, team)"
                @cancelEditTitle="removeUnsavedTeam" v-model="selectedTeams" :selectedTeams="selectedTeams"/>
            </template>
            <template v-slot:footer>
                <td>
                    <BaseButton :buttonClass="'primary invisible'"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can create teams'"
                    @click="onNewTeam">
                        <i class="far fa-plus"></i><span>Add new: Team</span>
                    </BaseButton>
                </td>
            </template>
        </BaseFlexTable>

        <TeamFlyin :show="teamFlyInVisible" @close="teamFlyInVisible = false"
        v-if="teamFlyInVisible && currentTeam" :team="currentTeam"/>

        <BaseContextMenu ref="contextMenuTeam" class="context-team" v-slot="slotProps"
        :hotkeys="['KeyV', 'KeyE', 'KeyR', 'KeyC', 'KeyD']"
        @keybind-v="showSingleTeam(contextTeam)"
        @keybind-e="showSingleTeam(contextTeam)"
        @keybind-r="$refs['teamRow-'+contextTeam.id][0].editTitle = true"
        @keybind-c="onEditTeamCurrency(contextMouseEvent, contextTeam)"
        @keybind-d="onDeleteTeam(contextTeam)"
        >
            <div class="item-group">
                <div class="item" @click="showSingleTeam(contextTeam)">
                    <div class="icon-wrapper">
                        <i class="far fa-users"></i>
                    </div>
                    <span><u>V</u>iew / <u>E</u>dit team</span>
                </div>
            </div>
            <div class="item-group">
                <BaseContextMenuItem :iconClass="'far fa-pen'"
                :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can rename teams'"
                @click="$refs['teamRow-'+contextTeam.id][0].editTitle = true">
                    <span><u>R</u>ename</span>
                </BaseContextMenuItem>
                <BaseContextMenuItem :iconClass="'far fa-usd-circle'"
                :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can change team currency'"
                @click.stop="onEditTeamCurrency(slotProps.mouseEvent, contextTeam)">
                    <span><u>C</u>hange currency</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem :iconClass="'far fa-trash-alt'"
                :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can delete teams'"
                @click="onDeleteTeam(contextTeam)">
                    <span><u>D</u>elete team</span>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuSelectedTeams"
        :hotkeys="['KeyC', 'KeyD']"
        @keybind-c="onEditTeamCurrency(contextMouseEvent, selectedTeams[0])"
        @keybind-d="onDeleteTeams">
            <template v-slot:header>
                <span>Choose action for {{selectedTeams.length}} teams</span>
            </template>
            <template v-slot="slotProps">

                <BaseContextMenuItem :iconClass="'far fa-times'"
                @click="selectedTeams = []">
                    <span>Clear selection</span>
                </BaseContextMenuItem>
                <div class="item-group">
                    <BaseContextMenuItem :iconClass="'far fa-usd-circle'"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can change team currency'"
                    @click.stop="onEditTeamCurrency(slotProps.mouseEvent, contextTeam)">
                        <span><u>C</u>hange currency</span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem :iconClass="'far fa-trash-alt'"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can delete teams'"
                    @click="onDeleteTeams">
                        <span><u>D</u>elete teams</span>
                    </BaseContextMenuItem>
                </div>
            </template>
        </BaseContextMenu>

        <BaseSelectButtonsContextMenu ref="contextMenuTeamCurrency" v-if="teamToEdit"
        header="Change Team Currency" v-model="teamToEdit.currency" type="radio"
        :options="availableCurrencies" :search="true" unsetOption="Clear" :unsetValue="null"
        @submit="onUpdateTeamsCurrency"/>

    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import TeamsTableRow from './TeamsTableRow'
import TeamFlyin from './TeamFlyin'
import sortArray from '../../mixins/sortArray'

export default {
    name: 'teamsTable',
    props: [
        'authUser',
    ],
    mixins: [
        sortArray
    ],
    components: {
        TeamsTableRow,
        TeamFlyin,
    },
    data: function() { return {
        sortKey: 'id',
        sortAsc: true,
        teamToEdit: {
            id: '',
            title: ''
        },
        defaultTeamToEdit: {
            id: '',
            title: ''
        },
        teamsFilteredBySearch: [],
        selectedTeams: [],
        teamFlyInVisible: false,
        contextTeam: null,
        contextMouseEvent: null,
    }},
    computed: {
        ...mapGetters('persist', ['availableCurrencies']),
        ...mapGetters('workspaces', ['currentWorkspace', 'availableWorkspaceRoles', 'authUserWorkspaceRole']),
        ...mapGetters('teams', ['currentTeam', 'getTeamsStatus', 'teams']),
        ...mapGetters('users', ['getUsersStatus', 'users']),
        readyStatus() {
            if (this.getUsersStatus == 'error' || this.getTeamsStatus == 'error') return 'error'
            if (this.getUsersStatus == 'loading' || this.getTeamsStatus == 'loading') return 'loading'
            return 'success'
        },
        currentTab: {
            get () {
                const routeName = this.$route.name
                if (routeName == 'teams') return 'Teams'
                if (routeName == 'users') return 'Users'
            },
            set (newVal) {
                if (newVal == 'Teams') this.$router.push({name: 'teams'})
                if (newVal == 'Users') this.$router.push({name: 'users'})
            }
        },
        teamFlyinStatus() {
            return 'success'
        },
    },
    watch: {
        getTeamsStatus: function(newVal, oldVal) {
            if (newVal == 'success') this.teamsFilteredBySearch = this.teams
        },
        currentWorkspace(newVal, oldVal) {
            this.initData(true)
        }
    },
    methods: {
        ...mapActions('teams', ['insertOrUpdateTeam', 'deleteTeam', 'removeUserFromTeam', 'fetchTeams']),
        ...mapMutations('teams', ['SET_CURRENT_TEAM', 'setAvailableTeams']),
        ...mapActions('users', ['fetchUsers']),
        async initData(forceRefresh) {
            // If we have not and are not fetching the users then fetch them
            if (forceRefresh || (this.getUsersStatus != 'success' && this.getUsersStatus != 'loading')) await this.fetchUsers()
            if (forceRefresh || (this.getTeamsStatus != 'success' && this.getTeamsStatus != 'loading')) await this.fetchTeams()
            // Initially set the filteredbySearch arrays
            if (this.getTeamsStatus == 'success') this.teamsFilteredBySearch = this.teams
        },
        onEditTeamCurrency(mouseEvent, team) {
            this.teamToEdit = team;
            this.contextTeam = team
            // Wait for the context menu to show in the DOM
            this.$nextTick(() => {
                const contextMenu = this.$refs.contextMenuTeamCurrency
                contextMenu.item = team
                contextMenu.show(mouseEvent)
            })
        },
        removeUnsavedTeam() {
            // Check that we have a new team
            const existingNewTeam = this.teams.find(x => x.id == null)
            if (existingNewTeam) {
                this.teams.pop()
            }
        },
        onNewTeam() {
            // Check if we already have added a new team
            const existingNewTeam = this.teams.find(x => x.id == null)
            // If we already have a new folder, foxus the edit title field
            if (existingNewTeam) {
                // Focus the edit field
                this.$nextTick(() => {
                    if (this.$refs['teamRow-null'][0].editTitle = true) {
                        this.$refs['teamRow-null'][0].$refs['editTitle'].setActive()
                    } else {
                        this.$refs['teamRow-null'][0].editTitle = true
                    }
                })
            }
            // Else create a new team
            else {
                const newTeam = {
                    id: null,
                    title: 'New team',
                    owner: null,
                    user_count: 0,
                    currency: null,
                }
                // Push new new to the current teams array
                this.teams.push(newTeam)

                // wait for the new team to be rendered
                this.$nextTick(() => {
                    // Activate title edit of new folder
                    this.$refs['teamRow-null'][0].editTitle = true
                })
            }
            
        },
        showSingleTeam(team) {
            this.setAvailableTeams(this.teams)
            this.SET_CURRENT_TEAM(team)
            this.teamFlyInVisible = true
        },
        showTeamContext(e, team) {
            // If we have a selection, show context menu for that selection instead
            let contextMenu
            if (this.selectedTeams.length > 1) {
                contextMenu = this.$refs.contextMenuSelectedTeams
            } else {
                contextMenu = this.$refs.contextMenuTeam
            }
            this.contextTeam = this.selectedTeams.length > 0 ? this.selectedTeams[0] : team
            this.contextMouseEvent = e
            contextMenu.show(e)
        },
        onDeleteTeam(team) {
            if (window.confirm('Are you sure you want to delete this team?\nIt will be permanently deleted.')) {
                this.deleteTeam(team)
                this.selectedTeams = []
            } 
        },
        onDeleteTeams() {
            if (window.confirm(`Are you sure you want to delete ${this.selectedTeams.length} teams?\nIt will be permanently deleted.`)) {
                this.selectedTeams.forEach(team => {
                    this.deleteTeam(team)
                    this.selectedTeams = []
                })
            }
        },
        onUpdateTeamsCurrency() {
            // Define the team to base the new currency to set on
            const baseTeam = this.teamToEdit
            // Check if we have a selection of users
            // If so, set the currency for all the selected users
            let teamsToPost
            if (this.selectedTeams.length > 0) {
                teamsToPost = this.selectedTeams.map(team => {
                    team.currency = baseTeam.currency
                    return team
                })
            } else teamsToPost = [baseTeam]
            // Update all teams
            teamsToPost.forEach(team => {
                this.insertOrUpdateTeam(team)
            })
        },
        sortTeams(method, key) {
            this.onSortArray(this.teams, method, key)
        },
        onSortArray(array, method, key) {
            // If if we are already sorting by the given key, flip the sort order
            if (this.sortKey == key) {
                this.sortAsc = !this.sortAsc
            }
            else {
                this.sortKey = key
                this.sortAsc = method
            }
            let sortAsc = this.sortAsc

            this.sortArray(array, this.sortAsc, this.sortKey)
        }
    },
    created() {
        this.initData()
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .teams-table {
        ::v-deep {
            td, th {
                &.title {
                    min-width: 248px;
                    max-width: 248px;
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
</style>
