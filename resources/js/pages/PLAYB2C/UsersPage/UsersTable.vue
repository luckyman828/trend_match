<template>
    <div class="users-table">
        <BaseTable
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
            :searchKey="['name', 'email']"
            :searchResult.sync="usersFilteredBySearch"
            itemType="user"
            :hideContextButton="true"
        >
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
                <BaseTableHeader>Action</BaseTableHeader>
            </template>
            <template v-slot:row="rowProps">
                <UsersTableRow :user="rowProps.item" :selectedUsers.sync="selectedUsers" />
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
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import UsersTableRow from './UsersTableRow'
import sortArray from '../../../mixins/sortArray'

export default {
    name: 'usersTable',
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
        ...mapGetters('kollektApps', {
            users: 'getCurrentAppUsers',
        }),
        ...mapGetters('users', ['getUsers', 'getUsersStatus']),
        ...mapGetters('tables', ['getUsersTable']),
        readyStatus() {
            return this.getUsersStatus
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
        ...mapActions('users', ['fetchUsers']),
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
        onNewUser() {
            // emit open new user modal
            this.$emit('on-new-user')
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
