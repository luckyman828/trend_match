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
                <BaseTableHeader class="select"><BaseCheckbox/></BaseTableHeader>
                <BaseTableHeader class="name" :sortKey="'title'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams">Name</BaseTableHeader>
                <BaseTableHeader :sortKey="'users'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams">Users</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <tr v-for="team in selection.teams" :key="team.id" class="team-row table-row" ref="teamRow" @contextmenu.prevent="showTeamContext($event, team)">
                    <td class="select"><BaseCheckbox/></td>
                    <td class="title">
                        <i class="fas fa-users"></i>
                        <span>{{team.title}}</span>
                    </td>
                    <td class="users">
                        <span>{{team.user_count}}</span>
                    </td>
                    <td class="action">
                        <button class="invisible ghost-hover" @click="showTeamContext($event, team)"><i class="far fa-ellipsis-h medium"></i></button>
                    </td>
                </tr>
            </template>
            <template v-slot:footer>
                <td><BaseButton buttonClass="primary invisible" :disabled="authUserWorkspaceRole != 'Admin'"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can add users to selections'"
                @click="onAddTeam($event)">
                    <i class="far fa-plus"></i><span>Add Teams(s) to Selection</span>
                </BaseButton></td>
            </template>
        </BaseFlexTable>

        <BaseContextMenu ref="contextMenuTeam" class="context-team" v-slot="slotProps">
            <div class="item-group">
                <div class="item" @click="onRemoveTeam(slotProps.item); slotProps.hide()">
                    <div class="icon-wrapper"><i class="far fa-trash-alt"></i></div>
                    <u>R</u>emove Team
                </div>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuAddTeams" class="context-add-teams">
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
        </BaseContextMenu>
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
    }},
    computed: {
        ...mapGetters('teams', ['teams']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        availableTeams() {
            const allTeams = this.teams
            // return allTeams
            // Filter the available teams to exclude teams already added
            return allTeams.filter(team => !this.selection.teams.find(x => x.id == team.id))
        }
    },
    methods: {
        ...mapActions('selections', ['addTeamsToSelection','removeTeamsFromSelection']),
        ...mapActions('teams', ['fetchTeamUsers']),
        showTeamContext(e, team) {
            const contextMenu = this.$refs.contextMenuTeam
            contextMenu.item = team
            contextMenu.show(e)
        },
        onAddTeam(e) {
            const contextMenu = this.$refs.contextMenuAddTeams
            contextMenu.show(e)
        },
        async onAddTeamsToSelection(teams) {
            // Fetch the users for the team, then add it to the selection
            // Use of promise and map to fetch users for all teams in parallel
            await Promise.all(this.teamsToAdd.map(async team => {
                // Check that we have not already fetched the users for the team
                if (!team.users) {
                    await this.fetchTeamUsers(team)
                }
            }))
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
        onRemoveTeam(team) {
            // If we have a selection, loop through the selection and remove those
            // Else, remove the parsed team
            this.removeTeamsFromSelection({selection: this.selection, teams: [team]})
        },
    }
}
</script>

<style scoped lang="scss">
</style>