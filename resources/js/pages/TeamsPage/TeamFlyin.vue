<template>
    <div class="team-single">
        <BaseFlexTable>
            <template v-slot:topBar>
                <BaseTableTopBar>
                    <template v-slot:left>
                        <BaseSearchField ref="searchField" :searchKey="['name','email']" :arrayToSearch="team.users" v-model="usersFilteredBySearch"/>
                    </template>
                    <template v-slot:right>
                        <span>{{team.users.length}} records</span>
                    </template>
                </BaseTableTopBar>
            </template>
            <template v-slot:header>
                <BaseTableHeader class="select"><BaseCheckbox/></BaseTableHeader>
                <BaseTableHeader class="title" :sortKey="'name'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Name</BaseTableHeader>
                <BaseTableHeader :sortKey="'email'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">E-mail</BaseTableHeader>
                <BaseTableHeader :sortKey="'teamRoleId'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Team Role</BaseTableHeader>
                <BaseTableHeader :sortKey="'currency'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">User Currency</BaseTableHeader>
                <BaseTableHeader class="action">Action</BaseTableHeader>
            </template>
            <template v-slot:body>
                <TeamFlyinUsersTableRow :ref="'userRow-'+user.id" v-for="(user, index) in usersFilteredBySearch" :key="user.id" :user="user" :index="index"
                :team="team" @showContextMenu="showUserContext($event, user)" @editRole="onEditUserRole($event, user)"
                    @editCurrency="onEditUserCurrency($event, user)"/>
            </template>
            <template v-slot:footer>
                <td><button class="primary invisible" @click="onAddUser($event)"><i class="far fa-plus"></i><span>Add User(s) to Team</span></button></td>
            </template>
        </BaseFlexTable>

        <BaseContextMenu ref="contextMenuUser" class="context-user" v-slot="slotProps">
            <div class="item-group">
                <div class="item" @click="$refs['userRow-'+slotProps.item.id][0].editName = true; slotProps.hide()">
                    <div class="icon-wrapper"><i class="far fa-pen"></i></div>
                    <u>R</u>ename User
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click.stop="onEditUserCurrency(slotProps.mouseEvent, slotProps.item)">
                    <div class="icon-wrapper"><i class="far fa-usd-circle"></i></div>
                    <u>C</u>hange User Currency
                </div>
                <div class="item" @click.stop="onEditUserRole(slotProps.mouseEvent, slotProps.item)">
                    <div class="icon-wrapper"><i class="far fa-key"></i></div>
                    Change Team <u>R</u>ole
                </div>
            </div>
            <div class="item-group">
                <div class="item" @click="onRemoveUserFromTeam(slotProps.item); slotProps.hide()">
                    <div class="icon-wrapper"><i class="far fa-trash-alt"></i></div>
                    <u>D</u>elete User from Team
                </div>
            </div>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuUserCurrency" class="context-currency" @hide="userToEdit.currency != originalUser.currency && updateUser(userToEdit)">
            <template v-slot:header>
                Change User Currency
            </template>
            <template v-slot>
                <div class="item-group">
                    <BaseRadioButtons ref="userCurrencySelector" :options="availableCurrencies" 
                    :currentOptionId="originalUser.currency" :search="true" v-model="userToEdit.currency" :submitOnChange="true"/>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuTeamRole" class="context-role" 
        @hide="userToEdit.teamRoleId != originalUser.teamRoleId && updateUserTeam({user_id: userToEdit.id, team_id: team.id, permission_level: userToEdit.teamRoleId})">
            <template v-slot:header>
                Change Team Role
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseRadioButtons ref="userTeamRoleSelector" :options="availableTeamRoles" :currentOptionId="slotProps.item.teamRoleId"
                    v-model="userToEdit.teamRoleId" :submitOnChange="true" :optionDescriptionKey="'description'"
                    :optionNameKey="'name'" :optionValueKey="'id'"/>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextMenuAddUsers" class="context-add-users">
            <template v-slot:header>
                Add User(s) to Team
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons :type="'checkbox'" :options="availableUsers"
                    v-model="userIdsToAdd" :submitOnChange="true" :optionDescriptionKey="'email'"
                    :optionNameKey="'name'" :optionValueKey="'id'" :search="true"/>
                </div>
                <div class="item-group">
                    <div class="item">
                        <button class="primary" :class="{disabled: userIdsToAdd.length < 1}" 
                        @click="addUsersToTeam({team, userIdsToAdd});userIdsToAdd = [];slotProps.hide()">
                            <span>Add <template v-if="userIdsToAdd.length > 0">{{userIdsToAdd.length}} 
                            </template>user<template v-if="userIdsToAdd.length > 1">s</template></span></button>
                        <button class="invisible ghost-hover" @click="slotProps.hide(); userIdsToAdd = []"><span>Cancel</span></button>
                    </div>
                </div>
            </template>
        </BaseContextMenu>

    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import TeamFlyinUsersTableRow from './TeamFlyinUsersTableRow'
import sortArray from '../../mixins/sortArray'
import UserTeam from '../../store/models/UserTeam'
import AuthUser from '../../store/models/AuthUser'

export default {
    name: 'teamSingleFlyin',
    components: {
        TeamFlyinUsersTableRow,
    },
    props: [
        'team',
        'workspaceUsers'
    ],
    mixins: [
        sortArray
    ],
    data: function() { return {
        sortKey: null,
        sortAsc: true,
        selected: [],
        userToEdit: null,
        originalUser: null,
        userIdsToAdd: [],
        usersFilteredBySearch: this.team.users
    }},
    watch: {
        team: function(newVal, oldVal) {
            // If we have a new team
            if (!oldVal || newVal.id != oldVal.id) {
                this.$refs.searchField.clear()
            }
        }
    },
    computed: {
        ...mapGetters('persist', ['authUser', 'availableTeamRoles', 'availableCurrencies']),
        authUserTeam() {
            return UserTeam.where('user_id', AuthUser.first().id).where('team_id', this.team.id).first()
        },
        availableUsers() {
            // Users who are on the workspace and not on the team
            const allUsers = JSON.parse(JSON.stringify(this.workspaceUsers))
            return allUsers.filter(workspaceUser => !this.team.users.find(teamUser => teamUser.id == workspaceUser.id))
        }
    },
    methods: {
        ...mapActions('entities/users', ['updateUser']),
        ...mapActions('entities/userTeams', ['removeUserFromTeam', 'updateUserTeam', 'addUsersToTeam']),
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
        showUserContext(e, user) {
            const contextMenu = this.$refs.contextMenuUser
            contextMenu.item = user
            contextMenu.show(e)
        },
        onAddUser(e) {
            const contextMenu = this.$refs.contextMenuAddUsers
            contextMenu.show(e)
        },
        onEditUserCurrency(mouseEvent, user) {
            this.userToEdit = user;
            this.originalUser = JSON.parse(JSON.stringify(user));
            const contextMenu = this.$refs.contextMenuUserCurrency
            contextMenu.item = user;
            contextMenu.show(mouseEvent)
            // Wait for the context menu to show in the DOM
            this.$nextTick(() => {
                // Set focus to the search field
                this.$refs.userCurrencySelector.focusSearch()
            })
        },
        onRemoveUserFromTeam(user) {
            // if ( confirm("Are you sure you want to remove this user from this team?") )
                this.removeUserFromTeam({user_id: user.id, team: this.team})
        },
        onEditUserRole(mouseEvent, user) {
            this.userToEdit = user;
            this.originalUser = JSON.parse(JSON.stringify(user));
            const contextMenu = this.$refs.contextMenuTeamRole
            contextMenu.item = user;
            contextMenu.show(mouseEvent)
        },
    },
    updated() {
        this.usersFilteredBySearch = this.team.users
    }
}
</script>

<style scoped lang="scss">

    .body {
        padding: 16px;
    }

</style>