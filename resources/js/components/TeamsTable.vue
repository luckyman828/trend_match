<template>
    <div class="teams-table card">
        <div class="team-totals">
            <span>{{selectedCount}} selected</span>
            <span>{{teams.length}} records</span>
        </div>
        <div class="flex-table">
            <div class="header-row flex-table-row">
                <th class="select">Select <i class="fas fa-chevron-down"></i></th>
                <th class="clickable title" :class="{active: this.sortBy == 'title'}" @click="onSortBy('title', true)">
                    Team <i class="fas" :class="[(this.sortBy == 'title' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'assigned'}" class="clickable assigned" @click="onSortBy('assigned', true)">
                   Assigned <i class="fas" :class="[(this.sortBy == 'assigned' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'users'}" class="clickable members" @click="onSortBy('users', false)">
                    Members <i class="fas" :class="[(this.sortBy == 'users' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'collections'}" class="clickable collections" @click="onSortBy('collections', false)">
                    Collections <i class="fas" :class="[(this.sortBy == 'collections' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'status'}" class="clickable status" @click="onSortBy('status', false)">
                    Status <i class="fas" :class="[(this.sortBy == 'status' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th class="action">Action</th>
                <th></th>
            </div>
            <template v-if="!loading">

                <div v-if="teamsSorted <= 0" class="team-row item-row flex-table-row">
                    <span style="display: block; margin: auto; padding: 0;">You dont have access to any teams</span>
                </div>

                <div class="team-row-wrapper" v-for="(team, index) in teamsSorted" :key="team.id">

                    <div class="team-row item-row flex-table-row" ref="teamRow" :class="[{expanded: expandedIds.includes(team.id)}, {collapsed: !expandedIds.includes(team.id)}]">
                        <td class="select">
                            <label class="checkbox">
                                <input type="checkbox" @change="onSelect(index)" />
                                <span class="checkmark"></span>
                            </label>
                        </td>
                        <td class="title clickable" @click="expandUsers(team)"><span :class="(expandedIds.includes(team.id)) ? 'light-2' : 'invisible'" class="button icon-left"><i class="far fa-chevron-right"></i>{{team.title}}</span></td>
                        <td class="assigned">{{team.expanded}}</td>
                        <td class="members"><span>{{team.users.length}}<template v-if="team.invites.length > 0"> ({{team.invites.length}})</template></span></td>
                        <td class="collections"><span>N/A</span></td>
                        <td class="status"><span>N/A</span></td>
                        <td class="action">
                            <span v-if="expandedIds.includes(team.id)" class="button green active"  @click="openInviteToTeam(team)">Add to team</span>
                            <span v-else class="button ghost"  @click="expandUsers(team)">Edit team</span>
                            <span class="view-single button invisible" @click="expandUsers(team)">View</span>
                        </td>
                    </div>

                    <div class="team-users" :class="[{expanded: expandedIds.includes(team.id)}, {collapsed: !expandedIds.includes(team.id)}]">
                        <div class="user-row item-row sub-item-row flex-table-row" v-for="(user, index) in team.users" :key="index">
                            <td class="index">{{index + 1}}</td>
                            <td class="name">{{ (user.name != null) ? user.name : 'No name set' }}</td>
                            <td class="email">{{user.email}}</td>
                            <td class="collections">-</td>
                            <td class="role dropdown-parent">
                                <template v-if="userPermissionLevel < user.role_id">
                                    <span class="square" :class="'role-' + user.role_id">{{user.role.title}}</span>
                                </template>
                                <template v-else>
                                    
                                    <Dropdown class="dark" ref="roleDropdown">
                                        <template v-slot:button="slotProps">
                                            <span class="square clickable dropdown-parent" :class="'role-' + user.role_id" @click="editUser = user, $refs.roleDropdown[index].toggle()">{{user.role.title}}</span>
                                        </template>
                                        <template v-slot:header="slotProps">
                                            <span>Change role</span>
                                            <span class="close" @click="slotProps.toggle"><i class="fal fa-times"></i></span>
                                        </template>
                                        <template v-slot:body>
                                            <RadioButtons :options="roles" :optionNameKey="'title'" :optionValueKey="'id'" ref="roleRadio" @submit="changeRole({user_id: user.id, role_id: $event})"/>
                                        </template>
                                        <template v-slot:footer="slotProps">
                                            <div class="grid-2">
                                                <span class="button green" @click="$refs.roleRadio[index].submit(); slotProps.toggle()">Save</span>
                                                <span class="button invisible" @click="slotProps.toggle">Cancel</span>
                                            </div>
                                        </template>
                                    </Dropdown>
                                </template>
                            </td>
                            <td></td>
                            <td class="action">
                                <span class="resend"></span>
                                <span class="remove button red invisible" @click="removeUser(user.id, team.id)"><i class="far fa-user-minus"></i> Remove</span>
                            </td>
                        </div>

                        <div class="user-row item-row sub-item-row flex-table-row invited-row" v-for="(invited, index) in team.invites" :key="index + team.users.length + 1">
                            <td class="index">{{team.users.length + index + 1}}</td>
                            <td class="name">No name yet</td>
                            <td class="email">{{invited.email}}</td>
                            <td class="collections"><span><i class="far fa-exclamation-triangle"></i> invited</span></td>
                            <td class="role"></td>
                            <td></td>
                            <td class="action">
                                <span class="resend button dark invisible" @click="resendInvite($event, invited.email, team)"><i class="far fa-paper-plane"></i> Resend invite</span>
                                <span class="remove button red invisible" @click="removeInvite(invited.email, team.id)"><i class="far fa-user-minus"></i> Remove</span>
                            </td>
                        </div>

                        <div class="user-row item-row sub-item-row flex-table-row invited-row add-member" @click="openInviteToTeam(team)">
                            <td><i class="far fa-user-plus"></i>Add Member to team</td>
                        </div>
                    </div>

                </div>
            </template>
        </div>
        <template v-if="loading">
            <Loader/>
        </template>
    </div>
</template>

<script>
import Loader from './Loader'
import Dropdown from './Dropdown'
import RadioButtons from './RadioButtons'
import { mapActions, mapGetters } from 'vuex'
import Role from '../store/models/Role'

export default {
    name: 'teamsTable',
    props: [
        'teams',
        'loading',
        'authUser',
        'collection',
        'selectedCount',
        'users',
        'authUser',
    ],
    components: {
        Loader,
        Dropdown,
        RadioButtons,
    },
    data: function() { return {
        sortBy: 'id',
        sortAsc: true,
        expandedIds: [],
        editUser: {
            permission_level: '',
        }
    }},
    computed: {
        ...mapGetters('persist', ['currentTeamId', 'currentWorkspaceId', 'currentFileId', 'userPermissionLevel', 'actionScope', 'actionScopeName', 'viewAdminPermissionLevel']),
        roles () {
            return Role.all().filter(role => role.id <= this.userPermissionLevel)
        },
        teamsSorted() {
            const teams = this.teams
            teams.forEach(team => {
                team.active = false
            });
            let key = this.sortBy
            let sortAsc = this.sortAsc
            const dataSorted = teams.sort((a, b) => {

                // If the keys don't have length - sort by the key
                if (!teams[0][key].length) {

                    if (sortAsc)
                        return (a[key] > b[key]) ? 1 : -1
                        else return (a[key] < b[key]) ? 1 : -1

                // If the keys have lengths - sort by their length
                } else {

                    if (sortAsc)
                        return (a[key].length > b[key].length) ? 1 : -1
                        else return (a[key].length < b[key].length) ? 1 : -1

                }
            })
            return dataSorted
        }
    },
    methods: {
        ...mapActions('entities/teamInvites', ['deleteInvite', 'resend']),
        ...mapActions('entities/userTeams', ['removeUserFromTeam']),
        ...mapActions('entities/users', ['changeRole']),
        onSelect(index) {
            this.$emit('onSelect', index)
        },
            
        hideTooltip() {
            this.tooltip.active = false;
        },
        onSortBy(key, method) {      
            // Check if the sorting key we are setting is already the key we are sorting by
            // If this is the case, toggle the sorting method (asc|desc)
            if (this.sortBy !== key) {
                this.sortAsc = method
                this.sortBy = key
            } else {
                this.sortAsc = !this.sortAsc
            }

        },
        expandUsers(team) {
            const expanded = this.expandedIds
            const found = expanded.findIndex(el => el == team.id)
            const result = (found >= 0) ? expanded.splice(found, 1) : expanded.push(team.id)
            this.setHeights()
        },
        setHeights() {
            const elements = document.querySelectorAll('.team-users')
            if (elements.length > 0)
                elements.forEach(el => {
                    el.style['max-height'] = el.scrollHeight + "px"
                })
        },
        openInviteToTeam(team) {
            this.$emit('onOpenInviteToTeam', team)
        },
        async resendInvite(e, email, team) {
            // const response = await this.resend({email: email, team: team, authUser: this.authUser})
            let succes = false
            await this.resend({email: email, team: team, authUser: this.authUser}).then(response => succes = response)
            const el = e.target
            if (succes) {
                el.classList.add('disabled')
                el.innerHTML = '<i class="green fas fa-check-circle"></i> Invite sent'
            }
            else {
                el.innerHTML = '<i class="red fas fa-times-circle"></i> Failed'
            }
        },
        removeInvite(email, team_id) {
            if ( confirm("Are you sure you want to delete this invite?") )
                this.deleteInvite({email: email, team_id: team_id})
        },
        removeUser(user_id, team_id) {
            if ( confirm("Are you sure you want to remove this user from this team?") )
                this.removeUserFromTeam({user_id: user_id, team_id: team_id})
        }
    },
    updated() {
        this.setHeights()
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .teams-table {
        margin-top: 52px;
        padding-top: 0;
        .team-row {
            .view-single {
                border-color: transparent;
            }
            &.expanded {
                background: $light1;
                .view-single {
                    color: $dark;
                    background: white;
                }
            }
        }
    }
    .flex-table-row {
        padding: 12px 0;
        > * {
            &.select, &:nth-child(1) {
                padding-left: 16px;
                min-width: 80px;
            }
            &:nth-child(2) {
                padding-left: 32px;
                min-width: 220px;
            }
            &:nth-child(3) {
                min-width: 220px;
            }
            &:nth-child(4) {
                min-width: 112px;
                padding-left: 16px;
            }
            &:nth-child(5) {
                min-width: 132px;
                padding-left: 16px;
            }
            &:nth-child(6) {
                min-width: 80px;
                padding-left: 16px;
            }
            &:nth-child(7) {
                margin-left: auto;
                min-width: 80px;
                padding-left: 16px;
                padding-right: 32px;
            }
            &.action {
                > :first-child {
                    margin-right: 20px;
                }
            }
        }
        td {
            &.title {
                font-size: 13px;
                color: $dark;
                .square {
                    margin-left: -32px;
                    color: $dark;
                    background: none;
                    i {
                        transition: .3s;
                        font-size: 12px;
                    }
                }
            }
        }
        &.invited-row {
            .name, .email, .role {
                opacity: .5;
            }
            &.add-member {
                justify-content: center;
                cursor: pointer;
                &:hover {
                    td {
                        border-bottom: solid 1px $dark;
                    }
                }
                td {
                    color: $dark05;
                    font-weight: 500;
                    font-size: 12px;
                    padding: 0;
                    border-bottom: solid 1px transparent;
                    i {
                        font-size: 13px;
                    }
                }
            }
        }
        i {
            // margin-right: 8px;
        }
    }
    i {
        font-size: 11px;
    }
    .show-more {
        width: 100%;
        margin: 16px auto 0;
        text-align: center;
        display: inline-block;
    }
    .loading {
        animation: loading 2s;
        animation-iteration-count: infinite;
    }
    @keyframes loading {
        0% {opacity: 0;}
        50% {opacity: 1;}
        100% {opacity: 0;}
    }
    .checkbox {
      display: block;
      position: relative;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      margin-bottom: 0;
      padding-top: 5px;
      padding-bottom: 5px;
    }

    .checkbox input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkmark {
      content: "";
      display: inline-block;
      vertical-align: text-top;
      width: 24px;
      height: 24px;
      background: white;
      border: 1px solid #dfdfdf;
    }

    .checkbox input:checked ~ .checkmark {
      background: linear-gradient(#3b86ff, #3b86ff) no-repeat;
      background-position: center;
      background-size: 16px 16px;
    }

    .checkmark::after {
      content: "";
      position: absolute;
      display: none;
    }

    .checkbox input:checked ~ .checkmark:after {
      display: block;
    }
    .view-single {
        font-size: 12px;
        font-weight: 700;
        color: $dark2;
        cursor: pointer;
    }
    .team-totals {
        position: absolute;
        right: 0;
        top: -40px;
        height: 40px;
        line-height: 40px;
        span {
            font-weight: 500;
            font-size: 14px;
            margin-right: 20px;
        }
    }
    .user-row {
        background: $light;
        &:not(:last-child) {
            border-bottom: solid 2px white;
        }
        td {
            font-size: 14px;
            &.index {
                text-align: right;
                padding-right: 20px;
            }
        }
    }
    .team-users {
        overflow: hidden;
        transition: .2s;
        &.collapsed {
            max-height: 0 !important;
        }
        &.expanded {
            + .team-row-wrapper {
                box-shadow: 0 1px 0 $light2 inset;
            }
        }
    }
    .team-row {
        &.expanded {
            td.title {
                .button {
                    // background: $light2;
                    // font-weight: 500;
                    i {
                        // color: $dark;
                        transform: rotateZ(90deg);
                    }
                }
            }
        }
    }
    .dropdown {
        // position: fixed;
    }
</style>
