<template>
    <div class="teams-table">

        <BaseFlexTable v-if="currentTab == 'Teams'" stickyHeader="true">
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
                <TeamsTableRow :ref="'teamRow-'+team.id" v-for="team in teamsFilteredBySearch" :key="team.id" :team="team"
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

        <BaseFlyin ref="TeamFlyin" :show="teamFlyInVisible" @close="teamFlyInVisible = false">
            <template v-slot:header v-if="currentTeam && teamFlyInVisible">
                <BaseFlyinHeader @close="teamFlyInVisible = false" class="flyin-header" 
                :next="nextTeam" :prev="prevTeam"
                @next="showNext" @prev="showPrev">
                    <template v-slot:left>
                        <h3>{{currentTeam.title}}</h3>
                    </template>
                </BaseFlyinHeader>
            </template>
            <template v-slot v-if="currentTeam && teamFlyInVisible">
                <TeamFlyin :team="currentTeam" :workspaceUsers="users"/>
            </template>
        </BaseFlyin>

        <BaseContextMenu ref="contextMenuTeam" class="context-team" v-slot="slotProps">
            <div class="item-group">
                <div class="item" @click="showSingleTeam(slotProps.item); slotProps.hide()">
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
                @click="$refs['teamRow-'+slotProps.item.id][0].editTitle = true">
                    <span><u>R</u>ename</span>
                </BaseContextMenuItem>
                <BaseContextMenuItem :iconClass="'far fa-usd-circle'"
                :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can change team currency'"
                @click.stop="onEditTeamCurrency(slotProps.mouseEvent, slotProps.item)">
                    <span><u>C</u>hange currency</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem :iconClass="'far fa-trash-alt'"
                :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can delete teams'"
                @click="onDeleteTeam(slotProps.item)">
                    <span><u>D</u>elete team</span>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuTeamCurrency" class="context-currency">
            <template v-slot:header>
                Change Team Currency
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseRadioButtons ref="teamCurrencySelector" :options="availableCurrencies" 
                    :currentOptionId="originalTeam.currency" :search="true" v-model="teamToEdit.currency" :submitOnChange="true"/>
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button class="primary" :disabled="teamToEdit.currency == originalTeam.currency"
                        @click="insertOrUpdateTeam(teamToEdit);slotProps.hide()">
                            <span>Save</span>
                        </button>
                        <button class="invisible invisible ghost" style="margin-left: 8px;"
                        @click="slotProps.hide()">
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

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
        'teams',
        'authUser',
        'users',
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
        originalTeam: null,
        teamsFilteredBySearch: [],
        selectedTeams: [],
        teamFlyInVisible: false,
    }},
    computed: {
        ...mapGetters('persist', ['availableCurrencies']),
        ...mapGetters('workspaces', ['currentWorkspace', 'availableWorkspaceRoles', 'authUserWorkspaceRole']),
        ...mapGetters('teams', ['currentTeam', 'nextTeam', 'prevTeam']),
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
        }
    },
    methods: {
        ...mapActions('teams', ['removeUserFromTeam']),
        ...mapActions('teams', ['insertOrUpdateTeam', 'deleteTeam']),
        ...mapMutations('teams', ['setCurrentTeam', 'setAvailableTeams']),
        showNext() {
            if (this.nextTeam)
                this.setCurrentTeam(this.nextTeam)
        },
        showPrev() {
            if (this.prevTeam)
                this.setCurrentTeam(this.prevTeam)
        },
        onEditTeamCurrency(mouseEvent, team) {
            const contextMenu = this.$refs.contextMenuTeamCurrency
            contextMenu.item = team;
            this.teamToEdit = team;
            this.originalTeam = JSON.parse(JSON.stringify(team));
            contextMenu.show(mouseEvent)
            // Wait for the context menu to show in the DOM
            this.$nextTick(() => {
                // Set focus to the search field
                this.$refs.teamCurrencySelector.focusSearch()
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
            this.setCurrentTeam(team)
            this.teamFlyInVisible = true
        },
        showTeamContext(e, team) {
            const contextMenu = this.$refs.contextMenuTeam
            contextMenu.item = team
            contextMenu.show(e)
        },
        onDeleteTeam(team) {
            (window.confirm(
                'Are you sure you want to delete this team?\nIt will be permanently deleted.'))
            ? this.deleteTeam(team) : false
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
    updated() {
        // Set the filteredbySearch arrays if we have a change
        this.teamsFilteredBySearch = this.teams
    },
    mounted() {
        // Initially set the filteredbySearch arrays
        this.teamsFilteredBySearch = this.teams
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
