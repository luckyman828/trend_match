<template>
    <div class="file-owners-table">
        <BaseFlexTable>
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:right>
                        <span>{{ file.owner_count || 0 }} records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select"><BaseCheckbox /></BaseTableHeader>
                <BaseTableHeader
                    class="name"
                    :sortKey="'name'"
                    :currentSortKey="sortKey"
                    :sortAsc="sortAsc"
                    @sort="sortUsers"
                    >Name</BaseTableHeader
                >
                <BaseTableHeader :sortKey="'email'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers"
                    >E-mail</BaseTableHeader
                >
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <tr
                    v-for="user in file.owners"
                    :key="user.id"
                    class="user-row table-row"
                    ref="userRow"
                    @contextmenu.prevent="showUserContext($event, user)"
                >
                    <td class="select"><BaseCheckbox /></td>
                    <td class="title clickable">
                        <i class="fas fa-user"></i>
                        <span>{{ user.name }}</span>
                    </td>
                    <td class="email">{{ user.email }}</td>
                    <td class="action">
                        <button class="no-bg ghost-hover" @click.stop="showUserContext($event, user)">
                            <i class="far fa-ellipsis-h medium"></i>
                        </button>
                    </td>
                </tr>
            </template>
            <template v-slot:footer>
                <td>
                    <button class="primary no-bg" @click="onAddUser($event)">
                        <i class="far fa-plus"></i><span>Add Owner(s) to File</span>
                    </button>
                </td>
            </template>
        </BaseFlexTable>

        <BaseContextMenu ref="contextMenuUser" class="context-user" v-slot="slotProps">
            <div class="item-group">
                <BaseContextMenuItem
                    class="item"
                    iconClass="far fa-trash-alt"
                    hotkey="KeyR"
                    @click="onRemoveUser(slotProps.item)"
                >
                    <u>R</u>emove User
                </BaseContextMenuItem>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuAddUsers" class="context-add-users">
            <template v-slot:header>
                Add Owner(s) to File
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons
                        :type="'checkbox'"
                        :options="availableUsers"
                        v-model="usersToAdd"
                        :submitOnChange="true"
                        :optionDescriptionKey="'email'"
                        :optionNameKey="'name'"
                        :search="true"
                    />
                </div>
                <div class="item-group">
                    <div class="item-wrapper">
                        <button
                            class="primary"
                            :class="{ disabled: usersToAdd.length < 1 }"
                            @click="
                                onAddUsersToFile()
                                usersToAdd = []
                                slotProps.hide()
                            "
                        >
                            <span
                                >Add
                                <template v-if="usersToAdd.length > 0">{{ usersToAdd.length }} </template>user<template
                                    v-if="usersToAdd.length > 1"
                                    >s</template
                                ></span
                            >
                        </button>
                        <button
                            class="no-bg ghost-hover"
                            style="margin-left: 8px;"
                            @click="
                                slotProps.hide()
                                usersToAdd = []
                            "
                        >
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </template>
        </BaseContextMenu>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import sortArray from '../../mixins/sortArray'

export default {
    name: 'fileOwnersTable',
    props: ['file'],
    mixins: [sortArray],
    data: function() {
        return {
            sortKey: null,
            sortAsc: true,
            selected: [],
            usersToAdd: [],
        }
    },
    computed: {
        ...mapGetters('users', ['users']),
        availableUsers() {
            const allUsers = this.users
            // Filter the available users to exclude users already added
            return allUsers.filter(user => !this.file.owners.find(owner => owner.id == user.id))
        },
    },
    methods: {
        ...mapActions('files', ['addUsersToFile', 'removeUserFromFile']),
        showUserContext(e, user) {
            const contextMenu = this.$refs.contextMenuUser
            contextMenu.item = user
            contextMenu.show(e)
        },
        onAddUser(e) {
            const contextMenu = this.$refs.contextMenuAddUsers
            contextMenu.show(e)
        },
        onAddUsersToFile(usersToAdd) {
            this.addUsersToFile({ file: this.file, users: this.usersToAdd })
        },
        sortUsers(method, key) {
            // If if we are already sorting by the given key, flip the sort order
            if (this.sortKey == key) {
                this.sortAsc = !this.sortAsc
            } else {
                this.sortKey = key
                this.sortAsc = method
            }
            let sortAsc = this.sortAsc

            this.sortArray(this.file.owners, this.sortAsc, this.sortKey)
        },
        onRemoveUser(user) {
            // If we have a selection, loop through the selection and remove those
            // Else, remove the parsed user
            this.removeUserFromFile({ file: this.file, user: user })
        },
    },
}
</script>

<style scoped lang="scss"></style>
