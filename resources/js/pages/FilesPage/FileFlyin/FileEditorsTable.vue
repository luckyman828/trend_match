<template>
    <div class="file-users-table">
        <BaseFlexTable
            :contentStatus="readyStatus"
            loadingMsg="loading users"
            errorMsg="error loading users"
            :errorCallback="() => initData()"
        >
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <BaseSearchField
                            ref="searchField"
                            :searchKey="['name', 'email']"
                            :arrayToSearch="file.users"
                            v-model="usersFilteredBySearch"
                        />
                    </template>
                    <template v-slot:right>
                        <span>{{ file.users ? file.users.length : 0 }} records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select">
                    <BaseCheckbox
                        :value="selectedUsers.length > 0"
                        :modelValue="true"
                        @change="checked => (checked ? (selectedUsers = team.users) : (selectedUsers = []))"
                    />
                </BaseTableHeader>
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
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <FileEditorsTableRow
                    v-for="(user, index) in usersFilteredBySearch"
                    :key="user.id"
                    :user="user"
                    :index="index"
                    :file="file"
                    v-model="selectedUsers"
                    :selectedUsers="selectedUsers"
                />
            </template>
            <template v-slot:footer>
                <td>
                    <BaseButton
                        buttonClass="primary no-bg"
                        :disabled="authUserWorkspaceRole != 'Admin'"
                        v-tooltip="authUserWorkspaceRole != 'Admin' && 'Only admins can add team members'"
                        @click="onAddUser($event)"
                    >
                        <i class="far fa-plus"></i><span>Add edtior(s) to file</span>
                    </BaseButton>
                </td>
            </template>
        </BaseFlexTable>

        <BaseSelectButtonsContextMenu
            ref="contextMenuAddUsers"
            header="Add edtior(s) to file"
            :type="'checkbox'"
            :options="availableUsers"
            v-model="usersToAdd"
            :emitOnChange="true"
            :optionDescriptionKey="'email'"
            :optionNameKey="'name'"
            :search="true"
            :submitText="`Add ${usersToAdd.length} user${usersToAdd.length > 1 ? 's' : ''}`"
            :submitDisabled="usersToAdd.length < 1"
            @submit="
                addUsersToFile({ file, users: usersToAdd })
                usersToAdd = []
            "
            @cancel="usersToAdd = []"
        />
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import FileEditorsTableRow from './FileEditorsTableRow'
import sortArray from '../../../mixins/sortArray'

export default {
    name: 'fileEditorsTable',
    components: {
        FileEditorsTableRow,
    },
    mixins: [sortArray],
    props: ['file'],
    data: function() {
        return {
            sortKey: null,
            sortAsc: true,
            selectedUsers: [],
            contextItem: null,
            contextMouseEvent: null,
            usersFilteredBySearch: null,
            usersToAdd: [],
        }
    },
    computed: {
        ...mapGetters('users', ['users', 'getUsersStatus']),
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        ...mapGetters('files', ['getFileUsersStatus']),
        readyStatus() {
            if (this.getUsersStatus == 'error' || this.getFileUsersStatus == 'error') return 'error'
            if (this.getUsersStatus == 'loading' || this.getFileUsersStatus == 'loading') return 'loading'
            return 'success'
        },
        availableUsers() {
            if (!this.file.users || !this.users) return []
            // Users who are on the workspace and not on the team
            const allUsers = JSON.parse(JSON.stringify(this.users))
            return allUsers
                .filter(workspaceUser => !this.file.users.find(fileUser => fileUser.id == workspaceUser.id))
                .sort((a, b) => {
                    if (a.id == this.authUser.id) return -1
                })
        },
    },
    methods: {
        ...mapActions('files', ['removeUsersFromFile', 'addUsersToFile', 'fetchFileUsers']),
        ...mapActions('users', ['fetchUsers']),
        initData(forceRefresh) {
            if (forceRefresh || this.file.users == null) {
                // Check if we have any workspace users, else fetch them
                if (this.getUsersStatus != 'success' && this.getUsersStatus != 'loading') this.fetchUsers()

                // Fetch selection with users and teams
                if (forceRefresh || (this.getFileUsersStatus != 'loading' && !this.file.users)) {
                    this.fetchFileUsers(this.file)
                }
            }
        },
        onAddUser(e) {
            const contextMenu = this.$refs.contextMenuAddUsers
            contextMenu.show(e)
        },
        onRemoveUsersFromFile(users) {
            this.removeUsersFromFile({ users: JSON.parse(JSON.stringify(this.selectedUsers)), team: this.team })
            this.selectedUsers = []
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

            this.sortArray(this.file.users, this.sortAsc, this.sortKey)
        },
    },
    created() {
        this.initData()
    },
}
</script>

<style></style>
