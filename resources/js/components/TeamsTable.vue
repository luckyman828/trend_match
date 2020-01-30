<template>
    <div class="teams-table">

        <FlexTable v-if="currentTab == 'Teams'">
            <template v-slot:tabs>
                <Tabs :tabs="['Teams','Members']" v-model="currentTab" :activeTab="currentTab"/>
            </template>
            <template v-slot:topBar>
                <TableTopBar>
                    <template v-slot:left>
                        <SearchField :searchKey="['title']" :arrayToSearch="teams" v-model="teamsFilteredBySearch"/>
                    </template>
                    <template v-slot:right>
                        <span>showing <strong>{{teamsFilteredBySearch.length}}</strong> of <strong>{{teams.length}}</strong> records</span>
                    </template>
                </TableTopBar>
            </template>
            <template v-slot:header>
                <TableHeader class="select"><Checkbox/></TableHeader>
                <TableHeader :sortKey="'title'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams">Name</TableHeader>
                <TableHeader :sortKey="'owner'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams">Owner</TableHeader>
                <TableHeader :sortKey="'users'" :currentSortKey="sortKey" :sortAsc="sortAsc" :descDefault="true" @sort="sortTeams">Members</TableHeader>
                <TableHeader :sortKey="'files'" :currentSortKey="sortKey" :sortAsc="sortAsc" :descDefault="true" @sort="sortTeams">Files</TableHeader>
                <TableHeader :sortKey="'currency'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortTeams">Team Currency</TableHeader>
                <TableHeader class="action">Action</TableHeader>
            </template>
            <template v-slot:body>
                <TeamsTableRow :ref="'teamRow-'+team.id" v-for="(team, index) in teamsFilteredBySearch" :key="team.id" :team="team" :index="index" 
                @showContextMenu="showTeamContext($event, team)" @showSingle="showSingleTeam" @editCurrency="onEditTeamCurrency($event, team)"
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
                        <SearchField :searchKey="['name','email']" :arrayToSearch="users" v-model="usersFilteredBySearch"/>
                    </template>
                    <template v-slot:right>
                        <span>showing <strong>{{usersFilteredBySearch.length}}</strong> of <strong>{{users.length}}</strong> records</span>
                    </template>
                </TableTopBar>
            </template>
            <template v-slot:header>
                <TableHeader class="select"><Checkbox/></TableHeader>
                <TableHeader class="title" :sortKey="'name'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Name</TableHeader>
                <TableHeader :sortKey="'email'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">E-mail</TableHeader>
                <TableHeader :sortKey="'workspaceRoleId'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Workspace Role</TableHeader>
                <TableHeader :sortKey="'currency'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Currency</TableHeader>
                <TableHeader class="action">Action</TableHeader>
            </template>
            <template v-slot:body>
                <UsersTableRow :ref="'userRow-'+user.id" v-for="(user, index) in usersFilteredBySearch" :key="user.id" :user="user" :index="index"
                @showContextMenu="showUserContext($event, user)" @editCurrency="onEditUserCurrency($event, user)"
                @editRole="onEditUserRole($event, user)"/>
            </template>
            <template v-slot:footer="slotProps">
                <td><button class="primary invisible" @click="onNewUser"><i class="far fa-plus"></i><span>Add new: User</span></button></td>
            </template>
        </FlexTable>

        <FlyIn ref="teamSingleFlyin">
            <TeamSingleFlyin :team="currentTeam" :workspaceUsers="users" v-if="currentTeam"
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
                <div class="item" @click.stop="onEditTeamCurrency(slotProps.mouseEvent, slotProps.item)">
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

        <ContextMenu ref="contextMenuUser" class="context-user" v-slot="slotProps">
            <div class="item-group">
                <div class="item" @click="$refs['userRow-'+slotProps.item.id][0].editName = true; slotProps.hide()">
                    <div class="icon-wrapper"><i class="far fa-pen"></i></div>
                    <u>R</u>ename User
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click.stop="onEditUserCurrency(slotProps.mouseEvent, slotProps.item)">
                    <div class="icon-wrapper"><i class="far fa-usd-circle"></i></div>
                    <u>C</u>hange Currency
                </div>
                <div class="item" @click.stop="onEditUserRole(slotProps.mouseEvent, slotProps.item)">
                    <div class="icon-wrapper"><i class="far fa-key"></i></div>
                    Change Workspace <u>R</u>ole
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click="onDeleteUser(slotProps.item); slotProps.hide()">
                    <div class="icon-wrapper"><i class="far fa-trash-alt"></i></div>
                    <u>D</u>elete User from Workspace
                </div>
            </div>
        </ContextMenu>

        <ContextMenu ref="contextMenuTeamCurrency" class="context-currency" @hide="teamToEdit.currency != originalTeam.currency && updateTeam(teamToEdit)">
            <template v-slot:header="slotProps">
                Change Team Currency
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <RadioButtons ref="teamCurrencySelector" :options="availableCurrencies" 
                    :currentOptionId="originalTeam.currency" :search="true" v-model="teamToEdit.currency" :submitOnChange="true"/>
                </div>
            </template>
        </ContextMenu>

        <ContextMenu ref="contextMenuUserCurrency" class="context-currency" @hide="userToEdit.currency != originalUser.currency && updateUser(userToEdit)">
            <template v-slot:header="slotProps">
                Change User Currency
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <RadioButtons ref="userCurrencySelector" :options="availableCurrencies" 
                    :currentOptionId="originalUser.currency" :search="true" v-model="userToEdit.currency" :submitOnChange="true"/>
                </div>
            </template>
        </ContextMenu>

        <ContextMenu ref="contextMenuWorkspaceRole" class="context-role" 
        @hide="userToEdit.workspaceUser.permission_level != originalUser.workspaceUsers[0].permission_level && updateWorkspaceUser(userToEdit.workspaceUser)">
            <template v-slot:header="slotProps">
                Change Workspace Role
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <RadioButtons ref="userCurrencySelector" :options="availableWorkspaceRoles" :currentOptionId="slotProps.item.workspaceRoleId"
                    v-model="userToEdit.workspaceUsers[0].permission_level" :submitOnChange="true" :optionDescriptionKey="'description'"
                    :optionNameKey="'name'" :optionValueKey="'id'"/>
                </div>
            </template>
        </ContextMenu>

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
import sortArray from '../mixins/sortArray'

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
    mixins: [
        sortArray
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
        sortKey: 'id',
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
        userToEdit: null,
        originalUser: null,
        editTitle: false,
        editCurrency: false,
        // currentTab: 'Teams',
        teamsFilteredBySearch: [],
        usersFilteredBySearch: []
    }},
    computed: {
        ...mapGetters('persist', ['currentWorkspaceId', 'currentWorkspace', 'userPermissionLevel', 'availableCurrencies', 'availableWorkspaceRoles']),
        ...mapGetters('entities/teams', ['currentTeam']),
        roles () {
            return Role.all().filter(role => role.id <= this.userPermissionLevel)
        },
        currentTab: {
            get () {
                const routeName = this.$route.name
                if (routeName == 'teams') return 'Teams'
                if (routeName == 'users') return 'Members'
            },
            set (newVal) {
                if (newVal == 'Teams') this.$router.push({name: 'teams'})
                if (newVal == 'Members') this.$router.push({name: 'users'})
            }
        }
    },
    methods: {
        ...mapActions('entities/teamInvites', ['deleteInvite', 'resend']),
        ...mapActions('entities/userTeams', ['removeUserFromTeam']),
        ...mapActions('entities/users', ['updateUser']),
        ...mapActions('entities/teams', ['updateTeam', 'deleteTeam']),
        ...mapActions('entities/workspaceUsers', ['updateWorkspaceUser', 'deleteWorkspaceUser']),
        ...mapMutations('entities/teams', ['setCurrentTeamId', 'setAvailableTeamIds']),
        onSelect(index) {
            this.$emit('onSelect', index)
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
        onEditUserCurrency(mouseEvent, user) {
            this.userToEdit = user;
            this.originalUser = JSON.parse(JSON.stringify(user));
            const contextMenu = this.$refs.contextMenuUserCurrency
            contextMenu.item = user;
            contextMenu.show(mouseEvent)
            // Wait for the context menu to show in the DOM
            this.$nextTick(() => {
                // Set focus to the search field
                this.$refs.userCurrencySelector.focusSearch()
            })
        },
        onEditUserRole(mouseEvent, user) {
            this.userToEdit = user;
            this.originalUser = JSON.parse(JSON.stringify(user));
            const contextMenu = this.$refs.contextMenuWorkspaceRole
            contextMenu.item = user;
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
            // Else create a new team
            else {
                const newTeam = {
                    id: null,
                    title: 'New team',
                    workspace_id: this.currentWorkspaceId,
                    owner: null,
                    users: [],
                    files: [],
                    currency: this.currentWorkspace.currency,
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
        onNewUser() {
            // emit open new user modal
            this.$emit('onNewUser')
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
        onDeleteUser(user) {
            if (window.confirm('Are you sure you want to remove this user from the workspace?')) {
                // Remove the user from our state
                const index = this.users.findIndex(x => x.id == user.id)
                this.users.splice(index, 1)
                // Find every team the user was a member of and remove the user from their team
                this.teams.forEach(team => {
                    const index = team.users.findIndex(x => x.id == user.id)
                    if (index >= 0) {
                        team.users.splice(index, 1)
                    }
                })

                // Do the actual deleting in the DB
                this.deleteWorkspaceUser({workspaceId: this.currentWorkspaceId, user: user})
            }
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
        sortTeams(method, key) {
            this.onSortArray(this.teams, method, key)
        },
        sortUsers(method, key) {
            this.onSortArray(this.users, method, key)
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
        this.teamsFilteredBySearch = this.teams,
        this.usersFilteredBySearch = this.users
    },
    mounted() {
        // Initially set the filteredbySearch arrays
        this.teamsFilteredBySearch = this.teams,
        this.usersFilteredBySearch = this.users
    }
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
