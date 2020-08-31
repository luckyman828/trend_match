<template>
    <div class="selection-users-table">
        <h3>Selection Members</h3>
        <BaseFlexTable :stickyHeader="false"
        :contentStatus="readyStatus"
        loadingMsg="loading users"
        errorMsg="error loading users"
        :errorCallback="() => initData()">
            <template v-slot:tabs>
                <BaseTableTab label="Members" :count="selection.users ? selection.users.length : 0" 
                modelValue="Members" v-model="currentUsersTableTab" 
                @change="selected = []"/>
                <BaseTableTab label="Excluded" :count="selection.denied_users? selection.denied_users.length : 0"
                modelValue="Excluded" v-model="currentUsersTableTab" 
                @change="selected = []"/>
            </template>
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <!-- <h3>Selection Members</h3> -->
                        <BaseSearchField :searchKey="['name','email']" 
                        :arrayToSearch="currentUsersTableTab == 'Members' ? selection.users : selection.denied_users" 
                        v-model="usersFilteredBySearch"/>
                    </template>
                    <template v-slot:right>
                        <span>showing {{usersFilteredBySearch.length}} of {{selection.users ? selection.users.length : 0}} records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select">
                    <BaseCheckbox :value="selected.length > 0" :modelValue="true" 
                    @change="(checked) => !!checked
                    ? selected = usersFilteredBySearch
                    : selected = []"/>
                </BaseTableHeader>
                <BaseTableHeader class="name" :sortKey="'name'" :currentSortKey="sortKey" @sort="sortUsers">Name</BaseTableHeader>
                <BaseTableHeader :sortKey="'email'" :currentSortKey="sortKey" @sort="sortUsers">E-mail</BaseTableHeader>
                <BaseTableHeader v-if="currentUsersTableTab == 'Members'" :sortKey="'role'" :currentSortKey="sortKey" @sort="sortUsers">Role</BaseTableHeader>
                <!-- <BaseTableHeader v-if="currentUsersTableTab == 'Members'" :sortKey="'job'" :currentSortKey="sortKey" @sort="sortUsers">Job</BaseTableHeader> -->
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <!-- Selection Members -->
                <template v-if="currentUsersTableTab == 'Members'">
                    <tr v-for="(user, index) in usersSorted" :key="user.id" class="user-row table-row" ref="userRow" 
                    :class="[{active: contextMenuIsActive(user)}, {self: user.id == authUser.id}]"
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
                        <!-- <td class="job">
                            <button v-if="userHasEditAccess" class="ghost editable sm" 
                            @click="showJobContext($event, user)">
                                <span>{{user.job}}</span>
                            </button>
                            <span v-else>{{user.job}}</span>
                        </td> -->
                        <td class="action">
                            <BaseButton v-if="!user.selectionLinkSent"
                                buttonClass="ghost editable sm" 
                                :disabled="user.role != 'Member'"
                                disabledTooltip="Only selection members can be sent a link"
                                @click="onSendSelectionLink([user])"
                            >
                                <i class="far fa-paper-plane"></i>
                                <span>Send link</span>
                            </BaseButton>
                            <div class="ghost sm" v-else>
                                <i class="far fa-check"></i>
                                <span>Link sent</span>
                            </div>

                            <button v-if="userHasEditAccess" class="invisible ghost-hover" 
                            @click="showUserContext($event, user)">
                                <i class="far fa-ellipsis-h medium"></i>
                            </button>
                        </td>
                    </tr>
                </template>
                <!-- Excluded Users -->
                <template v-if="currentUsersTableTab == 'Excluded'">
                    <tr v-for="(user, index) in usersSorted" :key="user.id" class="user-row table-row" ref="userRow"
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

        <BaseContextMenu ref="contextMenuUser" class="context-user">
            <!-- Manually added users  -->
            <template v-slot:header v-if="selected.length > 1">
                <span>Choose action for {{selected.length}} users</span>
            </template>
            <template v-slot>
                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-user-shield"
                    hotkey="KeyC"
                    @click="showRoleContext(contextMouseEvent, contextUser)">
                        <span><u>C</u>hange role{{selected.length > 0 ? 's' : ''}}</span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-user-shield"
                    tooltip="Send the user(s) a link to join the selection on the iOS app."
                    :disabled="selected.length > 0 ? !selected.find(x => x.role == 'Member') : contextUser.role != 'Member'"
                    disabledTooltip="Only Selection Members can be invited to join the iOS app."
                    :hotkey="['KeyL', 'KeyS']"
                    @click="onSendSelectionLink(selected.length > 0 ? selected : [contextUser])">
                        <span><u>S</u>end <u>l</u>ink</span>
                    </BaseContextMenuItem>
                </div>
                <div class="item-group">
                    <BaseContextMenuItem
                    :hotkey="['KeyR', 'KeyE']"
                    :iconClass="contextUser.inherit_from_teams || selected.length > 1 ? 'far fa-user-times' : 'far fa-trash-alt'"
                    @click="onRemoveUsers(contextUser)">
                        <span>
                            <span v-if="selected.length > 1"><u>R</u>emove / <u>E</u>xclude </span>
                            <span v-else-if="contextUser.inherit_from_teams"><u>E</u>xclude </span>
                            <span v-else><u>R</u>emove </span>
                            User{{selected.length > 1 ? 's' : ''}}
                        </span>
                    </BaseContextMenuItem>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuExcludedUser" class="context-user">
            <template v-slot:header v-if="selected.length > 1">
                <span>Choose action for {{selected.length}} users</span>
            </template>
            <template v-slot>
                <div class="item-group">
                    <BaseContextMenuItem iconClass="far fa-user-plus"
                    hotkey="KeyR"
                    @click="onReAddUsersToSelection(selected.length > 0 ? selected : [contextUser])">
                        <span><u>R</u>e-add User{{selected.length > 0 ? 's' : ''}}</span>
                    </BaseContextMenuItem>
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
                    <BaseSelectButtons type="radio" ref="userCurrencySelector" :options="availableSelectionRoles"
                    v-model="userToEdit.role" :submitOnChange="true" :optionDescriptionKey="'description'"
                    :optionNameKey="'role'" :optionValueKey="'role'"
                    @submit="onUpdateSelectionUsersRole();slotProps.hide()"/>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuJob" class="context-role">
            <template v-slot:header>
                Change Selection Job
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons type="radio" ref="userCurrencySelector" :options="filteredAvailableSelectionJobs"
                    v-model="userToEdit.job" :submitOnChange="true" :optionDescriptionKey="'description'"
                    :optionNameKey="'role'" :optionValueKey="'role'"
                    @submit="onUpdateSelectionUsersJob();slotProps.hide()"/>
                </div>
            </template>
        </BaseContextMenu>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import sortArray from '../../mixins/sortArray'

export default {
    name: 'selectionUsersTable',
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
        currentUsersTableTab: 'Members',
        authUserIsOwner: false,
        usersFilteredBySearch: [],
    }},
    computed: {
        ...mapGetters('selections', {
            selection: 'getCurrentSelection',
            getAuthUserHasSelectionEditAccess: 'getAuthUserHasSelectionEditAccess',
            getSelectionUsersStatus: 'getSelectionUsersStatus',
            availableSelectionRoles: 'availableSelectionRoles',
            availableSelectionJobs: 'getAvailableSelectionJobs',
        }),
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('workspaces', ['authUserWorkspaceRole']),
        ...mapGetters('users', {workspaceUsers: 'users', getUsersStatus: 'getUsersStatus'}),
        ...mapGetters('contextMenu', ['getContextMenuIsVisible']),
        readyStatus() {
            if (this.getUsersStatus == 'error' || this.getSelectionUsersStatus == 'error') return 'error'
            if (this.getUsersStatus == 'loading' || this.getSelectionUsersStatus == 'error') return 'loading'
            return 'success'
        },
        userHasEditAccess() {
            return this.getAuthUserHasSelectionEditAccess(this.selection) || this.authUserIsOwner
        },
        filteredAvailableSelectionJobs() {
            return this.availableSelectionJobs.filter(x => {
                return this.selection.type != 'Master' ? x.role != 'Approver' : true
            })
        },
        availableUsers() {
            if (!this.selection.users || !this.workspaceUsers) return []
            // Users who are on the workspace and not on the team
            const allUsers = JSON.parse(JSON.stringify(this.workspaceUsers))
            return allUsers.filter(user => !this.selection.users.find(x => x.id == user.id)).sort((a,b) => {
                if (a.id == this.authUser.id) return -1
            })
        },
        usersSorted() {
            return this.usersFilteredBySearch.sort((a,b) => a.id == this.authUser.id ? -1 : 0)
        }
    },
    methods: {
        ...mapActions('selections', ['addUsersToSelection','updateSelectionUsers',
        'removeUsersFromSelection', 'reAddUsersToSelection', 'fetchSelection', 'sendLinkToSelectionUsers']),
        ...mapActions('users', ['fetchUsers']),
        ...mapMutations('selections', ['UPDATE_SELECTION']),
        initData(forceRefresh) {
            // Check if we have any workspace teams, else fetch them
            if (this.getUsersStatus != 'success' && this.getUsersStatus != 'loading') this.fetchUsers()

            // Fetch selection with users and teams
            if (forceRefresh || (this.getSelectionUsersStatus != 'loading' && !this.selection.users)) {
                this.fetchSelection({selectionId: this.selection.id, addToState: false})
            }
            this.authUserIsOwner = this.selection.your_role == 'Owner'
        },
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
            // this.userToEdit = JSON.parse(JSON.stringify(user))
            this.userToEdit = user
            contextMenu.show(e)
        },
        showJobContext(e, user) {
            const contextMenu = this.$refs.contextMenuJob
            this.contextUser = user
            // this.userToEdit = JSON.parse(JSON.stringify(user))
            this.userToEdit = user
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
            
            // Loop thorugh the users to post and test if they include the authUser. If they do update our selection role
            const authUser = usersToPost.find(x => x.id == this.authUser.id)
            if (authUser) {
                this.selection.your_role = authUser.role
                if (authUser.role == 'Member') this.selection.your_job = 'Feedback'
                else if (authUser.role == 'Owner') this.selection.your_job = 'Alignment'
                else if (authUser.role == 'Approver') this.selection.your_job = 'Approval'
                else this.selection.your_job == null
                
                this.UPDATE_SELECTION(this.selection)
            }
        },
        onUpdateSelectionUsersJob() {
            // Define the user to base the new role to set on
            const baseUser = this.userToEdit
            // Check if we have a selection of users
            // If so, set the currency for all the selected users
            let usersToPost
            if (this.selected.length > 0) {
                usersToPost = this.selected.map(user => {
                    user.job = baseUser.job
                    return user
                })
            } else usersToPost = [baseUser]
            // Update users
            this.updateSelectionUsers({selection: this.selection, users: usersToPost})
            
            // Loop thorugh the users to post and test if they include the authUser. If they do update our selection role
            const authUser = usersToPost.find(x => x.id == this.authUser.id)
            if (authUser) {
                this.selection.your_job = authUser.job
                this.UPDATE_SELECTION(this.selection)
            }
        },
        sortUsers(method, key) {
            // If if we are already sorting by the given key, flip the sort order
            this.sortKey = key

            this.sortArray(this.usersFilteredBySearch, method, key)
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
        onSendSelectionLink(users) {
            // Filter out users whose role is not Member
            const usersFiltered = users.filter(x => x.role == 'Member')
            this.sendLinkToSelectionUsers({selection: this.selection, users: usersFiltered})
        }
    },
    created() {
        this.initData()
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.user-row {
    &.self {
        .title {
            i {
                color: $primary;
            }
        }
        font-weight: 500;
    }
}

</style>