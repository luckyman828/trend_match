<template>
    <Modal ref="modal">
        <template v-slot:header="slotProps" v-if="selectedTeam != null">
            <h2 class="title">Invite people to <strong>{{selectedTeam.title}}</strong></h2>
            <span class="desc">We'll send an invite via <strong>e-mail</strong> they need to accept</span>
        </template>
        <template v-slot:body="slotProps" v-if="selectedTeam != null">
            <form @submit="submitInvite">

                <label class="team dropdown-parent">
                    <input type="text" name="team" :value="selectedTeam.title" disabled>
                    <span class="square tiny"><i class="fas fa-check"></i></span>

                    <Dropdown class="dark">
                        <template v-slot:button="slotProps">
                            <span @click="slotProps.toggle" class="open-dropdown dropdown-parent" :class="{active: !slotProps.collapsed}">Change team<i class="far fa-chevron-down"></i></span>
                        </template>
                        <template v-slot:header="slotProps">
                            <span>{{teams.length}} teams</span>
                            <span class="close" @click="slotProps.toggle"><i class="fal fa-times"></i></span>
                        </template>
                        <template v-slot:body>
                            <RadioButtons :options="teams" :optionNameKey="'title'" :optionValueKey="'id'" ref="teamRadio" v-model="selectedTeamId"/>
                        </template>
                        <template v-slot:footer="slotProps">
                            <div class="grid-2">
                                <span class="button green" @click="$refs.teamRadio.submit(); slotProps.toggle()">Save</span>
                                <span class="button invisible" @click="slotProps.toggle">Cancel</span>
                            </div>
                        </template>
                    </Dropdown>

                </label>

                <div class="users">

                    <div class="form-group user" v-for="(user, index) in newUsers" :key="index" :class="[ (index != 0 || user.email.length >= 3) ? 'card' : '' ]">

                        <div class="flex-wrapper header">
                            <h4>User {{index + 1}}</h4>
                            <span class="button icon-left light dark-hover" @click="deleteUser(index)"><i class="far fa-trash"></i>Delete</span>
                        </div>

                        <div class="form-element dropdown-parent">
                            <label :for="'invite-email-' + index">Email</label>
                            <input class="input-wrapper" type="email" name="email" :id="'invite-email-' + index" placeholder="example@mail.com" v-model="newUsers[index].email">
                            <Dropdown class="dark">
                                <template v-slot:button="slotProps">
                                    <span @click="slotProps.toggle(); $refs.userSelect[index].focusSearch()" class="open-dropdown dropdown-parent" :class="{active: !slotProps.collapsed}">
                                        or Choose from Users
                                        <i class="far fa-chevron-down"></i>
                                    </span>
                                </template>
                                <template v-slot:header="slotProps">
                                    <span>{{users.length}} users</span>
                                    <span class="close" @click="slotProps.toggle"><i class="fal fa-times"></i></span>
                                </template>
                                <template v-slot:body>
                                    <RadioButtons @keyup.esc="$refs.userSelect[index].toggle();" :options="availableUsers" :optionNameKey="'email'" :optionValueKey="'email'" :search="true" ref="userSelect" v-model="newUsers[index].email"/>
                                </template>
                                <template v-slot:footer="slotProps">
                                    <div class="grid-2">
                                        <span class="button green" @click="$refs.userSelect[index].submit(); slotProps.toggle()">Save</span>
                                        <span class="button invisible" @click="slotProps.toggle">Cancel</span>
                                    </div>
                                </template>
                            </Dropdown>
                            <!-- <DropdownV2 class="dark">
                                <template v-slot:button="slotProps">
                                    <span @click="slotProps.toggle(); $refs.userSelect[index].focusSearch()" :class="{active: !slotProps.collapsed}">
                                        or Choose from Users
                                        <i class="far fa-chevron-down"></i>
                                    </span>
                                </template>
                                <template v-slot:header="slotProps">
                                    <span>{{users.length}} users</span>
                                    <span class="close" @click="slotProps.toggle"><i class="fal fa-times"></i></span>
                                </template>
                                <template v-slot:body>
                                    <RadioButtons @keyup.esc="$refs.userSelect[index].toggle();" :options="availableUsers" :optionNameKey="'email'" :optionValueKey="'email'" :search="true" ref="userSelect" v-model="newUsers[index].email"/>
                                </template>
                                <template v-slot:footer="slotProps">
                                    <div class="grid-2">
                                        <span class="button green" @click="$refs.userSelect[index].submit(); slotProps.toggle()">Save</span>
                                        <span class="button invisible" @click="slotProps.toggle">Cancel</span>
                                    </div>
                                </template>
                            </DropdownV2> -->
                        </div>

                        <div class="form-element">
                            <label :for="'invite-name-' + index">Name (optional)</label>
                            <input class="input-wrapper" type="text" name="name" :id="'invite-name-' + index" placeholder="Optional" v-model="newUsers[index].name">
                        </div>

                        <!-- <div class="form-element dropdown-parent role">
                            <label :for="'invite-role-' + index">Role</label>
                            <div class="input-wrapper">
                                <span @click="$refs.roleDropdown[index].toggle()" class="role square" :class="'role-' + [newUsers[index].permission_level]">{{(roles[(Number([newUsers[index].permission_level])-1)].title).charAt(0).toUpperCase() + (roles[(Number([newUsers[index].permission_level])-1)].title).slice(1)}}</span>

                                <Dropdown class="dark" ref="roleDropdown">
                                    <template v-slot:button="slotProps">
                                        <span @click="slotProps.toggle" class="open-dropdown dropdown-parent" :class="{active: !slotProps.collapsed}">Change role<i class="far fa-chevron-down"></i></span>
                                    </template>
                                    <template v-slot:header="slotProps">
                                        <span>{{roles.length}} roles</span>
                                        <span class="close" @click="slotProps.toggle"><i class="fal fa-times"></i></span>
                                    </template>
                                    <template v-slot:body>
                                        <RadioButtons :options="roles" :optionNameKey="'title'" :optionValueKey="'id'" ref="roleRadio" v-model="newUsers[index].permission_level"/>
                                    </template>
                                    <template v-slot:footer="slotProps">
                                        <div class="grid-2">
                                            <span class="button green" @click="$refs.roleRadio[index].submit(); slotProps.toggle()">Save</span>
                                            <span class="button invisible" @click="slotProps.toggle">Cancel</span>
                                        </div>
                                    </template>
                                </Dropdown>
                            </div>
                        </div> -->
                    </div>

                </div>

                <div class="add-more">
                    <span class="button light icon-left dark-hover" @click="addUser"><i class="far fa-user-plus"></i>Add another</span>
                    <span class="button light icon-left dark-hover" @click="addUser"><i class="far fa-users"></i>Add many</span>
                </div>
                
                <input type="submit" class="button dark xl" :value="(newUsers.length > 1) ? 'Send ' + newUsers.length + ' invites' : 'Send invite'" :disabled="submitDisabled">
            </form>
        </template>
    </Modal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Dropdown from './Dropdown'
import DropdownV2 from './DropdownV2'
import RadioButtons from './RadioButtons'
import CheckboxButtons from './input/CheckboxButtons'
import Modal from './Modal'
import Role from '../store/models/Role'

export default {
    name: 'modalInviteToTeam',
    props: [
        'team',
        'users',
        'authUser',
        'teams',
    ],
    components: {
        Dropdown,
        DropdownV2,
        RadioButtons,
        Modal,
        CheckboxButtons,
    },
    data: function () { return {
        newUsers: [
            {email: '', name: '', permission_level: 1}
        ],
        selectedTeamId: null,
        selectedUserIds: [],
    }},
    computed: {
        ...mapGetters('persist', ['currentTeamId', 'currentWorkspaceId', 'currentFileId', 'userPermissionLevel', 'actionScope', 'actionScopeName', 'viewAdminPermissionLevel']),
        roles () {
            return Role.all().filter(role => role.id <= this.userPermissionLevel)
        },
        submitDisabled () {
            if (this.newUsers[0].email.length > 7)
                return false
            else return true
        },
        selectedTeam() {
            return this.teams.find(x => x.id == this.selectedTeamId)
        },
        multipleUsers() {
            if (this.selectedUserIds.length > 0)
                return true
            else return false
        },
        availableUsers() {
            return this.users.filter(user => {
                return user.teams.find(x => x.id == this.selectedTeamId) || this.newUsers.find(x => x.email == user.email) ? false : true
            })
        }
    },
    watch: {
        team: function (newTeam) {
            if (newTeam) this.selectedTeamId = newTeam.id
        }
    },
    methods: {
        ...mapActions('entities/userTeams', ['inviteUsersToTeam']),
        toggle() {
            this.$refs.modal.toggle()
        },
        close() {
            this.$refs.modal.close()
        },
        submitInvite(e) {
            e.preventDefault()
            this.inviteUsersToTeam({users: this.newUsers, team: this.selectedTeam, authUser: this.authUser})
            this.newUsers = [{email: '', name: '', permission_level: 1}]
            this.close()
        },
        setNewUsers(users) {
            let count = 0
            users.forEach(user => {
                // Edit the first new user to have the email of the first added user
                if (count == 0) {
                    this.newUsers[0].email = user
                }
                else {
                    this.newUsers.push({email: user, name: '', permission_level: 1})
                }
                count++
            })
        },
        deleteUser(index) {
            // Make sure we don't delete the last user
            if (this.newUsers.length <= 1) {
                this.newUsers[0].email = ''
                this.newUsers[0].name = ''
            } else {
                this.newUsers.splice(index,1)
            }
        },
        addUser() {
            this.newUsers.push({email: '', name: '', permission_level: 1})
        }
    },
    mounted() {
        if (this.team) this.selectedTeamId = this.team.id
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    label {
        &.team {
            position: relative;
            .square {
                position: absolute;
                left: 8px;
                top: 8px;
                background: $primary;
                color: white;
                height: 24px;
                width: 24px;
                text-align: center;
                i {
                    font-size: 10px;
                    line-height: 24px;
                }
            }
        }
    }
    .open-dropdown {
        position: absolute;
        right: 8px;
        bottom: 2px;
        font-weight: 500;
        color: $dark2;
        padding: 8px 0;
        display: block;
        cursor: pointer;
        &.active {
            color: $dark;
        }
        &:hover {
            color: $dark1;
        }
        i {
            margin-left: 8px;
        }
    }
    h4 {
        font-size: 16px;
        color: $dark2;
        margin: 0;
        font-weight: 500;
        margin-bottom: 16px;
    }
    label.team {
        margin-bottom: calc(24px + 1em)
    }
    .user {
        margin-bottom: calc(32px + 2em - 2px);
        transition: .3s;
        &:last-child {
            margin-bottom: calc(20px + 2em - 2px);
        }
        .flex-wrapper {
            opacity: 0;
        }
        &.card {
            margin-top: -14px;
            margin-left: -1em;
            margin-right: -1em;
            width: calc(100% + 2em);
            margin-bottom: 32px;
            .flex-wrapper {
                opacity: 1;
            }
            &:last-child {
                margin-bottom: 20px;
            }
        }
    }
    form {
        margin-bottom: 60px;
    }
    .flex-wrapper {
        display: flex;
        justify-content: space-between;
    }
    .add-more {
        margin-bottom: 24px;
    }
    label.role {
        input {
            color: transparent;
        }
        .square {
            position: absolute;
            left: 12px;
            bottom: 4px;
        }
    }

</style>