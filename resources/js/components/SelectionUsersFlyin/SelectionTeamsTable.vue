<template>
    <div class="selection-teams-table">
        <h3>Selection Teams</h3>
        <BaseFlexTable :stickyHeader="false"
        :contentStatus="readyStatus"
        loadingMsg="loading teams"
        errorMsg="error loading teams"
        :errorCallback="() => initData()">
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <!-- <h3>Selection Teams</h3> -->
                        <BaseSearchField :searchKey="['title']" :arrayToSearch="selection.teams" v-model="teamsFilteredBySearch"/>
                    </template>
                    <template v-slot:right>
                        <span>showing {{teamsFilteredBySearch.length}} of {{selection.teams ? selection.teams.length : 0}} records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select">
                    <BaseCheckbox :value="selected.length > 0" :modelValue="true" 
                    @change="(checked) => checked ? selected = teamsFilteredBySearch : selected = []"/>
                </BaseTableHeader>
                <BaseTableHeader class="name" :sortKey="'title'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams">Name</BaseTableHeader>
                <BaseTableHeader :sortKey="'users'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams">Users</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <tr v-for="(team, index) in teamsFilteredBySearch" :key="team.id" class="team-row table-row" ref="teamRow" :class="{active: contextMenuIsActive(team)}"
                @click.ctrl="$refs.selectBox[index].check()"
                @contextmenu="showTeamContext($event, team)">
                    <td class="select"><BaseCheckbox ref="selectBox" :value="team" v-model="selected"/></td>
                    <td class="title">
                        <i class="fas fa-users"></i>
                        <span>{{team.title}}</span>
                    </td>
                    <td class="users">
                        <span>{{team.user_count}}</span>
                    </td>
                    <td class="action">
                        <button class="invisible ghost-hover" v-if="userHasEditAccess" 
                        @click="showTeamContext($event, team)">
                            <i class="far fa-ellipsis-h medium"></i>
                        </button>
                    </td>
                </tr>
            </template>
            <template v-slot:footer>
                <td><BaseButton buttonClass="primary invisible" :disabled="!userHasEditAccess"
                v-tooltip="!userHasEditAccess && 'Only admins can add users to selections'"
                @click="onAddTeam($event)">
                    <i class="far fa-plus"></i><span>Add Teams(s) to Selection</span>
                </BaseButton></td>
            </template>
        </BaseFlexTable>

        <BaseContextMenu ref="contextMenuTeam" class="context-team">
            <template v-slot:header v-if="selected.length > 1">
                <span>Choose action for {{selected.length}} teams</span>
            </template>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-trash-alt"
                hotkey="KeyR"
                @click="onRemoveTeams(contextTeam)">
                    <u>R</u>emove Team{{selected.length > 1 ? 's' : ''}}
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseSelectButtonsContextMenu ref="contextMenuAddTeams" header="Add Team(s) to Selection" 
        v-model="teamsToAdd" :options="availableTeams" :submitDisabled="teamsToAdd.length < 1"
        :emitOnChange="true" optionNameKey="title" :search="true"
        :submitText="`Add ${teamsToAdd.length} team${teamsToAdd.length > 1 ? 's' : ''}`"
        @submit="onAddTeamsToSelection(teamsToAdd);teamsToAdd = []" @cancel="teamsToAdd = []"/>

        <!-- <BaseContextMenu ref="contextMenuAddTeams" class="context-add-teams">
            <template v-slot:header>
                Add Team(s) to Selection
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons :type="'checkbox'" :options="availableTeams"
                    v-model="teamsToAdd" :submitOnChange="true"
                    :optionNameKey="'title'" :search="true"/>
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button class="primary" :class="{disabled: teamsToAdd.length < 1}" style="margin-right: 8px;" 
                        @click="onAddTeamsToSelection(teamsToAdd);teamsToAdd = [];slotProps.hide()">
                            <span>Add <template v-if="teamsToAdd.length > 0">{{teamsToAdd.length}} 
                            </template>team<template v-if="teamsToAdd.length > 1">s</template></span></button>
                        <button class="invisible ghost-hover" @click="slotProps.hide(); teamsToAdd = []"><span>Cancel</span></button>
                    </div>
                </div>
            </template>
        </BaseContextMenu> -->
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import sortArray from '../../mixins/sortArray'

export default {
    name: 'selectionTeamsTable',
    mixins: [
        sortArray
    ],
    data: function() { return {
        sortKey: null,
        sortAsc: true,
        selected: [],
        teamsToAdd: [],
        contextTeam: null,
        authUserIsOwner: false,
        teamsFilteredBySearch: [],
    }},
    computed: {
        ...mapGetters('teams', ['teams', 'getTeamsStatus']),
        ...mapGetters('selections', {
            selection: 'getCurrentSelection',
            getAuthUserHasSelectionEditAccess: 'getAuthUserHasSelectionEditAccess',
            getSelectionTeamsStatus: 'getSelectionTeamsStatus'
        }),
        ...mapGetters('contextMenu', ['getContextMenuIsVisible']),
        readyStatus() {
            if (this.getTeamsStatus == 'error' || this.getSelectionTeamsStatus == 'error') return 'error'
            if (this.getTeamsStatus == 'loading' || this.getSelectionTeamsStatus == 'error') return 'loading'
            return 'success'
        },
        userHasEditAccess() {
            return this.getAuthUserHasSelectionEditAccess(this.selection) || this.authUserIsOwner
        },
        availableTeams() {
            if (!this.selection.teams) return []
            const allTeams = this.teams
            // Filter the available teams to exclude teams already added
            return allTeams.filter(team => !this.selection.teams.find(x => x.id == team.id))
        }
    },
    watch: {
        // selection
    },
    methods: {
        ...mapActions('selections', ['addTeamsToSelection','removeTeamsFromSelection', 'updateSelection', 'fetchSelection']),
        ...mapActions('teams', ['fetchTeamUsers', 'fetchTeams']),
        initData(forceRefresh) {
            // Check if we have any workspace teams, else fetch them
            if (this.getTeamsStatus != 'success' && this.getTeamsStatus != 'loading') this.fetchTeams()

            // Fetch selection with users and teams
            if (forceRefresh || (this.getSelectionTeamsStatus != 'loading' && !this.selection.teams)) {
                this.fetchSelection({selectionId: this.selection.id, addToState: false})
            }
            this.authUserIsOwner = this.selection.your_role == 'Owner'
        },
        contextMenuIsActive (team) {
            return this.getContextMenuIsVisible && this.contextTeam && this.contextTeam.id == team.id && this.selected.length <= 1
        },
        showTeamContext(e, team) {
            if (!this.userHasEditAccess) return
            e.preventDefault()
            const contextMenu = this.$refs.contextMenuTeam
            this.contextTeam = this.selected.length > 0 ? this.selected[0] : team
            contextMenu.show(e)
        },
        onAddTeam(e) {
            const contextMenu = this.$refs.contextMenuAddTeams
            contextMenu.show(e)
        },
        async onAddTeamsToSelection(teams) {
            // If it is the first team added to the selection and the selection doesnt already have a currency set
            // -> set the selection currency = the team currency
            if (this.selection.teams.length <= 0 && !this.selection.currency && !!teams[0].currency) {
                this.selection.currency = teams[0].currency
                this.updateSelection(this.selection)
            }
            // Add the team to the selection
            this.addTeamsToSelection({selection: this.selection, teams})
        },
        sortTeams(method, key) {
            // If if we are already sorting by the given key, flip the sort order
            if (this.sortKey == key) {
                this.sortAsc = !this.sortAsc
            }
            else {
                this.sortKey = key
                this.sortAsc = method
            }
            let sortAsc = this.sortAsc

            this.sortArray(this.selection.teams, this.sortAsc, this.sortKey)
        },
        onRemoveTeams(team) {
            // If we have a selection, loop through the selection and remove those
            // Else, remove the parsed team
            let teamsToRemove
            if (this.selected.length > 0) {
                teamsToRemove = JSON.parse(JSON.stringify(this.selected))
            } else {
                teamsToRemove = [team]
            }
            this.removeTeamsFromSelection({selection: this.selection, teams: teamsToRemove})
            this.selected = []
        },
    },
    created() {
        this.initData()
    }
}
</script>

<style scoped lang="scss">
</style>