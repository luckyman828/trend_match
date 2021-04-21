<template>
    <div class="teams-table">
        <BaseTable
            v-if="currentTab == 'Teams'"
            stickyHeader="true"
            ref="tableComp"
            :contentStatus="readyStatus"
            :errorCallback="() => initData()"
            loadingMsg="loading teams"
            errorMsg="error loading teams"
            :items="teams"
            itemKey="id"
            :itemSize="50"
            :selected.sync="selectedTeams"
            :contextItem.sync="contextTeam"
            :contextMouseEvent.sync="contextMouseEvent"
            :searchKey="'title'"
            :searchResult.sync="teamsFilteredBySearch"
            :useVirtualScroller="false"
            @show-contextmenu="showTeamContext"
        >
            <template v-slot:tabs>
                <BaseTableTabs :tabs="['Teams', 'Users']" v-model="currentTab" :activeTab="currentTab" />
            </template>
            <template v-slot:header>
                <!-- <BaseTableHeader class="select">
                    <BaseCheckbox :value="selectedTeams.length > 0" :modelValue="true" 
                    @change="(checked) => checked ? selectedTeams = teams : selectedTeams = []"/>
                </BaseTableHeader> -->
                <BaseTableHeader :sortKey="'title'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams"
                    >Name</BaseTableHeader
                >
                <!-- <BaseTableHeader :sortKey="'owner'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams">Owner</BaseTableHeader> -->
                <BaseTableHeader
                    :sortKey="'user_count'"
                    :currentSortKey="sortKey"
                    :sortAsc="sortAsc"
                    :descDefault="true"
                    @sort="sortTeams"
                    >Members</BaseTableHeader
                >
                <!-- <BaseTableHeader :sortKey="'files'" :currentSortKey="sortKey" :sortAsc="sortAsc" :descDefault="true" @sort="sortTeams">Files</BaseTableHeader> -->
                <BaseTableHeader :sortKey="'currency'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams"
                    >Team Currency</BaseTableHeader
                >
                <BaseTableHeader class="action" />
            </template>
            <template v-slot:row="rowProps">
                <TeamsTableRow
                    :team="rowProps.item"
                    :ref="'teamRow-' + rowProps.item.id"
                    @showSingle="showSingleTeam"
                    @edit-currency="onEditTeamCurrency"
                    @cancelEditTitle="removeUnsavedTeam"
                />
            </template>
            <template v-slot:footer>
                <td>
                    <BaseButton
                        :buttonClass="'primary invisible ghost-hover'"
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can create teams'"
                        @click="onNewTeam"
                    >
                        <i class="far fa-plus"></i><span>Add team</span>
                    </BaseButton>
                </td>
            </template>
        </BaseTable>

        <TeamFlyin :show="teamFlyInVisible" @close="teamFlyInVisible = false" />

        <BaseContextMenu ref="contextMenuTeam" class="context-team" v-slot="slotProps">
            <div class="item-group">
                <BaseContextMenuItem
                    iconClass="far fa-users"
                    :hotkey="['KeyV', 'KeyE']"
                    @click="showSingleTeam(contextTeam)"
                >
                    <span><u>V</u>iew / <u>E</u>dit team</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem
                    :iconClass="'far fa-pen'"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    disabledTooltip="Only admins can rename teams"
                    hotkey="KeyR"
                    @click="$refs['teamRow-' + contextTeam.id].editTitle = true"
                >
                    <span><u>R</u>ename</span>
                </BaseContextMenuItem>

                <BaseContextMenuItem
                    :iconClass="'far fa-usd-circle'"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    disabledTooltip="Only admins can change team currency"
                    hotkey="KeyC"
                    @click="onEditTeamCurrency(contextMouseEvent, contextTeam)"
                >
                    <span><u>C</u>hange currency</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem
                    :iconClass="'far fa-trash-alt'"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    disabledTooltip="Only admins can delete teams"
                    hotkey="KeyD"
                    @click="onDeleteTeam(contextTeam)"
                >
                    <span><u>D</u>elete team</span>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuSelectedTeams">
            <template v-slot:header>
                <span>Choose action for {{ selectedTeams.length }} teams</span>
            </template>
            <template v-slot="slotProps">
                <BaseContextMenuItem iconClass="far fa-times" hotkey="KeyL" @click="selectedTeams = []">
                    <span>C<u>l</u>ear selection</span>
                </BaseContextMenuItem>
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-usd-circle"
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        disabledTooltip="Only admins can change team currency"
                        hotkey="KeyC"
                        @click="onEditTeamCurrency(contextMouseEvent, contextTeam)"
                    >
                        <span><u>C</u>hange currency</span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem
                        :iconClass="'far fa-trash-alt'"
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        disabledTooltip="Only admins can delete teams"
                        hotkey="KeyD"
                        @click="onDeleteTeams"
                    >
                        <span><u>D</u>elete teams</span>
                    </BaseContextMenuItem>
                </div>
            </template>
        </BaseContextMenu>

        <BaseSelectButtonsContextMenu
            ref="contextMenuTeamCurrency"
            v-if="teamToEdit"
            header="Change Team Currency"
            v-model="teamToEdit.currency"
            type="radio"
            :allowManualEntry="true"
            :options="availableCurrencies"
            :search="true"
            unsetOption="Clear"
            :unsetValue="null"
            @submit="onUpdateTeamsCurrency"
        />

        <BaseDialog
            ref="confirmDeleteMultipleTeams"
            type="confirm"
            confirmColor="red"
            confirmText="Yes, delete them"
            cancelText="No, keep them"
        >
            <div class="icon-graphic">
                <i class="lg primary far fa-users"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-trash"></i>
            </div>
            <h3>Are you sure you want to delete {{ selectedTeams.length }} teams?</h3>
            <p>They will be permanently deleted.</p>
        </BaseDialog>

        <BaseDialog
            ref="confirmDeleteTeam"
            type="confirm"
            confirmColor="red"
            confirmText="Yes, delete it"
            cancelText="No, keep it"
        >
            <div class="icon-graphic">
                <i class="lg primary far fa-users"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-trash"></i>
            </div>
            <h3>Are you sure you want to delete this team?</h3>
            <p>It will be permanently deleted.</p>
        </BaseDialog>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import TeamsTableRow from './TeamsTableRow'
import TeamFlyin from './TeamFlyin'
import sortArray from '../../mixins/sortArray'

export default {
    name: 'teamsTable',
    props: ['authUser'],
    mixins: [sortArray],
    components: {
        TeamsTableRow,
        TeamFlyin,
    },
    data: function() {
        return {
            sortKey: 'id',
            sortAsc: true,
            teamToEdit: {
                id: '',
                title: '',
            },
            defaultTeamToEdit: {
                id: '',
                title: '',
            },
            teamsFilteredBySearch: [],
            selectedTeams: [],
            teamFlyInVisible: false,
            contextTeam: null,
            contextMouseEvent: null,
        }
    },
    computed: {
        ...mapGetters('persist', ['availableCurrencies']),
        ...mapGetters('workspaces', ['currentWorkspace', 'availableWorkspaceRoles', 'authUserWorkspaceRole']),
        ...mapGetters('teams', ['currentTeam', 'getTeamsStatus', 'teams']),
        ...mapGetters('users', ['getUsersStatus', 'users']),
        ...mapGetters('tables', ['getTeamsTable']),
        readyStatus() {
            if (this.getUsersStatus == 'error' || this.getTeamsStatus == 'error') return 'error'
            if (this.getUsersStatus == 'loading' || this.getTeamsStatus == 'loading') return 'loading'
            return 'success'
        },
        currentTab: {
            get() {
                const routeName = this.$route.name
                if (routeName == 'teams') return 'Teams'
                if (routeName == 'users') return 'Users'
            },
            set(newVal) {
                if (newVal == 'Teams') this.$router.push({ name: 'teams' })
                if (newVal == 'Users') this.$router.push({ name: 'users' })
            },
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
        },
    },
    methods: {
        ...mapActions('teams', ['insertOrUpdateTeam', 'deleteTeam', 'removeUserFromTeam', 'fetchTeams']),
        ...mapMutations('teams', ['SET_CURRENT_TEAM', 'setAvailableTeams']),
        ...mapMutations('tables', ['SET_TABLE_PROPERTY']),
        ...mapActions('users', ['fetchUsers']),
        async initData(forceRefresh) {
            // If we have not and are not fetching the users then fetch them
            if (forceRefresh || (this.getUsersStatus != 'success' && this.getUsersStatus != 'loading'))
                await this.fetchUsers()
            if (forceRefresh || (this.getTeamsStatus != 'success' && this.getTeamsStatus != 'loading'))
                await this.fetchTeams()
            // Initially set the filteredbySearch arrays
            if (this.getTeamsStatus == 'success') this.teamsFilteredBySearch = this.teams
            this.SET_TABLE_PROPERTY('teamsTable', 'workspaceId', this.currentWorkspace.id)
        },
        onEditTeamCurrency(mouseEvent, team) {
            this.teamToEdit = team
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
            const existingNewTeam = this.teams.find(x => !x.id)
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
                    if (this.$refs['teamRow-0'].editTitle == true) {
                        this.$refs['teamRow-0'].$refs['editTitle'].setActive()
                    } else {
                        this.$refs['teamRow-0'].editTitle = true
                    }
                })
            }
            // Else create a new team
            else {
                const newTeam = {
                    id: 0,
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
                    this.$refs['teamRow-0'].editTitle = true
                })
            }
        },
        showSingleTeam(team) {
            this.setAvailableTeams(this.teams)
            this.SET_CURRENT_TEAM(team)
            this.teamFlyInVisible = true
        },
        showTeamContext(e) {
            // If we have a selection, show context menu for that selection instead
            let contextMenu
            if (this.selectedTeams.length > 1) {
                contextMenu = this.$refs.contextMenuSelectedTeams
            } else {
                contextMenu = this.$refs.contextMenuTeam
            }
            contextMenu.show(e)
        },
        async onDeleteTeam(team) {
            if (await this.$refs.confirmDeleteTeam.confirm()) {
                this.deleteTeam(team)
                this.selectedTeams = []
            }
        },
        async onDeleteTeams() {
            if (await this.$refs.confirmDeleteMultipleTeams.confirm()) {
                for (let i = this.selectedTeams.length - 1; i >= 0; i--) {
                    const team = this.selectedTeams[i]
                    this.deleteTeam(team)
                }
                this.selectedTeams = []
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
            } else {
                this.sortKey = key
                this.sortAsc = method
            }

            this.sortArray(array, this.sortAsc, this.sortKey, true)
        },
        hotkeyHandler(e) {
            const key = e.code
            if (e.target.type == 'textarea' || e.target.tagName.toUpperCase() == 'INPUT' || this.singleVisible) return // Don't mess with user input

            if (key == 'KeyS') {
                this.$refs.tableComp.focusSearch()
                // this.$refs.searchField.setFocus()
                e.preventDefault() // Avoid entering an "s" in the search field
            }
        },
    },
    created() {
        const forceRefresh = this.getTeamsTable.workspaceId != this.currentWorkspace.id
        this.initData(forceRefresh)
        document.addEventListener('keydown', this.hotkeyHandler)
    },
    destroyed() {
        document.removeEventListener('keydown', this.hotkeyHandler)
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.teams-table {
    ::v-deep {
        td,
        th {
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
