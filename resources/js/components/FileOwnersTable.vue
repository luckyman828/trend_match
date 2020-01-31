<template>
    <div class="file-owners-table">
        <FlexTable>
            <template v-slot:topBar>
                <TableTopBar>
                    <template v-slot:right>
                        <span>0 records</span>
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
                <tr v-for="user in file.owners" :key="user.id" class="user-row table-row" ref="userRow" @contextmenu.prevent="$emit('showContextMenu', $event, user)">
                    <td class="select"><Checkbox/></td>
                    <td class="title clickable">
                        <i class="fas fa-user"></i>
                        <span>{{user.name}}</span>
                    </td>
                    <td class="email">{{user.email}}</td>
                    <td class="action">
                        <button class="invisible ghost-hover" @click.stop="$emit('showContextMenu', $event, user)"><i class="far fa-ellipsis-h medium"></i></button>
                    </td>
                </tr>
            </template>
            <template v-slot:footer="slotProps">
                <td><button class="primary invisible" @click="onAddUser($event)"><i class="far fa-plus"></i><span>Add Owner(s) to File</span></button></td>
            </template>
        </FlexTable>

        <ContextMenu ref="contextMenuUser" class="context-user" v-slot="slotProps">
            <div class="item-group">
                <div class="item" @click="onRemoveUser(slotProps.item); slotProps.hide()">
                    <div class="icon-wrapper"><i class="far fa-pen"></i></div>
                    <u>R</u>emove User
                </div>
            </div>
        </ContextMenu>

        <ContextMenu ref="contextMenuAddUsers" class="context-add-users">
            <template v-slot:header="slotProps">
                Add Owner(s) to File
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <SelectButtons :type="'checkbox'" :options="availableUsers"
                    v-model="userIdsToAdd" :submitOnChange="true" :optionDescriptionKey="'email'"
                    :optionNameKey="'name'" :optionValueKey="'id'" :search="true"/>
                </div>
                <div class="item-group">
                    <div class="item">
                        <button class="primary" :class="{disabled: userIdsToAdd.length < 1}" 
                        @click="onAddUsersToFile();userIdsToAdd = [];slotProps.hide()">
                            <span>Add <template v-if="userIdsToAdd.length > 0">{{userIdsToAdd.length}} 
                            </template>user<template v-if="userIdsToAdd.length > 1">s</template></span></button>
                        <button class="invisible ghost-hover" @click="slotProps.hide(); userIdsToAdd = []"><span>Cancel</span></button>
                    </div>
                </div>
            </template>
        </ContextMenu>
    </div>
</template>

<script>
import sortArray from '../mixins/sortArray'
import User from '../store/models/User'

export default {
    name: 'fileOwnersTable',
    props: [
        'file'
    ],
    mixins: [
        sortArray
    ],
    data: function() { return {
        sortKey: null,
        sortAsc: true,
        selected: [],
        userIdsToAdd: [],
    }},
    computed: {
        availableUsers() {
            const allUsers = User.all()
            // Filter the available users to exclude users already added
            return allUsers.filter(user => file.owners.find(owner => owner.id == user.id))
        }
    },
    methods: {
        showUserContext(e, user) {
            const contextMenu = this.$refs.contextMenuUser
            contextMenu.item = user
            contextMenu.show(e)
        },
        onAddUser(e) {
            const contextMenu = this.$refs.contextMenuAddUsers
            contextMenu.show(e)
        },
        onAddUsersToFile() {

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
        onRemoveUser(user) {
            // If we have a selection, loop through the selection and remove those
            // Else, remove the parsed user
        },
        removeUser(user) {
            // code to remove user from file
        }
    }
}
</script>

<style scoped lang="scss">
    .file-owners-table {
        padding: 16px;
    }
</style>