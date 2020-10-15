<template>
    <div class="selection-teams-table">
        <h3>Selection Teams</h3>
        <BaseTable
            :stickyHeader="false"
            :contentStatus="readyStatus"
            loadingMsg="loading teams"
            errorMsg="error loading teams"
            :errorCallback="() => initData()"
            :items="selection.teams"
            itemKey="id"
            :itemSize="50"
            :selected.sync="selected"
            :contextItem.sync="contextTeam"
            :contextMouseEvent.sync="contextMouseEvent"
            :searchKey="'title'"
            :searchResult.sync="teamsFilteredBySearch"
            @show-contextmenu="showTeamContext"
        >
            <template v-slot:header>
                <BaseTableHeader
                    class="name"
                    :sortKey="'title'"
                    :currentSortKey="sortKey"
                    :sortAsc="sortAsc"
                    @sort="sortTeams"
                    >Name</BaseTableHeader
                >
                <BaseTableHeader :sortKey="'users'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams"
                    >Users</BaseTableHeader
                >
            </template>
            <template v-slot:row="rowProps">
                <BaseTableInnerRow>
                    <td class="title">
                        <i class="fas fa-users"></i>
                        <span>{{ rowProps.item.title }}</span>
                    </td>
                    <td class="users">
                        <span>{{ rowProps.item.user_count }}</span>
                    </td>
                </BaseTableInnerRow>
            </template>
            <template v-slot:footer>
                <td>
                    <BaseButton
                        buttonClass="primary invisible"
                        :disabled="!userHasEditAccess"
                        v-tooltip="!userHasEditAccess && 'Only admins can add users to selections'"
                        @click="onAddTeam($event)"
                    >
                        <i class="far fa-plus"></i><span>Add Teams(s) to Selection</span>
                    </BaseButton>
                </td>
            </template>
        </BaseTable>

        <BaseContextMenu ref="contextMenuTeam" class="context-team">
            <template v-slot:header v-if="selected.length > 1">
                <span>Choose action for {{ selected.length }} teams</span>
            </template>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-trash-alt" hotkey="KeyR" @click="onRemoveTeams(contextTeam)">
                    <u>R</u>emove Team{{ selected.length > 1 ? 's' : '' }}
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseSelectButtonsContextMenu
            ref="contextMenuAddTeams"
            header="Add Team(s) to Selection"
            v-model="teamsToAdd"
            :options="availableTeams"
            :submitDisabled="teamsToAdd.length < 1"
            :emitOnChange="true"
            optionNameKey="title"
            :search="true"
            :submitText="`Add ${teamsToAdd.length} team${teamsToAdd.length > 1 ? 's' : ''}`"
            @submit="
                onAddTeamsToSelection(teamsToAdd)
                teamsToAdd = []
            "
            @cancel="teamsToAdd = []"
        />

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
    mixins: [sortArray],
    data: function() {
        return {
            sortKey: null,
            sortAsc: true,
            selected: [],
            teamsToAdd: [],
            contextTeam: null,
            contextMouseEvent: null,
            authUserIsOwner: false,
            teamsFilteredBySearch: [],
        }
    },
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('teams', {
            teams: 'teams',
            getTeamsStatus: 'getTeamsStatus',
            teamsWorkspaceId: 'getWorkspaceFetchedFromId',
        }),
        ...mapGetters('selections', {
            selection: 'getCurrentSelection',
            getAuthUserHasSelectionEditAccess: 'getAuthUserHasSelectionEditAccess',
            getSelectionTeamsStatus: 'getSelectionTeamsStatus',
        }),
        readyStatus() {
            if (this.getTeamsStatus == 'error' || this.getSelectionTeamsStatus == 'error') return 'error'
            if (this.getTeamsStatus == 'loading' || this.getSelectionTeamsStatus == 'loading') return 'loading'
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
        },
    },
    watch: {
        // selection
    },
    methods: {
        ...mapActions('selections', [
            'addTeamsToSelection',
            'removeTeamsFromSelection',
            'updateSelection',
            'fetchSelection',
        ]),
        ...mapActions('teams', ['fetchTeamUsers', 'fetchTeams']),
        ...mapActions('selections', ['updateSelectionUsers']),
        initData(forceRefresh) {
            // Check if we have any workspace teams, else fetch them
            if (
                !this.teamsWorkspaceId != this.currentWorkspace.id ||
                (this.getTeamsStatus != 'success' && this.getTeamsStatus != 'loading')
            )
                this.fetchTeams()

            // Fetch selection with users and teams
            if (forceRefresh || (this.getSelectionTeamsStatus != 'loading' && !this.selection.teams)) {
                this.fetchSelection({ selectionId: this.selection.id, addToState: false })
            }
            this.authUserIsOwner = this.selection.your_role == 'Owner'
        },
        showTeamContext(e) {
            if (!this.userHasEditAccess) return
            e.preventDefault()
            const contextMenu = this.$refs.contextMenuTeam
            contextMenu.show(e)
        },
        onAddTeam(e) {
            const contextMenu = this.$refs.contextMenuAddTeams
            contextMenu.show(e)
        },
        async onAddTeamsToSelection(teams) {
            // First fetch the teams users so we can check if the user is added or not
            const usersAddedFromTeams = []
            await Promise.all(
                teams.map(async team => {
                    if (!team.users) {
                        await this.fetchTeamUsers(team)
                    }
                    // Check if the user already exists
                    team.users.map(user => {
                        if (
                            user.role != 'Member' &&
                            !this.selection.users.find(x => x.id == user.id) &&
                            !usersAddedFromTeams.find(x => x.id == user.id)
                        ) {
                            usersAddedFromTeams.push(user)
                        }
                    })
                })
            )

            // If it is the first team added to the selection and the selection doesnt already have a currency set
            // -> set the selection currency = the team currency
            if (this.selection.teams.length <= 0 && !this.selection.currency && !!teams[0].currency) {
                this.selection.currency = teams[0].currency
                this.updateSelection(this.selection)
            }
            // Add the team to the selection
            await this.addTeamsToSelection({ selection: this.selection, teams })

            this.updateSelectionUsers({ selection: this.selection, users: usersAddedFromTeams })
        },
        sortTeams(method, key) {
            // If if we are already sorting by the given key, flip the sort order
            if (this.sortKey == key) {
                this.sortAsc = !this.sortAsc
            } else {
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
            this.removeTeamsFromSelection({ selection: this.selection, teams: teamsToRemove })
            this.selected = []
        },
    },
    created() {
        this.initData()
    },
}
</script>

<style scoped lang="scss"></style>
