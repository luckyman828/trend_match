<template>
    <div class="selection-users-table">
        <BaseFlexTable :stickyHeader="false">
            <template v-slot:tabs>
                <BaseTableTab label="Members" :count="selection.users.length" 
                modelValue="Members" v-model="currentUsersTableTab" 
                @change="selected = []"/>
                <BaseTableTab label="Excluded" :count="selection.denied_users.length"
                modelValue="Excluded" v-model="currentUsersTableTab" 
                @change="selected = []"/>
            </template>
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <h3>Selection Members</h3>
                    </template>
                    <template v-slot:right>
                        <span>{{users.length}} records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select">
                    <BaseCheckbox :value="selected.length > 0" :modelValue="true" 
                    @change="(checked) => !!checked
                    ? currentUsersTableTab == 'Members'
                    ? selected = users
                    : selected = selection.denied_users
                    : selected = []"/>
                </BaseTableHeader>
                <BaseTableHeader class="name" :sortKey="'name'" :currentSortKey="sortKey" @sort="sortUsers">Name</BaseTableHeader>
                <BaseTableHeader :sortKey="'email'" :currentSortKey="sortKey" @sort="sortUsers">E-mail</BaseTableHeader>
                <BaseTableHeader v-if="currentUsersTableTab == 'Members'" :sortKey="'role'" :currentSortKey="sortKey" @sort="sortUsers">Role</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <!-- Selection Members -->
                <template v-if="currentUsersTableTab == 'Members'">
                    <tr v-for="(user, index) in users" :key="user.id" class="user-row table-row" ref="userRow" :class="{active: contextMenuIsActive(user)}"
                    @click.ctrl="$refs.selectBox[index].check()"
                    @contextmenu="showUserContext($event, user)">
                        <td class="select"><BaseCheckbox ref="selectBox" :value="user" v-model="selected"/></td>
                        <td class="title">
                            <i class="fas fa-user"></i>
                            <span>{{user.name}}</span>
                        </td>
                        <td class="email">{{user.email}}</td>
                        <td class="role">
                            <button v-if="userHasEditAccess" class="ghost editable sm" 
                            @click="showRoleContext($event, user)">
                                <span>{{user.role}}</span>
                            </button>
                            <span v-else>{{user.role}}</span>
                        </td>
                        <td class="action">
                            <button v-if="userHasEditAccess" class="invisible ghost-hover" 
                            @click="showUserContext($event, user)">
                                <i class="far fa-ellipsis-h medium"></i>
                            </button>
                        </td>
                    </tr>
                </template>
                <!-- Excluded Users -->
                <template v-if="currentUsersTableTab == 'Excluded'">
                    <tr v-for="(user, index) in selection.denied_users" :key="user.id" class="user-row table-row" ref="userRow"
                    @click.ctrl="$refs.selectBox[index].check()"
                    @contextmenu="showExcludedUserContext($event, user)">
                        <td class="select"><BaseCheckbox ref="selectBox" :value="user" v-model="selected"/></td>
                        <td class="title">
                            <i class="fas fa-user"></i>
                            <span>{{user.name}}</span>
                        </td>
                        <td class="email">{{user.email}}</td>
                        <td class="action">
                            <button v-if="userHasEditAccess" class="primary ghost-hover invisible"
                            @click="onReAddUsersToSelection(selected.length > 0 ? selected : [user])">
                                <span>Add user</span>
                            </button>
                        </td>
                    </tr>
                </template>
            </template>
            <template v-slot:footer>
                <td v-if="currentUsersTableTab == 'Members'">
                    <BaseButton buttonClass="primary invisible" :disabled="!userHasEditAccess"
                    v-tooltip="!userHasEditAccess && 'Only admins can add users to selections'"
                    @click="onAddUser($event)">
                        <i class="far fa-plus"></i><span>Add Users(s) to Selection</span>
                    </BaseButton>
                </td>
            </template>
        </BaseFlexTable>

        <BaseContextMenu ref="contextMenuUser" class="context-user"
        :hotkeys="['KeyC', 'KeyR', 'KeyE']"
        @keybind-c="showRoleContext(contextMouseEvent, contextUser)"
        @keybind-r="onRemoveUsers(contextUser)"
        @keybind-e="onRemoveUsers(contextUser)">
            <!-- Manually added users  -->
            <template v-slot:header v-if="selected.length > 1">
                <span>Choose action for {{selected.length}} users</span>
            </template>
            <template v-slot>
                <div class="item-group">
                    <div class="item" @click.stop="showRoleContext(contextMouseEvent, contextUser)">
                        <div class="icon-wrapper"><i class="far fa-user-shield"></i></div>
                        <span><u>C</u>hange role{{selected.length > 0 ? 's' : ''}}</span>
                    </div>
                </div>
                <div class="item-group">
                    <div class="item" @click="onRemoveUsers(contextUser)">
                        <div class="icon-wrapper" v-if="contextUser.inherit_from_teams || selected.length > 1">
                            <i class="far fa-user-times"></i>
                        </div>
                        <div class="icon-wrapper" v-else>
                            <i class="far fa-trash-alt"></i>
                        </div>
                        <span>
                            <span v-if="selected.length > 1"><u>R</u>emove / <u>E</u>xclude </span>
                            <span v-else-if="contextUser.inherit_from_teams"><u>E</u>xclude </span>
                            <span v-else><u>R</u>emove </span>
                            User{{selected.length > 1 ? 's' : ''}}</span>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuExcludedUser" class="context-user"
        :hotkeys="['KeyR']"
        @keybind-r="onReAddUsersToSelection(selected.length > 0 ? selected : [contextUser])">
            <template v-slot:header v-if="selected.length > 1">
                <span>Choose action for {{selected.length}} users</span>
            </template>
            <template v-slot>
                <div class="item-group">
                    <div class="item" @click="onReAddUsersToSelection(selected.length > 0 ? selected : [contextUser])">
                        <div class="icon-wrapper"><i class="far fa-user-plus"></i></div>
                        <span><u>R</u>e-add User{{selected.length > 0 ? 's' : ''}}</span>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

        <BaseSelectButtonsContextMenu ref="contextMenuAddUsers" header="Add User(s) to Selection" 
        v-model="usersToAdd" :options="availableUsers" :submitDisabled="usersToAdd.length < 1"
        :emitOnChange="true" optionDescriptionKey="email" optionNameKey="name" :search="true"
        :submitText="`Add ${usersToAdd.length} user${usersToAdd.length > 1 ? 's' : ''}`"
        @submit="onAddUsersToSelection(usersToAdd);usersToAdd = []" @cancel="usersToAdd = []"/>

        <BaseContextMenu ref="contextMenuRole" class="context-role">
            <template v-slot:header>
                Change Selection Role
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons type="radio" ref="userCurrencySelector" :options="filteredAvailableSelectionRoles"
                    v-model="userToEdit.role" :submitOnChange="true" :optionDescriptionKey="'description'"
                    :optionNameKey="'role'" :optionValueKey="'role'"
                    @submit="onUpdateSelectionUsersRole();slotProps.hide()"/>
                </div>
            </template>
        </BaseContextMenu>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import sortArray from '../../mixins/sortArray'

export default {
    name: 'selectionUsersTable',
    props: [
        'selection',
        'users',
        'authUserIsOwner',
    ],
    mixins: [
        sortArray
    ],
    data: function() { return {
        sortKey: null,
        selected: [],
        usersToAdd: [],
        userToEdit: null,
        contextUser: null,
        contextMouseEvent: null,
        currentUsersTableTab: 'Members'
    }},
    computed: {
        ...mapGetters('selections', ['availableSelectionRoles', 'getAuthUserHasSelectionEditAccess']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        ...mapGetters('contextMenu', ['getContextMenuIsVisible']),
        userHasEditAccess() {
            return this.getAuthUserHasSelectionEditAccess(this.selection) || this.authUserIsOwner
        },
        filteredAvailableSelectionRoles() {
            return this.availableSelectionRoles.filter(x => {
                return this.selection.type != 'Master' ? x.role != 'Approver' : true
            })
        },
        ...mapGetters('users', {workspaceUsers: 'users'}),
        availableUsers() {
            const allUsers = this.workspaceUsers
            // Filter the available users to exclude users already added
            return allUsers.filter(user => !this.users.find(x => x.id == user.id))
        },
    },
    methods: {
        ...mapActions('selections', ['addUsersToSelection','updateSelectionUsers','removeUsersFromSelection', 'reAddUsersToSelection']),
        contextMenuIsActive (user) {
            return this.getContextMenuIsVisible && this.contextUser && this.contextUser.id == user.id && this.selected.length <= 1
        },
        showUserContext(e, user) {
            e.preventDefault()
            const contextMenu = this.$refs.contextMenuUser
            this.contextMouseEvent = e
            this.contextUser = this.selected.length > 0 ? this.selected[0] : user
            contextMenu.show(e)
        },
        showExcludedUserContext(e, user) {
            e.preventDefault()
            const contextMenu = this.$refs.contextMenuExcludedUser
            this.contextMouseEvent = e
            this.contextUser = this.selected.length > 0 ? this.selected[0] : user
            contextMenu.show(e)
        },
        showRoleContext(e, user) {
            const contextMenu = this.$refs.contextMenuRole
            this.contextUser = user
            this.userToEdit = JSON.parse(JSON.stringify(user))
            contextMenu.show(e)
        },
        onAddUser(e) {
            const contextMenu = this.$refs.contextMenuAddUsers
            contextMenu.show(e)
        },
        onAddUsersToSelection(usersToAdd) {
            this.addUsersToSelection({selection: this.selection, users: usersToAdd})
        },
        onReAddUsersToSelection(usersToAdd) {
            // this.reAddUsersToSelection({selection: this.selection, users: usersToAdd})
            this.addUsersToSelection({selection: this.selection, users: usersToAdd})
            this.selected = []
        },
        onUpdateSelectionUsersRole() {
            // Define the user to base the new role to set on
            const baseUser = this.userToEdit
            // Check if we have a selection of users
            // If so, set the currency for all the selected users
            let usersToPost
            if (this.selected.length > 0) {
                usersToPost = this.selected.map(user => {
                    user.role = baseUser.role
                    return user
                })
            } else usersToPost = [baseUser]
            // Update users
            this.updateSelectionUsers({selection: this.selection, users: usersToPost})
        },
        sortUsers(method, key) {
            // If if we are already sorting by the given key, flip the sort order
            this.sortKey = key

            this.sortArray(this.users, method, key)
        },
        onRemoveUsers(user) {
            // If we have a selection, loop through the selection and remove those
            // Else, remove the parsed user
            let usersToRemove
            if (this.selected.length > 0) {
                usersToRemove = JSON.parse(JSON.stringify(this.selected))
            } else {
                usersToRemove = [user]
            }
            this.removeUsersFromSelection({selection: this.selection, users: usersToRemove})
            this.selected = []
        },
    }
}
</script>

<style scoped lang="scss">
</style>