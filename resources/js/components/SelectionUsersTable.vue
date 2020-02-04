<template>
    <div class="selection-users-table">
        <FlexTable>
            <template v-slot:topBar>
                <TableTopBar>
                    <template v-slot:right>
                        <span>{{selection.feedback_users.length}} records</span>
                    </template>
                </TableTopBar>
            </template>
            <template v-slot:header>
                <TableHeader class="select"><Checkbox/></TableHeader>
                <TableHeader class="name" :sortKey="'name'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Name</TableHeader>
                <TableHeader :sortKey="'email'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">E-mail</TableHeader>
                <TableHeader class="action">Action</TableHeader>
            </template>
            <template v-slot:body>
                <tr v-for="user in selection.feedback_users" :key="user.id" class="user-row table-row" ref="userRow" @contextmenu.prevent="showUserContext($event, user)">
                    <td class="select"><Checkbox/></td>
                    <td class="title clickable">
                        <i class="fas fa-user"></i>
                        <span>{{user.name}}</span>
                    </td>
                    <td class="email">{{user.email}}</td>
                    <td class="action">
                        <button class="invisible ghost-hover" @click="showUserContext($event, user)"><i class="far fa-ellipsis-h medium"></i></button>
                    </td>
                </tr>
            </template>
            <template v-slot:footer="slotProps">
                <td><button class="primary invisible" @click="onAddUser($event)"><i class="far fa-plus"></i><span>Add Users(s) to Selection</span></button></td>
            </template>
        </FlexTable>

        <ContextMenu ref="contextMenuUser" class="context-user" v-slot="slotProps">
            <div class="item-group">
                <div class="item" @click="onRemoveUser(slotProps.item); slotProps.hide()">
                    <div class="icon-wrapper"><i class="far fa-trash-alt"></i></div>
                    <u>R</u>emove User
                </div>
            </div>
        </ContextMenu>

        <ContextMenu ref="contextMenuAddUsers" class="context-add-users">
            <template v-slot:header="slotProps">
                Add Feedback User(s) to Selection
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <SelectButtons :type="'checkbox'" :options="availableUsers"
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
        </ContextMenu>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import sortArray from '../mixins/sortArray'
import User from '../store/models/User'

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
    }},
    computed: {
        availableUsers() {
            const allUsers = User.all()
            // Filter the available users to exclude users already added
            return allUsers.filter(user => !this.selection.feedback_users.find(x => x.id == user.id))
        }
    },
    methods: {
        ...mapActions('entities/subfiles', ['addUsersToSelection','removeUserFromSelection']),
        showUserContext(e, user) {
            const contextMenu = this.$refs.contextMenuUser
            contextMenu.item = user
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

            this.sortArray(this.selection.feedback_users, this.sortAsc, this.sortKey)
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
    .selection-users-table {
        padding: 16px;
    }
</style>