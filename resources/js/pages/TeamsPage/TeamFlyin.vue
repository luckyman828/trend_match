<template>
    <div class="team-single" v-if="currentTeamStatus == 'success'">
        <BaseFlexTable>
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <BaseSearchField ref="searchField" :searchKey="['name','email']" :arrayToSearch="team.users" v-model="usersFilteredBySearch"/>
                    </template>
                    <template v-slot:right>
                        <span>{{team.users.length}} records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select">
                    <BaseCheckbox :value="selectedUsers.length > 0" :modelValue="true" 
                    @change="(checked) => checked ? selectedUsers = team.users : selectedUsers = []"/>
                </BaseTableHeader>
                <BaseTableHeader class="title" :sortKey="'name'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Name</BaseTableHeader>
                <BaseTableHeader :sortKey="'email'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">E-mail</BaseTableHeader>
                <BaseTableHeader :sortKey="'teamRoleId'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Team Role</BaseTableHeader>
                <!-- <BaseTableHeader :sortKey="'currency'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">User Currency</BaseTableHeader> -->
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <TeamFlyinUsersTableRow :ref="'userRow-'+user.id" v-for="(user, index) in usersFilteredBySearch" :key="user.id" :user="user" :index="index"
                :team="team" @showContextMenu="showUserContext($event, user)" @editRole="onEditUserRole($event, user)" v-model="selectedUsers" :selectedUsers="selectedUsers"
                @editCurrency="onEditUserCurrency($event, user)"/>
            </template>
            <template v-slot:footer>
                <td>
                    <BaseButton buttonClass="primary invisible"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can add team members'"
                    @click="onAddUser($event)">
                        <i class="far fa-plus"></i><span>Add User(s) to Team</span>
                    </BaseButton>
                </td>
            </template>
        </BaseFlexTable>

        <BaseContextMenu ref="contextMenuUser" class="context-user" v-slot
        :hotkeys="['KeyT', 'KeyD']"
        @keybind-t="onEditUserRole(contextMouseEvent, contextUser)"
        @keybind-d="onRemoveUserFromTeam(contextUser)">
        <!-- <BaseContextMenu ref="contextMenuUser" class="context-user" v-slot="slotProps"
        @keybind-r="$refs['userRow-'+contextUser.id][0].editName = true"
        @keybind-c="onEditUserCurrency(contextMouseEvent, contextUser)"
        @keybind-t="onEditUserRole(contextMouseEvent, contextUser)"
        @keybind-d="onRemoveUserFromTeam(contextUser)"> -->
            <!-- <div class="item-group">
                <div class="item" @click="$refs['userRow-'+slotProps.item.id][0].editName = true">
                    <div class="icon-wrapper"><i class="far fa-pen"></i></div>
                    <span><u>R</u>ename User</span>
                </div>
            </div> -->
            <div class="item-group">
                <!-- <div class="item" @click.stop="onEditUserCurrency(slotProps.mouseEvent, slotProps.item)">
                    <div class="icon-wrapper"><i class="far fa-usd-circle"></i></div>
                    <span><u>C</u>hange User Currency</span>
                </div> -->
                <div class="item" @click.stop="onEditUserRole(contextMouseEvent, contextUser)">
                    <div class="icon-wrapper"><i class="far fa-key"></i></div>
                    <span>Change <u>T</u>eam Role</span>
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click="onRemoveUserFromTeam(contextUser)">
                    <div class="icon-wrapper"><i class="far fa-trash-alt"></i></div>
                    <span><u>D</u>elete User from Team</span>
                </div>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuSelectedUsers"
        :hotkeys="['KeyT', 'KeyD']"
        @keybind-c="onEditUserRole(contextMouseEvent, contextUser)"
        @keybind-d="onRemoveUsersFromTeam(contextUser)"
        @keybind-r="onRemoveUsersFromTeam(contextUser)">
        <template v-slot:header>
            <span>Choose action for {{selectedUsers.length}} users</span>
        </template>
        <template v-slot="slotProps">
            <div class="item-group">
                <div class="item" @click.stop="onEditUserRole(slotProps.mouseEvent, selectedUsers[0])">
                    <div class="icon-wrapper"><i class="far fa-key"></i></div>
                    <span>Change <u>T</u>eam Roles</span>
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click="onRemoveUsersFromTeam">
                    <div class="icon-wrapper"><i class="far fa-trash-alt"></i></div>
                    <span><u>D</u>elete Users from Team</span>
                </div>
            </div>
        </template>
        </BaseContextMenu>

        <!-- <BaseContextMenu ref="contextMenuUserCurrency" class="context-currency" @hide="userToEdit.currency != originalUser.currency && updateWorkspaceUsers([userToEdit])">
            <template v-slot:header>
                Change User Currency
            </template>
            <template v-slot>
                <div class="item-group">
                    <BaseRadioButtons ref="userCurrencySelector" :options="availableCurrencies" 
                    :currentOptionId="originalUser.currency" :search="true" v-model="userToEdit.currency" :submitOnChange="true"/>
                </div>
            </template>
        </BaseContextMenu> -->

        <BaseContextMenu ref="contextMenuTeamRole" class="context-role">
            <template v-slot:header>
                Change Team Role
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons type="radio" ref="userTeamRoleSelector" :options="availableTeamRoles"
                    v-model="userToEdit.role" :submitOnChange="true" :optionDescriptionKey="'description'"
                    :optionNameKey="'role'" :optionValueKey="'role'"/>
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button class="primary" :class="{disabled: userToEdit.role == originalUser.role}" 
                        @click="onUpdateUsersRole();slotProps.hide()">
                            <span>Save</span>
                        </button>
                        <button class="invisible ghost-hover" style="margin-left: 8px;"
                        @click="slotProps.hide(); userToEdit.role = originalUser.role"><span>Cancel</span></button>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

        <BaseSelectButtonsContextMenu ref="contextMenuAddUsers" 
        header="Add User(s) to Team"
        :type="'checkbox'" :options="availableUsers" v-model="usersToAdd" :emitOnChange="true" 
        :optionDescriptionKey="'email'" :optionNameKey="'name'" :search="true" 
        :submitText="`Add ${usersToAdd.length} user${usersToAdd.length > 1 ? 's' : ''}`"
        :submitDisabled="usersToAdd.length < 1"
        @submit="addUsersToTeam({team, users: usersToAdd}); usersToAdd = []"
        @cancel="usersToAdd = []"
        />
    </div>
    <BaseLoader v-else-if="currentTeamStatus == 'loading'"/>
    <div v-else class="error-wrapper">
        <i class="far fa-exclamation-triangle lg"></i>
        <span>Something went wrong</span>
        <button class="dark md" @click="fetchTeamUsers(team)">
            <span>Try again</span>
        </button>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import TeamFlyinUsersTableRow from './TeamFlyinUsersTableRow'
import sortArray from '../../mixins/sortArray'

export default {
    name: 'teamSingleFlyin',
    components: {
        TeamFlyinUsersTableRow,
    },
    props: [
        'team',
        'workspaceUsers'
    ],
    mixins: [
        sortArray
    ],
    data: function() { return {
        sortKey: null,
        sortAsc: true,
        selectedUsers: [],
        userToEdit: null,
        originalUser: null,
        usersToAdd: [],
        usersFilteredBySearch: this.team.users,

        contextUser: null,
        contextMouseEvent: null,
    }},
    watch: {
        team: function(newVal, oldVal) {
            // If we have a new team
            if (!oldVal || newVal.id != oldVal.id) {
                this.fetchData()
                this.$refs.searchField.clear()
            }
        }
    },
    computed: {
        ...mapGetters('persist', ['availableCurrencies']),
        ...mapGetters('teams', ['currentTeamStatus', 'availableTeamRoles']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        availableUsers() {
            // Users who are on the workspace and not on the team
            const allUsers = JSON.parse(JSON.stringify(this.workspaceUsers))
            return allUsers.filter(workspaceUser => !this.team.users.find(teamUser => teamUser.id == workspaceUser.id))
        }
    },
    methods: {
        // ...mapActions('users', ['updateWorkspaceUsers']),
        ...mapActions('teams', ['removeUsersFromTeam', 'updateTeamUsers', 'addUsersToTeam', 'fetchTeamUsers']),
        sortUsers(method, key) {
            // If if we are already sorting by the given key, flip the sort order
            if (this.sortKey == key) {
                this.sortAsc = !this.sortAsc
            }
            else {
                this.sortKey = key
                this.sortAsc = method
            }
            let sortAsc = this.sortAsc

            this.sortArray(this.team.users, this.sortAsc, this.sortKey)
        },
        showUserContext(e, user) {
            if (this.authUserWorkspaceRole != 'Admin') return

            // If we have a selection, show context menu for that selection instead
            let contextMenu
            if (this.selectedUsers.length > 0) {
                contextMenu = this.$refs.contextMenuSelectedUsers
                this.contextUser = this.selectedUsers[0]
            } else {
                contextMenu = this.$refs.contextMenuUser
                this.contextUser = user
            }
            this.contextMouseEvent = e
            contextMenu.show(e)
        },
        onAddUser(e) {
            const contextMenu = this.$refs.contextMenuAddUsers
            contextMenu.show(e)
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
        onUpdateUsersRole() {
            // Define the user to base the new role to set on
            const baseUser = this.userToEdit
            // Check if we have a selection of users
            // If so, set the currency for all the selected users
            let usersToPost
            if (this.selectedUsers.length > 0) {
                usersToPost = this.selectedUsers.map(user => {
                    user.role = baseUser.role
                    return user
                })
            } else usersToPost = [baseUser]
            // Update all users
            this.updateTeamUsers({team: this.team, users: usersToPost})
        },
        onRemoveUserFromTeam(user) {
            // if ( confirm("Are you sure you want to remove this user from this team?") )
                this.removeUsersFromTeam({users: [user], team: this.team})
        },
        onRemoveUsersFromTeam() {
            if ( confirm(`Are you sure you want to remove ${this.selectedUsers.length} from this team?`) )
                this.removeUsersFromTeam({users: this.selectedUsers, team: this.team})
        },
        onEditUserRole(mouseEvent, user) {
            this.userToEdit = user;
            this.originalUser = JSON.parse(JSON.stringify(user));
            const contextMenu = this.$refs.contextMenuTeamRole
            contextMenu.item = user;
            contextMenu.show(mouseEvent)
        },
        fetchData() {
            if (this.team.users == null) {
                this.fetchTeamUsers(this.team)
            }
        }
    },
    created() {
        this.fetchData()
    },
    updated() {
        this.usersFilteredBySearch = this.team.users
    }
}
</script>

<style scoped lang="scss">

    .body {
        padding: 16px;
    }
    .error-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        > span {
            margin: 12px 0;
        }
    }

</style>