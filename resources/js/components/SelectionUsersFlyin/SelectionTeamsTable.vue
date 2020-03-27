<template>
    <div class="selection-teams-table">
        <BaseFlexTable :stickyHeader="false">
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <h3>Selection Teams</h3>
                    </template>
                    <template v-slot:right>
                        <span>{{selection.teams.length}} records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select">
                    <BaseCheckbox :value="selected.length > 0" :modelValue="true" 
                    @change="(checked) => checked ? selected = selection.teams : selected = []"/>
                </BaseTableHeader>
                <BaseTableHeader class="name" :sortKey="'title'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams">Name</BaseTableHeader>
                <BaseTableHeader :sortKey="'users'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams">Users</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <tr v-for="(team, index) in selection.teams" :key="team.id" class="team-row table-row" ref="teamRow"
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

        <BaseContextMenu ref="contextMenuTeam" class="context-team"
        :hotkeys="['KeyR']"
        @keybind-r="onRemoveTeams(contextTeam)">
            <template v-slot:header v-if="selected.length > 0">
                <span>Choose action for {{selected.length}} teams</span>
            </template>
            <div class="item-group">
                <div class="item" @click="onRemoveTeams(contextTeam)">
                    <div class="icon-wrapper"><i class="far fa-trash-alt"></i></div>
                    <u>R</u>emove Team{{selected.length > 1 ? 's' : ''}}
                </div>
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
    props: [
        'selection'
    ],
    mixins: [
        sortArray
    ],
    data: function() { return {
        sortKey: null,
        sortAsc: true,
        selected: [],
        teamsToAdd: [],
        contextTeam: null,
    }},
    computed: {
        ...mapGetters('teams', ['teams']),
        ...mapGetters('selections', ['getAuthUserHasSelectionEditAccess']),
        userHasEditAccess() {
            return this.getAuthUserHasSelectionEditAccess(this.selection)
        },
        availableTeams() {
            const allTeams = this.teams
            // return allTeams
            // Filter the available teams to exclude teams already added
            return allTeams.filter(team => !this.selection.teams.find(x => x.id == team.id))
        }
    },
    methods: {
        ...mapActions('selections', ['addTeamsToSelection','removeTeamsFromSelection', 'updateSelection']),
        ...mapActions('teams', ['fetchTeamUsers']),
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
        },
    }
}
</script>

<style scoped lang="scss">
</style>