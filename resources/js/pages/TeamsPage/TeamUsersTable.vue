<template>
    <div class="team-users-table">
        <BaseTable :contentStatus="readyStatus"
            ref="tableComp"
            loadingMsg="loading team" 
            errorMsg="error loading team"
            :errorCallback="() => initData()"
            :items="team.users"
            itemKey="id"
            :itemSize="50"
            :selected.sync="selectedUsers"
            :contextItem.sync="contextUser"
            :contextMouseEvent.sync="contextMouseEvent"
            :searchKey="['name','email']"
            :searchResult.sync="usersFilteredBySearch"
            itemType="user"
            @show-contextmenu="showUserContext">
            <template v-slot:header>
                <BaseTableHeader class="title" :sortKey="'name'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Name</BaseTableHeader>
                <BaseTableHeader :sortKey="'email'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">E-mail</BaseTableHeader>
                <BaseTableHeader :sortKey="'teamRoleId'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Team Role</BaseTableHeader>
            </template>
            <template v-slot:row="rowProps">
                <TeamUsersTableRow
                :team="team" :user="rowProps.item" 
                @edit-role="onEditUserRole"
                @editCurrency="onEditUserCurrency"/>
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
        </BaseTable>

        <BaseContextMenu ref="contextMenuUser" class="context-user">
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-user-shield"
                hotkey="KeyR"
                @click="onEditUserRole(contextMouseEvent, contextUser)">
                    <span>Change Team <u>R</u>ole</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-trash-alt"
                hotkey="KeyD"
                @click="onRemoveUserFromTeam(contextUser)">
                    <span><u>D</u>elete User from Team</span>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuSelectedUsers">
        <template v-slot:header>
            <span>Choose action for {{selectedUsers.length}} users</span>
        </template>
        <template v-slot="slotProps">
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-key" 
                hotkey="KeyR"
                @click="onEditUserRole(slotProps.mouseEvent, selectedUsers[0])">
                    <span>Change Team <u>R</u>oles</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-trash-alt" 
                hotkey="KeyD"
                @click="onRemoveUsersFromTeam">
                    <span><u>D</u>elete Users from Team</span>
                </BaseContextMenuItem>
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
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import TeamUsersTableRow from './TeamUsersTableRow'
import sortArray from '../../mixins/sortArray'

export default {
    name: 'teamUsersTable',
    components: {
        TeamUsersTableRow
    },
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
        usersFilteredBySearch: [],
        contextUser: null,
        contextMouseEvent: null,
    }},
    computed: {
        ...mapGetters('persist', ['availableCurrencies']),
        ...mapGetters('teams', ['currentTeamStatus', 'availableTeamRoles', 'getCurrentTeam', 'nextTeam', 'prevTeam']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        ...mapGetters('users', ['users']),
        ...mapGetters('auth', ['authUser']),
        readyStatus() {
            return this.currentTeamStatus
        },
        team() {
            return this.getCurrentTeam
        },
        availableUsers() {
            if (!this.team.users) return []
            // Users who are on the workspace and not on the team
            const allUsers = JSON.parse(JSON.stringify(this.workspaceUsers))
            return allUsers.filter(workspaceUser => !this.team.users.find(teamUser => teamUser.id == workspaceUser.id)).sort((a,b) => {
                if (a.id == this.authUser.id) return -1
            })
        },
        workspaceUsers() {
            return this.users
        },
    },
    watch: {
        team(newVal, oldVal) {
            if (!oldVal || newVal.id != oldVal.id) {
                this.initData()
            }
        }
    },
    methods: {
        // ...mapActions('users', ['updateWorkspaceUsers']),
        ...mapActions('teams', ['removeUsersFromTeam', 'updateTeamUsers', 'addUsersToTeam', 'fetchTeamUsers']),
        initData(forceRefresh) {
            if (forceRefresh || this.team.users == null) {
                this.fetchTeamUsers(this.team)
            }
        },
        showNext() {
            if (this.nextTeam)
                this.SET_CURRENT_TEAM(this.nextTeam)
        },
        showPrev() {
            if (this.prevTeam)
                this.SET_CURRENT_TEAM(this.prevTeam)
        },
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
        showUserContext(e) {
            if (this.authUserWorkspaceRole != 'Admin') return

            // If we have a selection, show context menu for that selection instead
            let contextMenu
            if (this.selectedUsers.length > 1) {
                contextMenu = this.$refs.contextMenuSelectedUsers
            } else {
                contextMenu = this.$refs.contextMenuUser
            }
            contextMenu.show(e)
        },
        onAddUser(e) {
            const contextMenu = this.$refs.contextMenuAddUsers
            contextMenu.show(e)
        },
        onEditUserCurrency(mouseEvent, user) {
            this.userToEdit = user;
            this.contextUser = user
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
                this.selectedUsers = []
        },
        onRemoveUsersFromTeam() {
            if ( confirm(`Are you sure you want to remove ${this.selectedUsers.length} from this team?`) ) {
                this.removeUsersFromTeam({users: JSON.parse(JSON.stringify(this.selectedUsers)), team: this.team})
                this.selectedUsers = []
            }
        },
        onEditUserRole(mouseEvent, user) {
            this.userToEdit = user;
            this.contextUser = user
            this.originalUser = JSON.parse(JSON.stringify(user));
            const contextMenu = this.$refs.contextMenuTeamRole
            contextMenu.item = user;
            contextMenu.show(mouseEvent)
        },
        hotkeyHandler(e) {
            const key = e.code
            if (e.target.type == 'textarea' 
                || e.target.tagName.toUpperCase() == 'INPUT'
                || this.singleVisible) return // Don't mess with user input

            if (key == 'KeyS') {
                this.$refs.tableComp.focusSearch()
                // this.$refs.searchField.setFocus()
                e.preventDefault() // Avoid entering an "s" in the search field
            }
        }
    },
    created() {
        this.initData()
        document.addEventListener('keydown', this.hotkeyHandler)
    },
    destroyed() {
        document.removeEventListener('keydown', this.hotkeyHandler)
    }
}
</script>

<style>

</style>