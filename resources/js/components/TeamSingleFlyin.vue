<template>
    <div class="team-single">
        <FlyinHeader :title="team.title" @closeFlyin="onClose" class="flyin-header" :next="nextTeamId" :prev="prevTeamId"
        @next="showNext" @prev="showPrev">
            <div class="item-group">
                <!-- <button class="invisible underline">{{team.subfiles.length}} Subfiles</button> -->
                <button class="invisible underline">{{team.users.length}} Users</button>
            </div>
            <div class="item-group">
                <button class="ghost"><i class="far fa-pen"></i><span>Edit</span></button>
                <button class="" style="margin-left: 16px"><i class="far fa-ellipsis-h medium"></i></button>
            </div>
            <!-- <div class="item-group">
                <button class="circle primary prev" :disabled="!prevTeamId" @click="showPrev"><i class="far fa-angle-left"></i></button>
                <button class="circle primary next" :disabled="!nextTeamId" @click="showNext"><i class="far fa-angle-right"></i></button>
            </div> -->
        </FlyinHeader>
        <div class="body">
            <FlexTable>
                <template v-slot:topBar>
                    <TableTopBar>
                        <template v-slot:left>
                            <button class="primary">Example</button>
                        </template>
                        <template v-slot:right>
                            <span>{{selected.length}} selected</span>
                            <span>{{team.users.length}} records</span>
                        </template>
                    </TableTopBar>
                </template>
                <template v-slot:header>
                    <TableHeader class="select"><Checkbox/></TableHeader>
                    <TableHeader class="title" :sortKey="'name'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Name</TableHeader>
                    <TableHeader :sortKey="'email'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">E-mail</TableHeader>
                    <TableHeader :sortKey="'teamRoleId'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">Team Role</TableHeader>
                    <TableHeader :sortKey="'currency'" :currentSortKey="sortKey" :sortAsc="sortAsc" @sort="sortUsers">User Currency</TableHeader>
                    <TableHeader class="action">Action</TableHeader>
                </template>
                <template v-slot:body>
                    <TeamSingleFlyinUsersTableRow :ref="'userRow-'+user.id" v-for="(user, index) in team.users" :key="user.id" :user="user" :index="index"
                    :team="team" @showContextMenu="showUserContext($event, user)" @editRole="onEditUserRole($event, user)"
                     @editCurrency="onEditUserCurrency($event, user)"/>
                </template>
                <template v-slot:footer="slotProps">
                    <td><button class="primary invisible" @click="onAddUser($event)"><i class="far fa-plus"></i><span>Add User(s) to Team</span></button></td>
                </template>
            </FlexTable>
        </div>

        <ContextMenu ref="contextMenuUser" class="context-user" v-slot="slotProps">
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
        </ContextMenu>

        <ContextMenu ref="contextMenuUserCurrency" class="context-currency" @hide="userToEdit.currency != originalUser.currency && updateUser(userToEdit)">
            <template v-slot:header="slotProps">
                Change User Currency
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <RadioButtons ref="userCurrencySelector" :options="availableCurrencies" 
                    :currentOptionId="originalUser.currency" :search="true" v-model="userToEdit.currency" :submitOnChange="true"/>
                </div>
            </template>
        </ContextMenu>

        <ContextMenu ref="contextMenuTeamRole" class="context-role" 
        @hide="userToEdit.teamRoleId != originalUser.teamRoleId && updateUserTeam({user_id: userToEdit.id, team_id: team.id, permission_level: userToEdit.teamRoleId})">
            <template v-slot:header="slotProps">
                Change Team Role
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <RadioButtons ref="userTeamRoleSelector" :options="availableTeamRoles" :currentOptionId="slotProps.item.teamRoleId"
                    v-model="userToEdit.teamRoleId" :submitOnChange="true" :optionDescriptionKey="'description'"
                    :optionNameKey="'name'" :optionValueKey="'id'"/>
                </div>
            </template>
        </ContextMenu>

        <ContextMenu ref="contextMenuAddUsers" class="context-add-users">
            <template v-slot:header="slotProps">
                Add User(s) to Team
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <SelectButtons :type="'checkbox'" :options="availableUsers"
                    v-model="userIdsToAdd" :submitOnChange="true"
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
        </ContextMenu>

    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import TeamSingleFlyinUsersTableRow from './TeamSingleFlyinUsersTableRow'
import sortArray from '../mixins/sortArray'
import UserTeam from '../store/models/UserTeam'
import AuthUser from '../store/models/AuthUser'

export default {
    name: 'teamSingleFlyin',
    components: {
        TeamSingleFlyinUsersTableRow,
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
        userIdsToAdd: []
    }},
    computed: {
        ...mapGetters('entities/teams', ['nextTeamId', 'prevTeamId']),
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
        ...mapMutations('entities/teams', ['setCurrentTeamId']),
        ...mapActions('entities/users', ['updateUser']),
        ...mapActions('entities/userTeams', ['removeUserFromTeam', 'updateUserTeam', 'addUsersToTeam']),
        onClose() {
            this.$emit('closeFlyin')
        },
        showNext() {
            if (this.nextTeamId)
                this.setCurrentTeamId(this.nextTeamId)
        },
        showPrev() {
            if (this.prevTeamId)
                this.setCurrentTeamId(this.prevTeamId)
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
    }
}
</script>

<style scoped lang="scss">

    .body {
        padding: 16px;
    }

</style>