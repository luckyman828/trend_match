<template>
    <div class="users-table">
        <BaseTable
            v-if="currentTab == 'Users'"
            stickyHeader="true"
            ref="tableComp"
            :contentStatus="readyStatus"
            loadingMsg="loading users"
            errorMsg="error loading users"
            :errorCallback="() => initData()"
            :items="users"
            itemKey="id"
            :itemSize="50"
            :selected.sync="selectedUsers"
            :contextItem.sync="contextUser"
            :contextMouseEvent.sync="contextMouseEvent"
            :searchKey="['name', 'email']"
            :searchResult.sync="usersFilteredBySearch"
            itemType="user"
            @show-contextmenu="showUserContext"
        >
            <template v-slot:tabs v-if="authUserWorkspaceRole == 'Admin'">
                <BaseTableTabs :tabs="['Teams', 'Users']" v-model="currentTab" :activeTab="currentTab" />
            </template>
            <template v-slot:header>
                <BaseTableHeader
                    class="title"
                    :sortKey="'name'"
                    :currentSortKey="sortKey"
                    :sortAsc="sortAsc"
                    @sort="sortUsers"
                    >Name</BaseTableHeader
                >
                <BaseTableHeader :sortKey="'email'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers"
                    >E-mail</BaseTableHeader
                >
                <BaseTableHeader :sortKey="'role'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers"
                    >Workspace Role</BaseTableHeader
                >
                <BaseTableHeader :sortKey="'currency'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers"
                    >Currency</BaseTableHeader
                >
            </template>
            <template v-slot:row="rowProps">
                <UsersTableRow
                    :user="rowProps.item"
                    @editCurrency="onEditUserCurrency"
                    @editRole="onEditUserRole"
                    :selectedUsers.sync="selectedUsers"
                    @show-contextmenu="showUserContext"
                />
            </template>
            <template v-slot:footer>
                <td>
                    <BaseButton
                        buttonClass="primary invisible ghost-hover"
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        v-tooltip="
                            authUserWorkspaceRole != 'Admin' && 'New users can only be added by a workspace admin'
                        "
                        @click="onNewUser"
                    >
                        <i class="far fa-user-plus"></i>
                        <span>Add user</span>
                    </BaseButton>
                </td>
            </template>
        </BaseTable>

        <BaseContextMenu ref="contextMenuUser" class="context-user">
            <!-- <div class="item-group"> -->

            <!-- <BaseContextMenuItem iconClass="far fa-pen" :disabled="authUserWorkspaceRole != 'Admin' && contextUser.id != authUser.id" 
                v-tooltip="authUserWorkspaceRole != 'Admin' && contextUser.id != authUser.id 
                && 'Can only change own name. Only admins can change the name of others.'"
                @click="$refs['userRow-'+contextUser.id][0].editName = true">
                    <span><u>R</u>ename User</span>
                </BaseContextMenuItem> -->

            <!-- <BaseContextMenuItem iconClass="far fa-pen" :disabled="authUserWorkspaceRole != 'Admin' && contextUser.id != authUser.id" 
                v-tooltip="authUserWorkspaceRole != 'Admin' && contextUser.id != authUser.id 
                && 'Can only change own e-mail. Only admins can change the e-mail of others.'"
                @click="$refs['userRow-'+contextUser.id][0].editEmail = true">
                    <span><u>E</u>dit User Email</span>
                </BaseContextMenuItem> -->
            <!-- </div> -->
            <div class="item-group" v-if="contextUser">
                <BaseContextMenuItem
                    iconClass="far fa-usd-circle"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    disabledTooltip="Only admins can change currency of others."
                    hotkey="KeyC"
                    @click="onEditUserCurrency(contextMouseEvent, contextUser)"
                >
                    <span><u>C</u>hange <u>C</u>urrency</span>
                </BaseContextMenuItem>

                <BaseContextMenuItem
                    iconClass="far fa-key"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    disabledTooltip="Only admins can change workspace role"
                    hotkey="KeyR"
                    @click="onEditUserRole(contextMouseEvent, contextUser)"
                >
                    <span>Change Workspace <u>R</u>ole</span>
                </BaseContextMenuItem>

                <BaseContextMenuItem
                    v-if="isSystemAdmin"
                    iconClass="far fa-lock"
                    :disabled="!isSystemAdmin"
                    disabledTooltip="Only system admins can set passwords"
                    hotkey="KeyP"
                    @click="onShowSetPasswordContext(contextMouseEvent, contextUser)"
                >
                    <span>Set <u>P</u>assword</span>
                </BaseContextMenuItem>
            </div>
            <div class="item-group">
                <BaseContextMenuItem
                    iconClass="far fa-trash-alt"
                    :disabled="authUserWorkspaceRole != 'Admin'"
                    disabledTooltip="Only admins can remove users"
                    hotkey="KeyD"
                    @click="onDeleteUser(contextUser)"
                >
                    <span><u>D</u>elete User from Workspace</span>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuSelectedUsers">
            <template v-slot:header>
                <span>Choose action for {{ selectedUsers.length }} users</span>
            </template>
            <template v-slot>
                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-times" hotkey="KeyL" @click="selectedUsers = []">
                        <span>C<u>l</u>ear Selection</span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem
                        iconClass="far fa-usd-circle"
                        :disabled="authUserWorkspaceRole != 'Admin' && contextUser.id != authUser.id"
                        disabledTooltip="Can only set own currency. Only admins can change currency of others."
                        hotkey="KeyC"
                        @click="onEditUserCurrency(contextMouseEvent, contextUser)"
                    >
                        <span><u>C</u>hange <u>C</u>urrency</span>
                    </BaseContextMenuItem>

                    <BaseContextMenuItem
                        iconClass="far fa-key"
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        disabledTooltip="Only admins can change workspace role"
                        hotkey="KeyR"
                        @click="onEditUserRole(contextMouseEvent, contextUser)"
                    >
                        <span>Change Workspace <u>R</u>ole</span>
                    </BaseContextMenuItem>
                    <BaseContextMenuItem
                        v-if="isSystemAdmin"
                        iconClass="far fa-lock"
                        :disabled="!isSystemAdmin"
                        disabledTooltip="Only system admins can set passwords"
                        hotkey="KeyP"
                        @click="onShowSetPasswordContext(contextMouseEvent, contextUser)"
                    >
                        <span>Set <u>P</u>assword</span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        iconClass="far fa-trash-alt"
                        v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can remove users'"
                        @click="onDeleteUsers"
                    >
                        <span><u>D</u>elete Users from Workspace</span>
                    </BaseContextMenuItem>
                </div>
            </template>
        </BaseContextMenu>

        <BaseSelectButtonsContextMenu
            ref="contextMenuUserCurrency"
            v-if="userToEdit"
            header="Change User Currency"
            v-model="userToEdit.currency"
            type="radio"
            :options="availableCurrencies"
            :search="true"
            unsetOption="Clear"
            :unsetValue="null"
            :allowManualEntry="true"
            @submit="onUpdateUsersCurrency"
        />

        <BaseContextMenu ref="contextMenuWorkspaceRole" class="context-role">
            <template v-slot:header>
                Change Workspace Role
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons
                        type="radio"
                        :options="availableWorkspaceRoles"
                        v-model="userToEdit.role"
                        :submitOnChange="true"
                        :optionDescriptionKey="'description'"
                        :optionNameKey="'role'"
                        :optionValueKey="'role'"
                    />
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button
                            class="primary"
                            @click="
                                onUpdateUsersRole()
                                slotProps.hide()
                            "
                        >
                            <span>Save</span>
                        </button>
                        <button
                            class="invisible ghost-hover"
                            style="margin-left: 8px;"
                            @click="
                                slotProps.hide()
                                userToEdit.role = originalUser.role
                            "
                        >
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuUserPassword" class="context-password">
            <template v-slot:header>
                <!-- Change User's Password -->
                <span>Change Password</span>
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <div class="item-wrapper">
                        <div>
                            <label>New password</label>
                            <BaseInputField
                                type="text"
                                ref="userPasswordInput"
                                placeholder="New password"
                                v-model="newUserPassword"
                                @submit="
                                    onSetUserPassword(contextUser)
                                    slotProps.hide()
                                "
                            />
                            <span class="help-text">
                                <i class="far fa-info-circle"></i>
                                <i>Must be at least 8 characters long.</i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button
                            class="primary"
                            :class="{ disabled: passwordSubmitDisabled }"
                            style="margin-right: 8px;"
                            @click="
                                onSetUserPassword(contextUser)
                                slotProps.hide()
                            "
                        >
                            <span>Save</span>
                        </button>
                        <button class="invisible ghost-hover" @click="slotProps.hide()"><span>Cancel</span></button>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

        <BaseDialog
            ref="confirmDeleteMultipleUsers"
            type="confirm"
            confirmColor="red"
            confirmText="Yes, delete them"
            cancelText="No, keep them"
        >
            <div class="icon-graphic">
                <i class="lg primary far fa-user"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-trash"></i>
            </div>
            <h3>Really delete {{ selectedUsers.length }} users from your workspace??</h3>
        </BaseDialog>

        <BaseDialog
            ref="confirmDeleteUser"
            type="confirm"
            confirmColor="red"
            confirmText="Yes, delete this user"
            cancelText="No, keep this user"
        >
            <div class="icon-graphic">
                <i class="lg primary far fa-user"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-trash"></i>
            </div>
            <h3>Really delete this user from your workspace?</h3>
        </BaseDialog>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import UsersTableRow from './UsersTableRow'
import sortArray from '../../mixins/sortArray'

export default {
    name: 'usersTable',
    props: [
        // 'users',
    ],
    mixins: [sortArray],
    components: {
        UsersTableRow,
    },
    data: function() {
        return {
            sortKey: 'id',
            sortAsc: true,
            editUser: {
                permission_level: '',
            },
            userToEdit: null,
            originalUser: null,
            usersFilteredBySearch: [],
            newUserPassword: '',
            oldUserPassword: '',
            selectedUsers: [],
            contextUser: null,
            contextMouseEvent: null,
        }
    },
    computed: {
        ...mapGetters('persist', ['availableCurrencies']),
        ...mapGetters('workspaces', ['currentWorkspace', 'availableWorkspaceRoles', 'authUserWorkspaceRole']),
        ...mapGetters('auth', {
            authUser: 'authUser',
            isSystemAdmin: 'getIsSystemAdmin',
        }),
        ...mapGetters('users', ['getUsers', 'getUsersStatus']),
        ...mapGetters('tables', ['getUsersTable']),
        passwordSubmitDisabled() {
            return (
                this.newUserPassword.length < 8 ||
                (this.authUserWorkspaceRole != 'Admin' && this.oldUserPassword.length < 8)
            )
        },
        currentTab: {
            get() {
                const routeName = this.$route.name
                if (routeName == 'teams') return 'Teams'
                if (routeName == 'users') return 'Users'
            },
            set(newVal) {
                if (newVal == 'Teams') this.$router.push({ name: 'teams' })
                if (newVal == 'Users') this.$router.push({ name: 'users' })
            },
        },
        readyStatus() {
            return this.getUsersStatus
        },
        users() {
            const users = this.getUsers
            if (!users) return []
            if (this.authUserWorkspaceRole != 'Admin') {
                return users.filter(x => x.id == this.authUser.id)
            }
            return users
        },
        usersSorted() {
            return this.usersFilteredBySearch.sort((a, b) => (a.id == this.authUser.id ? -1 : 0))
        },
    },
    watch: {
        getUsersStatus: function(newVal, oldVal) {
            if (newVal == 'success') this.usersFilteredBySearch = this.users
        },
        currentWorkspace(newVal, oldVal) {
            this.initData(true)
        },
    },
    methods: {
        ...mapActions('users', [
            'fetchUsers',
            'updateWorkspaceUsers',
            'updateUser',
            'setUserPassword',
            'removeUsersFromWorkspace',
        ]),
        ...mapMutations('tables', ['SET_TABLE_PROPERTY']),
        async initData(forceRefresh) {
            // If we have not and are not fetching the users then fetch them
            if (forceRefresh || (this.getUsersStatus != 'success' && this.getUsersStatus != 'loading'))
                await this.fetchUsers()
            // Initially set the filteredbySearch arrays
            if (this.getUsersStatus == 'success') this.usersFilteredBySearch = this.users
            this.SET_TABLE_PROPERTY('usersTable', 'workspaceId', this.currentWorkspace.id)
        },
        onShowSetPasswordContext(mouseEvent, user) {
            const contextMenu = this.$refs.contextMenuUserPassword
            contextMenu.item = user
            contextMenu.show(mouseEvent)
            // Wait for the context menu to show in the DOM
            this.$nextTick(() => {
                // Set focus to the input field
                const input = this.$refs.userPasswordInput
                input.focus()
                input.select()
            })
        },
        async onSetUserPassword(user) {
            const password = this.newUserPassword
            let usersToUpdate = [user]
            if (this.selectedUsers.length > 0) {
                usersToUpdate = this.selectedUsers
            }
            for (const userToUpdate of usersToUpdate) {
                userToUpdate.password = password
                userToUpdate.oldPassword = this.oldUserPassword
                await this.setUserPassword(userToUpdate)
            }
        },
        onEditUserCurrency(mouseEvent, user) {
            this.contextUser = user
            this.userToEdit = JSON.parse(JSON.stringify(user))
            this.originalUser = user
            // Wait for the context menu to show in the DOM
            this.$nextTick(() => {
                const contextMenu = this.$refs.contextMenuUserCurrency
                contextMenu.item = user
                contextMenu.show(mouseEvent)
            })
        },
        onEditUserRole(mouseEvent, user) {
            this.userToEdit = JSON.parse(JSON.stringify(user))
            this.originalUser = user
            this.contextUser = user
            const contextMenu = this.$refs.contextMenuWorkspaceRole
            contextMenu.item = user
            contextMenu.show(mouseEvent)
        },
        onUpdateUsersCurrency() {
            // Define the user to base the new currency to set on
            const baseUser = this.userToEdit
            // Check if we have a selection of users
            // If so, set the currency for all the selected users
            let usersToPost
            if (this.selectedUsers.length > 0) {
                usersToPost = this.selectedUsers.map(user => {
                    user.currency = baseUser.currency
                    return user
                })
            } else usersToPost = [baseUser]
            // Update all users
            this.updateWorkspaceUsers(usersToPost)
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
            this.updateWorkspaceUsers(usersToPost)
        },
        onNewUser() {
            // emit open new user modal
            this.$emit('onNewUser')
        },
        showUserContext(e, user) {
            // If we have a selection, show context menu for that selection instead
            let contextMenu = this.$refs.contextMenuUser
            if (this.selectedUsers.length > 1) {
                contextMenu = this.$refs.contextMenuSelectedUsers
            } else {
                contextMenu = this.$refs.contextMenuUser
            }
            if (user) {
                this.contextUser = this.selectedUsers.length > 0 ? this.selectedUsers[0] : user
            }
            contextMenu.show(e)
        },
        async onDeleteUser(user) {
            if (await this.$refs.confirmDeleteUser.confirm()) {
                this.removeUsersFromWorkspace({ workspaceId: this.currentWorkspace.id, users: [user] })
                this.selectedUsers = []
            }
        },
        async onDeleteUsers() {
            if (await this.$refs.confirmDeleteMultipleUsers.confirm()) {
                this.removeUsersFromWorkspace({ workspaceId: this.currentWorkspace.id, users: this.selectedUsers })
                this.selectedUsers = []
            }
        },
        sortUsers(method, key) {
            this.onSortArray(this.users, method, key)
        },
        onSortArray(array, method, key) {
            // If if we are already sorting by the given key, flip the sort order
            if (this.sortKey == key) {
                this.sortAsc = !this.sortAsc
            } else {
                this.sortKey = key
                this.sortAsc = method
            }
            let sortAsc = this.sortAsc

            this.sortArray(array, this.sortAsc, this.sortKey)
        },
        hotkeyHandler(e) {
            const key = e.code
            if (e.target.type == 'textarea' || e.target.tagName.toUpperCase() == 'INPUT' || this.singleVisible) return // Don't mess with user input

            if (key == 'KeyS') {
                this.$refs.tableComp.focusSearch()
                // this.$refs.searchField.setFocus()
                e.preventDefault() // Avoid entering an "s" in the search field
            }
        },
    },
    created() {
        const forceRefresh = this.getUsersTable.workspaceId != this.currentWorkspace.id
        this.initData(forceRefresh)
        document.addEventListener('keydown', this.hotkeyHandler)
    },
    destroyed() {
        document.removeEventListener('keydown', this.hotkeyHandler)
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.help-text {
    margin-top: 8px;
    display: block;
    font-size: 12px;
    color: $fontSoft;
}

.users-table {
    ::v-deep {
        td,
        th {
            &.title {
                min-width: 264px;
                max-width: 264px;
                display: flex;
                align-items: center;
            }
        }
        tr:not(.table-top-bar) th.email,
        td.email {
            flex: 2;
        }
    }
}
</style>
