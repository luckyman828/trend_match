<template>
    <div class="teams-table">

        <FlexTable v-if="currentTab == 'Teams'">
            <template v-slot:tabs>
                <Tabs :tabs="['Teams','Members']" v-model="currentTab" :activeTab="currentTab"/>
            </template>
            <template v-slot:topBar>
                <TableTopBar>
                    <template v-slot:left>
                        <button class="primary">Example</button>
                    </template>
                    <template v-slot:right>
                        <span>{{selectedCount}} selected</span>
                        <span>{{teams.length}} records</span>
                    </template>
                </TableTopBar>
            </template>
            <template v-slot:header>
                <TableHeader class="select"><Checkbox/></TableHeader>
                <TableHeader :sortKey="'title'" :currentSortKey="sortBy" :sortAsc="sortAsc" @sort="sortTeams">Name</TableHeader>
                <TableHeader :sortKey="'owner'" :currentSortKey="sortBy" :sortAsc="sortAsc" @sort="sortTeams">Owner</TableHeader>
                <TableHeader :sortKey="'users'" :currentSortKey="sortBy" :sortAsc="sortAsc" :descDefault="true" @sort="sortTeams">Members</TableHeader>
                <TableHeader :sortKey="'files'" :currentSortKey="sortBy" :sortAsc="sortAsc" :descDefault="true" @sort="sortTeams">Files</TableHeader>
                <TableHeader :sortKey="'currency'" :currentSortKey="sortBy" :sortAsc="sortAsc" @sort="sortTeams">Team Currency</TableHeader>
                <TableHeader class="action">Action</TableHeader>
            </template>
            <template v-slot:body>
                <TeamsTableRow :ref="'teamRow-'+team.id" v-for="(team, index) in teams" :key="team.id" :team="team" :index="index" 
                @showContextMenu="showTeamContext($event, team)" @showSingle="showSingleTeam" @editCurrency="onEditCurrency($event, team)"
                @cancelEditTitle="removeUnsavedTeam"/>
            </template>
            <template v-slot:footer="slotProps">
                <td><button class="primary invisible" @click="onNewTeam"><i class="far fa-plus"></i><span>Add new: Team</span></button></td>
            </template>
        </FlexTable>

        <FlexTable v-if="currentTab == 'Members'">
            <template v-slot:tabs>
                <Tabs :tabs="['Teams','Members']" v-model="currentTab" :activeTab="currentTab"/>
            </template>
            <template v-slot:topBar>
                <TableTopBar>
                    <template v-slot:left>
                        <button class="primary">Example</button>
                    </template>
                    <template v-slot:right>
                        <span>{{selectedCount}} selected</span>
                        <span>{{teams.length}} records</span>
                    </template>
                </TableTopBar>
            </template>
            <template v-slot:header>
                <TableHeader class="select"><Checkbox/></TableHeader>
                <TableHeader class="title" :sortKey="'name'" :currentSortKey="sortBy" :sortAsc="sortAsc" @sort="sortUsers">Name</TableHeader>
                <TableHeader :sortKey="'email'" :currentSortKey="sortBy" :sortAsc="sortAsc" @sort="sortUsers">E-mail</TableHeader>
                <TableHeader :sortKey="'role_id'" :currentSortKey="sortBy" :sortAsc="sortAsc" @sort="sortUsers">Workspace Role</TableHeader>
                <TableHeader :sortKey="'currency'" :currentSortKey="sortBy" :sortAsc="sortAsc" @sort="sortUsers">Currency</TableHeader>
                <TableHeader class="action">Action</TableHeader>
            </template>
            <template v-slot:body>
                <UsersTableRow v-for="(user, index) in users" :key="user.id" :user="user" :index="index"/>
            </template>
        </FlexTable>

        <FlyIn ref="teamSingleFlyin">
            <TeamSingleFlyin :team="currentTeam" v-if="currentTeam"
            @closeFlyin="$refs.teamSingleFlyin.close()"/>
        </FlyIn>

        <ContextMenu ref="contextMenuTeam" class="context-team" v-slot="slotProps">
            <div class="item-group">
                <div class="item" @click="showSingleTeam(slotProps.item.id); slotProps.hide()">
                    <div class="icon-wrapper">
                        <i class="far fa-users"></i>
                    </div>
                    <u>V</u>iew / <u>E</u>dit team
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click="$refs['teamRow-'+slotProps.item.id][0].editTitle = true; slotProps.hide()">
                    <div class="icon-wrapper"><i class="far fa-pen"></i></div>
                    <u>R</u>ename
                </div>
                <div class="item" @click.stop="onEditCurrency(slotProps.mouseEvent, slotProps.item)">
                    <div class="icon-wrapper"><i class="far fa-usd-circle"></i></div>
                    <u>C</u>hange currency
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click="onDeleteTeam(slotProps.item); slotProps.hide()">
                    <div class="icon-wrapper"><i class="far fa-trash-alt"></i></div>
                    <u>D</u>elete team
                </div>
            </div>
        </ContextMenu>

        <ContextMenu ref="contextMenuCurrency" class="context-currency" @hide="teamToEdit.currency != originalTeam.currency && onUpdateTeam(teamToEdit)">
            <template v-slot:header="slotProps">
                Change Team Currency
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <RadioButtons ref="currencySelector" :options="availableCurrencies" :search="true" v-model="teamToEdit.currency" :submitOnChange="true"/>
                </div>
            </template>
            
        </ContextMenu>



        <!-- <div class="team-totals">
            <span>{{selectedCount}} selected</span>
            <span>{{teams.length}} records</span>
        </div>
        <div class="flex-table">
            <div class="header-row flex-table-row">
                <th class="select">Select <i class="fas fa-chevron-down"></i></th>
                <th class="clickable title" :class="{active: sortBy == 'title'}" @click="onSortBy('title', true)">
                    Team <i class="fas" :class="[(sortBy == 'title' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: sortBy == 'assigned'}" class="clickable assigned" @click="onSortBy('assigned', true)">
                   Assigned <i class="fas" :class="[(sortBy == 'assigned' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: sortBy == 'users'}" class="clickable members" @click="onSortBy('users', false)">
                    Members <i class="fas" :class="[(sortBy == 'users' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: sortBy == 'files'}" class="clickable files" @click="onSortBy('files', false)">
                    files <i class="fas" :class="[(sortBy == 'files' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: sortBy == 'currency'}" class="clickable currency" @click="onSortBy('currency', false)">
                    Currency <i class="fas" :class="[(sortBy == 'currency' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th class="action">Action</th>
            </div>
            <template v-if="!loading">

                <div v-if="teamsSorted <= 0" class="team-row item-row flex-table-row">
                    <span style="display: block; margin: auto; padding: 0;">You dont have access to any teams</span>
                </div>

                <div class="team-row-wrapper" v-for="(team, index) in teamsSorted" :key="team.id">

                    <div class="team-row item-row flex-table-row" ref="teamRow" :class="[{expanded: expandedIds.includes(team.id)}, {collapsed: !expandedIds.includes(team.id)}]">
                        <td class="select">
                            <label class="checkbox">
                                <input type="checkbox" @change="onSelect(index)" />
                                <span class="checkmark"></span>
                            </label>
                        </td>
                        <td class="title clickable">
                            <div v-if="editTitle && teamToEdit.id == team.id" class="edit-title input-parent controls-right">
                                <input type="text" :ref="'editTitleField-'+team.id" class="input-wrapper" v-model="teamToEdit.title" @keyup.enter="onUpdateTeam(teamToEdit); resetTeamToEdit()" @keyup.esc="resetTeamToEdit()">
                                <div class="controls">
                                    <span class="button green true-square" @click="onUpdateTeam(teamToEdit); resetTeamToEdit()"><i class="fas fa-check"></i></span>
                                    <span class="button red true-square" @click="resetTeamToEdit()"><i class="fas fa-times"></i></span>
                                </div>
                            </div>
                            <span v-else :class="(expandedIds.includes(team.id)) ? 'light-2' : 'invisible'" class="button icon-left" @click="expandUsers(team)"><i class="far fa-chevron-right"></i>{{team.title}}</span>
                        </td>
                        <td class="assigned">{{team.expanded}}</td>
                        <td class="members clickable" @click="expandUsers(team)"><span>{{team.users.length}}<template v-if="team.invites.length > 0"> ({{team.invites.length}})</template></span></td>
                        <td class="files">
                            <v-popover :aria-disabled="team.files.length <= 0">
                                <span class="tooltip-target">{{team.files.length}} <i class="far fa-info-circle"/></span>
                                <tooltip-list slot="popover" :header="'Team files'" :array="team.files" :arrayValueKey="'title'"/>
                            </v-popover>
                        </td>
                        <td class="currency">
                            <div v-if="editCurrency && teamToEdit.id == team.id" class="edit-title input-parent controls-right">
                                <Dropdown class="dark" ref="editCurrencyDropdown">
                                    <template v-slot:button="slotProps">
                                        <span @click="slotProps.toggle(); $refs.currencySelect[0].focusSearch()" class="open-dropdown dropdown-parent input-wrapper" :class="{active: !slotProps.collapsed}">
                                            {{teamToEdit.currency}} <i class="fas fa-chevron-down"></i>
                                        </span>
                                    </template>
                                    <template v-slot:body>
                                        <RadioButtons :options="availableCurrencies" ref="currencySelect" @change="$refs.editCurrencyDropdown[0].toggle()" :search="true" :submitOnChange="true" v-model="teamToEdit.currency"/>
                                    </template>
                                </Dropdown>
                                <div class="controls">
                                    <span class="button green true-square" @click="onUpdateTeam(teamToEdit); resetTeamToEdit()"><i class="fas fa-check"></i></span>
                                    <span class="button red true-square" @click="resetTeamToEdit()"><i class="fas fa-times"></i></span>
                                </div>
                            </div>
                            <span v-else>{{team.currency}}</span>
                        </td>
                        <td class="action">
                            <span v-if="expandedIds.includes(team.id)" class="button green active"  @click="openInviteToTeam(team)">Add to team</span>
                            <span v-else class="button ghost"  @click="expandUsers(team)">Edit team</span>
                            <span class="button invisible ghost light-1-hover" @click="expandUsers(team)">View</span>
                            <Dropdown :ref="'moreOptions-'+team.id">
                                <template v-slot:button>
                                    <span class="button invisible ghost light-1-hover true-square" @click="$refs['moreOptions-'+team.id][0].toggle()"><i class="fas fa-ellipsis-v"></i></span>
                                </template>
                                <template v-slot:body>
                                    <div class="option-buttons">
                                        <span class="option icon-left" @click="onRenameTeam(team, index); $refs['moreOptions-'+team.id][0].toggle()"><i class="fas fa-pencil primary"></i> Rename</span>
                                        <span class="option icon-left" @click="onChangeTeamCurrency(team); $refs['moreOptions-'+team.id][0].toggle()"><i class="fas fa-pencil primary"></i> Change currency</span>
                                        <span class="option icon-left" @click="onDeleteTeam(team); $refs['moreOptions-'+team.id][0].toggle()"><i class="fas fa-trash-alt red"></i> Delete</span>
                                    </div>
                                </template>
                            </Dropdown>
                        </td>
                    </div>

                    <div class="team-users" :class="[{expanded: expandedIds.includes(team.id)}, {collapsed: !expandedIds.includes(team.id)}]">
                        <div class="user-row item-row sub-item-row flex-table-row" v-for="(user, index) in team.users" :key="index">
                            <td class="index">{{index + 1}}</td>
                            <td class="name">{{ (user.name != null) ? user.name : 'No name set' }}</td>
                            <td class="email">{{user.email}}</td>
                            <td class="files">-</td>
                            <td class="role dropdown-parent">
                                <span class="square" :class="'role-' + user.role_id">{{user.role.title}}</span>
                                <template v-if="userPermissionLevel < user.role_id">
                                    <span class="square" :class="'role-' + user.role_id">{{user.role.title}}</span>
                                </template>
                                <template v-else>
                                    
                                    <Dropdown class="dark" ref="roleDropdown">
                                        <template v-slot:button="slotProps">
                                            <span class="square clickable dropdown-parent" :class="'role-' + user.role_id" @click="editUser = user, $refs.roleDropdown[index].toggle()">{{user.role.title}}</span>
                                        </template>
                                        <template v-slot:header="slotProps">
                                            <span>Change role</span>
                                            <span class="close" @click="slotProps.toggle"><i class="fal fa-times"></i></span>
                                        </template>
                                        <template v-slot:body>
                                            <RadioButtons :options="roles" :optionNameKey="'title'" :optionValueKey="'id'" ref="roleRadio" @submit="changeRole({user_id: user.id, role_id: $event})"/>
                                        </template>
                                        <template v-slot:footer="slotProps">
                                            <div class="grid-2">
                                                <span class="button green" @click="$refs.roleRadio[index].submit(); slotProps.toggle()">Save</span>
                                                <span class="button invisible" @click="slotProps.toggle">Cancel</span>
                                            </div>
                                        </template>
                                    </Dropdown>
                                </template>
                            </td>
                            <td></td>
                            <td class="action">
                                <span class="resend"></span>
                                <span class="remove button ghost icon-left red invisible" @click="removeUser(user.id, team.id)"><i class="far fa-user-minus"></i> Remove</span>
                            </td>
                        </div>

                        <div class="user-row item-row sub-item-row flex-table-row invited-row" v-for="(invited, index) in team.invites" :key="index + team.users.length + 1">
                            <td class="index">{{team.users.length + index + 1}}</td>
                            <td class="name">No name yet</td>
                            <td class="email">{{invited.email}}</td>
                            <td class="files"><span class="square invisible dark icon-left"><i class="far fa-exclamation-triangle"></i> invited</span></td>
                            <td class="role"></td>
                            <td></td>
                            <td class="action">
                                <span class="resend button ghost icon-left dark invisible" @click="resendInvite($event, invited.email, team)"><i class="far fa-paper-plane"></i> Resend invite</span>
                                <span class="remove button ghost icon-left red invisible" @click="removeInvite(invited.email, team.id)"><i class="far fa-user-minus"></i> Remove</span>
                            </td>
                        </div>

                        <div class="user-row item-row sub-item-row flex-table-row invited-row add-member" @click="openInviteToTeam(team)">
                            <td><i class="far fa-user-plus"></i>Add Member to team</td>
                        </div>
                    </div>

                </div>
            </template>
        </div> -->
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Loader from './Loader'
import Dropdown from './Dropdown'
import RadioButtons from './RadioButtons'
import TeamsTableRow from './TeamsTableRow'
import UsersTableRow from './UsersTableRow'
import TeamSingleFlyin from './TeamSingleFlyin'
import Tabs from './Tabs'
import Role from '../store/models/Role'

export default {
    name: 'teamsTable',
    props: [
        'teams',
        'loading',
        'authUser',
        'collection',
        'selectedCount',
        'users',
        'authUser',
    ],
    components: {
        Loader,
        Dropdown,
        RadioButtons,
        Tabs,
        TeamsTableRow,
        UsersTableRow,
        TeamSingleFlyin,
    },
    data: function() { return {
        sortBy: 'id',
        sortAsc: true,
        expandedIds: [],
        editUser: {
            permission_level: '',
        },
        teamToEdit: {
            id: '',
            title: ''
        },
        defaultTeamToEdit: {
            id: '',
            title: ''
        },
        originalTeam: null,
        editTitle: false,
        editCurrency: false,
        currentTab: 'Teams',
    }},
    computed: {
        ...mapGetters('persist', ['currentWorkspaceId', 'currentWorkspace', 'userPermissionLevel', 'availableCurrencies']),
        ...mapGetters('entities/teams', ['currentTeam']),
        roles () {
            return Role.all().filter(role => role.id <= this.userPermissionLevel)
        },
    },
    methods: {
        ...mapActions('entities/teamInvites', ['deleteInvite', 'resend']),
        ...mapActions('entities/userTeams', ['removeUserFromTeam']),
        ...mapActions('entities/users', ['changeRole']),
        ...mapActions('entities/teams', ['updateTeam', 'deleteTeam']),
        ...mapMutations('entities/teams', ['setCurrentTeamId', 'setAvailableTeamIds']),
        onSelect(index) {
            this.$emit('onSelect', index)
        },
        onEditCurrency(mouseEvent, team) {
            const contextMenu = this.$refs.contextMenuCurrency
            contextMenu.item = team;
            this.teamToEdit = team;
            this.originalTeam = JSON.parse(JSON.stringify(team));
            contextMenu.show(mouseEvent)
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
            // Else create a new folder
            else {
                const newTeam = {
                    id: null,
                    title: 'New team',
                    workspace_id: this.currentWorkspaceId,
                    owner: null,
                    users: [],
                    files: [],
                    currency: this.currentWorkspace.currency,
                    invites: [],
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
        showSingleTeam(id) {
            this.setAvailableTeamIds(this.teams.map(x => x.id))
            this.setCurrentTeamId(id)
            this.$refs.teamSingleFlyin.toggle()
        },
        showTeamContext(e, team) {
            const contextMenu = this.$refs.contextMenuTeam
            contextMenu.item = team
            contextMenu.show(e)
        },
        showUserContext(e, user) {
            const contextMenu = this.$refs.contextMenuUser
            contextMenu.item = user
            contextMenu.show(e)
        },
        openInviteToTeam(team) {
            this.$emit('onOpenInviteToTeam', team)
        },
        async resendInvite(e, email, team) {
            // const response = await this.resend({email: email, team: team, authUser: this.authUser})
            let succes = false
            await this.resend({email: email, team: team, authUser: this.authUser}).then(response => succes = response)
            const el = e.target
            if (succes) {
                el.classList.add('disabled')
                el.innerHTML = '<i class="green fas fa-check-circle"></i> Invite sent'
            }
            else {
                el.innerHTML = '<i class="red fas fa-times-circle"></i> Failed'
            }
        },
        removeInvite(email, team_id) {
            if ( confirm("Are you sure you want to delete this invite?") )
                this.deleteInvite({email: email, team_id: team_id})
        },
        removeUser(user_id, team_id) {
            if ( confirm("Are you sure you want to remove this user from this team?") )
                this.removeUserFromTeam({user_id: user_id, team_id: team_id})
        },
        onDeleteTeam(team) {
            (window.confirm(
                'Are you sure you want to delete this team?\nIt will be permanently deleted.'))
            ? this.deleteTeam(team.id) : false
        },
        onRenameTeam(team, index) {
            this.editTitle = true
            this.teamToEdit = JSON.parse(JSON.stringify(team))
            this.$nextTick(() => {
                const el = this.$refs['editTitleField-'+team.id][0]
                el.focus()
                el.select()
            })
        },
        onChangeTeamCurrency(team) {
            this.editCurrency = true
            this.teamToEdit = JSON.parse(JSON.stringify(team))
        },
        resetTeamToEdit() {
            this.editTitle = false
            this.editCurrency = false
            this.teamToEdit = this.defaultTeamToEdit
        },
        onUpdateTeam(team) {
            this.updateTeam(team)
            console.log('updating team')
            // this.updateTeam({name: team.title, workspace_id: team.workspace_id, team_id: team.id})
        },
        sortTeams(method, key) {
            this.sortArray(this.teams, method, key)
        },
        sortUsers(method, key) {
            this.sortArray(this.users, method, key)
        },
        sortArray(array, method, key) {

            // If if we are already sorting by the given key, flip the sort order
            if (this.sortBy == key) {
                this.sortAsc = !this.sortAsc
            }
            else {
                this.sortBy = key
                this.sortAsc = method
            }
            let sortAsc = this.sortAsc

            const dataSorted = array.sort((a, b) => {

                // If a has a key
                if (a[key]) {
                    // If the keys have lengths - sort by their length
                    if (array[0][key].length) {
    
                        if (sortAsc)
                            return (a[key].length > b[key].length) ? 1 : -1
                            else return (a[key].length < b[key].length) ? 1 : -1
    
                    }
    
                    // If the keys don't have length - sort by the key
                    else {
                        if (sortAsc)
                            return (a[key] > b[key]) ? 1 : -1
                            else return (a[key] < b[key]) ? 1 : -1
                    }
                } else {
                    if (!a[key] && !b[key]) {
                        // If neither A nor B has the key, don't sort them.
                        return 0
                    } else {
                        // If a has no key, but it in the back
                        return sortAsc ? -1 : 1
                    }
                }

                
            })
            return dataSorted
        }
    },
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .teams-table {
        margin-top: 52px;
        padding-top: 0;
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
