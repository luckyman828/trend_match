<template>
    <div class="selection-users-table">
        <BaseFlexTable>
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <h3>Selection Members</h3>
                    </template>
                    <template v-slot:right>
                        <span>{{selection.users.length}} records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select"><BaseCheckbox/></BaseTableHeader>
                <BaseTableHeader class="name" :sortKey="'name'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Name</BaseTableHeader>
                <BaseTableHeader :sortKey="'email'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">E-mail</BaseTableHeader>
                <BaseTableHeader :sortKey="'role'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Role</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <tr v-for="user in selection.users" :key="user.id" class="user-row table-row" ref="userRow" @contextmenu.prevent="showUserContext($event, user)">
                    <td class="select"><BaseCheckbox/></td>
                    <td class="title clickable">
                        <i class="fas fa-user"></i>
                        <span>{{user.name}}</span>
                    </td>
                    <td class="email">{{user.email}}</td>
                    <td class="role">
                        <button class="ghost editable" 
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
            <div class="item-group">
                <div class="item" @click.stop="showRoleContext(slotProps.mouseEvent, contextUser)">
                    <div class="icon-wrapper"><i class="far fa-user-shield"></i></div>
                    Change <u>R</u>ole
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click="onRemoveUser(contextUser)">
                    <div class="icon-wrapper"><i class="far fa-trash-alt"></i></div>
                    <u>R</u>emove User
                </div>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuAddUsers" class="context-add-users">
            <template v-slot:header>
                Add Feedback User(s) to Selection
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons :type="'checkbox'" :options="availableUsers"
                    v-model="usersToAdd" :submitOnChange="true" :optionDescriptionKey="'email'"
                    :optionNameKey="'name'" :search="true"/>
                </div>
                <div class="item-group">
                    <div class="item">
                        <button class="primary" :class="{disabled: usersToAdd.length < 1}" 
                        @click="onAddUsersToSelection();usersToAdd = [];slotProps.hide()">
                            <span>Add <template v-if="usersToAdd.length > 0">{{usersToAdd.length}} 
                            </template>user<template v-if="usersToAdd.length > 1">s</template></span></button>
                        <button class="invisible ghost-hover" @click="slotProps.hide(); usersToAdd = []"><span>Cancel</span></button>
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
                    <BaseSelectButtons type="radio" ref="userCurrencySelector" :options="availableSelectionRoles"
                    v-model="userToEdit.role" :submitOnChange="true" :optionDescriptionKey="'description'"
                    :optionNameKey="'name'" :optionValueKey="'name'"
                    @submit="contextUser.role = userToEdit.role; slotProps.hide()"/>
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
        'selection'
    ],
    mixins: [
        sortArray
    ],
    data: function() { return {
        sortKey: null,
        sortAsc: true,
        selected: [],
        usersToAdd: [],
        userToEdit: null,
        contextUser: null,
    }},
    computed: {
        ...mapGetters('selections', ['availableSelectionRoles']),
        ...mapGetters('users', ['users']),
        availableUsers() {
            const allUsers = this.users
            // Filter the available users to exclude users already added
            return allUsers.filter(user => !this.selection.users.find(x => x.id == user.id))
        }
    },
    methods: {
        ...mapActions('entities/selections', ['addUsersToSelection','removeUserFromSelection']),
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
            this.addUsersToSelection({selection: this.selection, usersToAdd: this.usersToAdd})
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

            this.sortArray(this.selection.users, this.sortAsc, this.sortKey)
        },
        onRemoveUser(user) {
            // If we have a selection, loop through the selection and remove those
            // Else, remove the parsed user
            this.removeUserFromSelection({selection: this.selection, user: user})
        },
    }
}
</script>

<style scoped lang="scss">
</style>