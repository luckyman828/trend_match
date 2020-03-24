<template>
    <div class="users-table">

        <BaseFlexTable v-if="currentTab == 'Users'" stickyHeader="true">
            <template v-slot:tabs>
                <BaseTableTabs :tabs="['Teams','Users']" v-model="currentTab" :activeTab="currentTab"/>
            </template>
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <BaseSearchField :searchKey="['name','email']" :arrayToSearch="users" v-model="usersFilteredBySearch"/>
                    </template>
                    <template v-slot:right>
                        <span>showing <strong>{{usersFilteredBySearch.length}}</strong> of <strong>{{users.length}}</strong> records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select">
                    <BaseCheckbox :value="selectedUsers.length > 0" :modelValue="true" 
                    @change="(checked) => checked ? selectedUsers = users : selectedUsers = []"/>
                </BaseTableHeader>
                <BaseTableHeader class="title" :sortKey="'name'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Name</BaseTableHeader>
                <BaseTableHeader :sortKey="'email'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">E-mail</BaseTableHeader>
                <BaseTableHeader :sortKey="'role'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Workspace Role</BaseTableHeader>
                <BaseTableHeader :sortKey="'currency'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Currency</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <UsersTableRow :ref="'userRow-'+user.id" v-for="(user, index) in usersFilteredBySearch" :key="user.id" :user="user" :index="index"
                @showContextMenu="showUserContext($event, user)" @editCurrency="onEditUserCurrency($event, user)"
                @editRole="onEditUserRole($event, user)" :selectedUsers.sync="selectedUsers"/>
            </template>
            <template v-slot:footer>
                <td>
                    <BaseButton :buttonClass="'primary invisible'" 
                    :disabled="authUserWorkspaceRole != 'Admin'" 
                    v-tooltip="authUserWorkspaceRole != 'Admin' && 'New users can only be added by a workspace admin'"
                        @click="onNewUser">
                        <span>Add new: User</span>
                    </BaseButton>
                </td>
            </template>
        </BaseFlexTable>

        <BaseContextMenu ref="contextMenuUser" class="context-user" v-slot="slotProps">
            <!-- <div class="item-group"> -->

                <!-- <BaseContextMenuItem iconClass="far fa-pen" :disabled="authUserWorkspaceRole != 'Admin' && slotProps.item.id != authUser.id" 
                v-tooltip="authUserWorkspaceRole != 'Admin' && slotProps.item.id != authUser.id 
                && 'Can only change own name. Only admins can change the name of others.'"
                @click="$refs['userRow-'+slotProps.item.id][0].editName = true">
                    <span><u>R</u>ename User</span>
                </BaseContextMenuItem> -->

                <!-- <BaseContextMenuItem iconClass="far fa-pen" :disabled="authUserWorkspaceRole != 'Admin' && slotProps.item.id != authUser.id" 
                v-tooltip="authUserWorkspaceRole != 'Admin' && slotProps.item.id != authUser.id 
                && 'Can only change own e-mail. Only admins can change the e-mail of others.'"
                @click="$refs['userRow-'+slotProps.item.id][0].editEmail = true">
                    <span><u>E</u>dit User Email</span>
                </BaseContextMenuItem> -->
            <!-- </div> -->
            <div class="item-group">
                <BaseContextMenuItem iconClass="far fa-usd-circle" :disabled="authUserWorkspaceRole != 'Admin' && slotProps.item.id != authUser.id" 
                v-tooltip="authUserWorkspaceRole != 'Admin' && slotProps.item.id != authUser.id 
                && 'Can only set own currency. Only admins can change currency of others.'"
                @click.stop="onEditUserCurrency(slotProps.mouseEvent, slotProps.item)">
                    <span><u>C</u>hange Currency</span>
                </BaseContextMenuItem>

                <BaseContextMenuItem iconClass="far fa-key" :disabled="authUserWorkspaceRole != 'Admin'" 
                v-tooltip="authUserWorkspaceRole != 'Admin'
                && 'Only admins can change workspace role'"
                @click.stop="onEditUserRole(slotProps.mouseEvent, slotProps.item)">
                    <span>Change Workspace <u>R</u>ole</span>
                </BaseContextMenuItem>

                <BaseContextMenuItem iconClass="far fa-lock" :disabled="slotProps.item.id != authUser.id" 
                v-tooltip="slotProps.item.id != authUser.id 
                && 'Can only set password of self'"
                @click.stop="onSetUserPassword(slotProps.mouseEvent, slotProps.item)">
                    <span>Change <u>P</u>assword</span>
                </BaseContextMenuItem>
                <!-- <BaseContextMenuItem iconClass="far fa-lock" :disabled="authUserWorkspaceRole != 'Admin' && slotProps.item.id != authUser.id" 
                v-tooltip="authUserWorkspaceRole != 'Admin' && slotProps.item.id != authUser.id 
                && 'Can only set password of self. Admins can set the password of others'"
                @click.stop="onSetUserPassword(slotProps.mouseEvent, slotProps.item)">
                    <span>Set <u>P</u>assword</span>
                </BaseContextMenuItem> -->
            </div>
            <div class="item-group">
                <BaseContextMenuItem :disabled="authUserWorkspaceRole != 'Admin'" iconClass="far fa-trash-alt"
                v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can remove users'"
                @click="onDeleteUser(slotProps.item)">
                    <span><u>D</u>elete User from Workspace</span>
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuUserCurrency" class="context-currency">
            <template v-slot:header>
                Change User Currency
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseRadioButtons ref="userCurrencySelector" :options="availableCurrencies" 
                    :currentOptionId="originalUser.currency" :search="true" v-model="userToEdit.currency" :submitOnChange="true"/>
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button class="primary" :disabled="userToEdit.currency == originalUser.currency"
                        @click="updateWorkspaceUser(userToEdit);slotProps.hide()">
                            <span>Save</span>
                        </button>
                        <button class="invisible invisible ghost" style="margin-left: 8px;"
                        @click="slotProps.hide()">
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuWorkspaceRole" class="context-role">
            <template v-slot:header>
                Change Workspace Role
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons type="radio" :options="availableWorkspaceRoles"
                    v-model="userToEdit.role" :submitOnChange="true" :optionDescriptionKey="'description'"
                    :optionNameKey="'role'" :optionValueKey="'role'"/>
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button class="primary" :class="{disabled: userToEdit.role == originalUser.role}" 
                        @click="updateWorkspaceUser(userToEdit);slotProps.hide()">
                            <span>Save</span>
                        </button>
                        <button class="invisible ghost-hover" style="margin-left: 8px;"
                        @click="slotProps.hide(); userToEdit.role = originalUser.role"><span>Cancel</span></button>
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
                            <BaseInputField type="text" ref="userPasswordInput" 
                            placeholder="New password" v-model="newUserPassword"/>
                        </div>
                    </div>
                    <div class="item-wrapper">
                        <div>
                            <label>Old password</label>
                            <BaseInputField type="text" placeholder="Old password" v-model="oldUserPassword"/>
                        </div>
                    </div>
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button class="primary" :class="{disabled: passwordSubmitDisabled}" style="margin-right: 8px;"
                        @click="setUserPassword(slotProps.item);slotProps.hide()">
                            <span>Save</span></button>
                        <button class="invisible ghost-hover" @click="slotProps.hide()"><span>Cancel</span></button>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import UsersTableRow from '../UsersPage/UsersTableRow'
import sortArray from '../../mixins/sortArray'

export default {
    name: 'usersTable',
    props: [
        'users',
    ],
    mixins: [
        sortArray
    ],
    components: {
        UsersTableRow,
    },
    data: function() { return {
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
    }},
    computed: {
        ...mapGetters('persist', ['availableCurrencies']),
        ...mapGetters('workspaces', ['currentWorkspace', 'availableWorkspaceRoles', 'authUserWorkspaceRole']),
        ...mapGetters('auth', ['authUser']),
        passwordSubmitDisabled() {
            return this.newUserPassword.length < 8 || (this.authUserWorkspaceRole != 'Admin' && this.oldUserPassword.length < 8)
        },
        currentTab: {
            get () {
                const routeName = this.$route.name
                if (routeName == 'teams') return 'Teams'
                if (routeName == 'users') return 'Users'
            },
            set (newVal) {
                if (newVal == 'Teams') this.$router.push({name: 'teams'})
                if (newVal == 'Users') this.$router.push({name: 'users'})
            }
        }
    },
    methods: {
        ...mapActions('users', ['updateWorkspaceUser', 'updateUser', 'updateUserPassword', 'removeUsersFromWorkspace']),
        onSetUserPassword(mouseEvent, user) {
            const contextMenu = this.$refs.contextMenuUserPassword
            contextMenu.item = user;
            contextMenu.show(mouseEvent)
            // Wait for the context menu to show in the DOM
            this.$nextTick(() => {
                // Set focus to the input field
                const input = this.$refs.userPasswordInput
                input.focus()
                input.select()
            })
        },
        setUserPassword(user) {
            const password = this.newUserPassword
            user.password = password
            user.oldPassword = this.oldUserPassword
            this.updateUserPassword(user)
        },
        onEditUserCurrency(mouseEvent, user) {
            this.userToEdit = JSON.parse(JSON.stringify(user));
            this.originalUser = user;
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
            this.userToEdit = JSON.parse(JSON.stringify(user));
            this.originalUser = user;
            const contextMenu = this.$refs.contextMenuWorkspaceRole
            contextMenu.item = user;
            contextMenu.show(mouseEvent)
        },
        onNewUser() {
            // emit open new user modal
            this.$emit('onNewUser')
        },
        showUserContext(e, user) {
            const contextMenu = this.$refs.contextMenuUser
            contextMenu.item = user
            contextMenu.show(e)
        },
        onDeleteUser(user) {
            console.log('on delete user')
            if (window.confirm('Are you sure you want to remove this user from the workspace?')) {
                this.removeUsersFromWorkspace({workspaceId: this.currentWorkspace.id, users: [user]})
            }
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
        this.usersFilteredBySearch = this.users
    },
    mounted() {
        // Initially set the filteredbySearch arrays
        this.usersFilteredBySearch = this.users
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .users-table {
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
