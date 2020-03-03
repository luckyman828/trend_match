<template>
    <div class="selection-users-table">
        <BaseFlexTable :stickyHeader="false">
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
                    @change="(checked) => checked ? selected = users : selected = []"/>
                </BaseTableHeader>
                <BaseTableHeader class="name" :sortKey="'name'" :currentSortKey="sortKey" @sort="sortUsers">Name</BaseTableHeader>
                <BaseTableHeader :sortKey="'email'" :currentSortKey="sortKey" @sort="sortUsers">E-mail</BaseTableHeader>
                <BaseTableHeader :sortKey="'role'" :currentSortKey="sortKey" @sort="sortUsers">Role</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <tr v-for="user in users" :key="user.id" class="user-row table-row" ref="userRow" @contextmenu.prevent="showUserContext($event, user)">
                    <td class="select"><BaseCheckbox :value="user" v-model="selected"/></td>
                    <td class="title">
                        <i class="fas fa-user"></i>
                        <span>{{user.name}}</span>
                    </td>
                    <td class="email">{{user.email}}</td>
                    <td class="role">
                        <button class="ghost editable sm" 
                        @click="showRoleContext($event, user)">
                            <span>{{user.role}}</span>
                        </button>
                    </td>
                    <td class="action">
                        <button class="invisible ghost-hover" @click="showUserContext($event, user)"><i class="far fa-ellipsis-h medium"></i></button>
                    </td>
                </tr>
            </template>
            <template v-slot:footer>
                <td><button class="primary invisible" @click="onAddUser($event)"><i class="far fa-plus"></i><span>Add Users(s) to Selection</span></button></td>
            </template>
        </BaseFlexTable>

        <BaseContextMenu ref="contextMenuUser" class="context-user" v-slot="slotProps">
            <!-- Manually added users  -->
            <template v-if="!contextUser.added_by_team">
                <div class="item-group">
                    <div class="item" @click.stop="showRoleContext(slotProps.mouseEvent, contextUser)">
                        <div class="icon-wrapper"><i class="far fa-user-shield"></i></div>
                        <span>Change <u>R</u>ole</span>
                    </div>
                </div>
                <div class="item-group">
                    <div class="item" @click="onRemoveUser(contextUser)">
                        <div class="icon-wrapper"><i class="far fa-trash-alt"></i></div>
                        <span><u>R</u>emove User</span>
                    </div>
                </div>
            </template>
            <!-- Team added users  -->
            <template v-else>
                <div class="item-group">
                    <div class="item-wrapper">
                        <span>User added through team. Edit user on team to make changes.</span>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuAddUsers" class="context-add-users">
            <template v-slot:header>
                Add User(s) to Selection
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons :type="'checkbox'" :options="availableUsers"
                    v-model="usersToAdd" :submitOnChange="true" :optionDescriptionKey="'email'"
                    :optionNameKey="'name'" :search="true"/>
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button class="primary" :class="{disabled: usersToAdd.length < 1}" 
                        @click="onAddUsersToSelection();usersToAdd = [];slotProps.hide()">
                            <span>Add <template v-if="usersToAdd.length > 0">{{usersToAdd.length}} 
                            </template>user<template v-if="usersToAdd.length > 1">s</template></span></button>
                        <button class="invisible ghost-hover" style="margin-left: 8px;"
                        @click="slotProps.hide(); usersToAdd = []">
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuRole" class="context-role">
            <template v-slot:header>
                Change Selection Role
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons type="radio" ref="userCurrencySelector" :options="filteredAvailableSelectionRoles"
                    v-model="userToEdit.role" :submitOnChange="true" :optionDescriptionKey="'description'"
                    :optionNameKey="'role'" :optionValueKey="'role'"
                    @submit="onUpdateSelectionUser();slotProps.hide()"/>
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
        'users'
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
    }},
    computed: {
        ...mapGetters('selections', ['availableSelectionRoles']),
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
        ...mapActions('selections', ['addUsersToSelection','updateSelectionUsers','removeUsersFromSelection']),
        showUserContext(e, user) {
            const contextMenu = this.$refs.contextMenuUser
            this.contextUser = user
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
            this.addUsersToSelection({selection: this.selection, users: this.usersToAdd})
        },
        onUpdateSelectionUser() {
            // // Update state
            // this.contextUser.role = this.userToEdit.role
            this.updateSelectionUsers({selection: this.selection, users: [this.userToEdit]})
        },
        sortUsers(method, key) {
            // If if we are already sorting by the given key, flip the sort order
            this.sortKey = key

            this.sortArray(this.users, method, key)
        },
        onRemoveUser(user) {
            // If we have a selection, loop through the selection and remove those
            // Else, remove the parsed user
            this.removeUsersFromSelection({selection: this.selection, users: [user]})
        },
    }
}
</script>

<style scoped lang="scss">
</style>