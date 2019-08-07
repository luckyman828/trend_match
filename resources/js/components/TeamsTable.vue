<template>
    <div class="teams-table card">
        <div class="team-totals">
            <span>{{selectedCount}} selected</span>
            <span>{{teams.length}} records</span>
        </div>
        <table>
            <tr class="header-row">
                <th class="select">Select <i class="fas fa-chevron-down"></i></th>
                <th class="clickable title" :class="{active: this.sortBy == 'title'}" @click="onSortBy('title', true)">
                    Team <i class="fas" :class="[(this.sortBy == 'title' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'assigned'}" class="clickable title" @click="onSortBy('assigned', true)">
                   Assigned <i class="fas" :class="[(this.sortBy == 'assigned' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'members'}" class="clickable" @click="onSortBy('members', false)">
                    Members <i class="fas" :class="[(this.sortBy == 'members' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'collections'}" class="clickable" @click="onSortBy('collections', false)">
                    Collections <i class="fas" :class="[(this.sortBy == 'collections' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th :class="{active: this.sortBy == 'status'}" class="clickable" @click="onSortBy('status', false)">
                    Status <i class="fas" :class="[(this.sortBy == 'status' && !sortAsc) ? 'fa-long-arrow-alt-up' : 'fa-long-arrow-alt-down']"></i>
                </th>
                <th>Action</th>
                <th></th>
            </tr>
            <template v-if="!loading">
                <template v-for="(team, index) in teamsSorted">
                    <tbody :key="team.id">
                        <tr class="team-row"  >
                            <td class="select">
                                <label class="checkbox">
                                    <input type="checkbox" @change="onSelect(index)" />
                                    <span class="checkmark"></span>
                                </label>
                            </td>
                            <td class="title clickable"><i class="far fa-chevron-right"></i>{{team.title}}</td>
                            <td class="assigned">Coming soon..</td>
                            <td class="members"><span>{{team.users.length}}</span></td>
                            <td class="collections"><span>Coming soon..</span></td>
                            <td class="status"><span>Coming soon..</span></td>
                            <td class="action"><span class="button">Edit team</span></td>
                            <td><span class="view-single">View</span></td>
                        </tr>
                        <tbody class="team-users">
                            <tr class="user-row" v-for="(user, index) in team.users" :key="index">
                                <td class="index">{{index}}</td>
                                <td class="name">name coming..</td>
                                <td class="email">{{user.email}}</td>
                                <td class="collections">collections coming..</td>
                                <td class="role"><span class="square" :class="user.role.toLowerCase()">{{user.role}}</span></td>
                            </tr>
                        </tbody>
                    </tbody>
                </template>
            </template>
        </table>
        <template v-if="loading">
            <Loader/>
        </template>
    </div>
</template>

<script>
import Loader from './Loader'
import { mapActions, mapGetters } from 'vuex'
import ProductTotals from './ProductTotals'
import ProductSingle from './ProductSingle'

export default {
    name: 'teamsTable',
    props: [
        'teams',
        'loading',
        'authUser',
        'collection',
        'selectedCount',
        'totalProductCount',
        'users',
    ],
    components: {
        Loader,
    },
    data: function() { return {
        sortBy: 'id',
        sortAsc: true
    }},
    computed: {
        teamsAlt () {
            // Manually find the teams and the users belonging to each team.
            // This is only necessary because I cannot make the Vuex ORM realtionship work 
            // If you can make it work, please be my guest
            const users = this.users
            const teams = this.teams
            const data = []

            teams.forEach(team => {
                const thisTeam = {
                    id: team.id,
                    title: team.title,
                    users: []
                }
                users.forEach(user => {
                    if (user.team.id == thisTeam.id) {
                        // Find the users role
                        user.role = (user.role_id == 1) ? 'Sales' : (user.role_id == 2) ? 'Sales Rep' : 'Admin'
                        // if (user.role_id == 1) {
                        //     user.role = 'Sales'
                        // } else if (user)
                        thisTeam.users.push(user)
                    }
                })
                data.push(thisTeam)
            })
            return data
        },
        teamsSorted() {
            const teams = this.teamsAlt
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
    }
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';

    .teams-table {
        margin-top: 52px;
        padding-top: 0;
    }
    .clickable {
        cursor: pointer;
    }
    table {
        margin-left: -16px;
        margin-right: -16px;
        width: calc(100% + 32px);
        &.disabled {
            opacity: .5;
        }
    }
    tr:hover {
        background: $light;
    }
    img {
        height: 88px;
        width: 66px;
        object-fit: cover;
        margin: 8px 0 8px 16px;
    }
    i {
        margin-right: 12px;
        font-size: 11px;
        &.fa-arrow-up {
            color: $green;
        }
        &.fa-arrow-down {
            color: $red;
        }
    }
    tr.header-row {
        background: white;
        font-weight: 700;
        font-size: 12px;
        height: 45px;
        border-bottom: solid 2px $light1;
    }
    tr.team-row {
        border-bottom: solid 1px $light1;
        &.in > :first-child {
            box-shadow: 4px 0 $green inset
        }
        &.out > :first-child {
            box-shadow: 4px 0 $red inset
        }
    }
    th {
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 600;
        color: $dark2;
        &:first-child {
            padding-left: 16px;
            width: 100px;
        }
        &.id {
            width: 75px;
        }
        &.title {
            width: 150px;
        }
        i {
            color: $light2;
            margin: 0;
            margin-left: 4px;
        }
        &.swipes {
            width: 12%;
            text-align: center;
        }
        &.popularity {
            width: 10%;
        }
        &.compare {
            width: 15%;
            text-align: center;
        }
        &.active {
            i {
                color: $primary
            }
        }
    }
    td {
        &.select {
            padding: 20px 0;
            padding-left: 20px;
        }
        &.title {
            font-size: 13px;
            color: $dark;
        }
        &.swipes {
            text-align: center;
            font-size: 13px;
            color: $dark;
        }
        &.popularity {
            font-size: 11px;
            font-weight: 700;
        }
        &.compare {
            text-align: center;
        }
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
      &:hover {
          background: $light;
      }
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
    .square {
        background: $light1;
        color: white;
        padding: 7px 10px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        &.sales {
            background: $primary;
        }
        &.admin {
            background: $dark05;
        }
        i {
            color: $dark2;
            margin-right: 16px;
            font-size: 16px;
        }
    }
    .button {
        display: inline-block;
        width: 86px;
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        border-radius: 4px;
        padding: 0;
        line-height: 28px;
        position: relative;
        font-weight: 700;
        color: $dark2;
        border-color: $light2;
        i {
            font-size: 16px;
            position: absolute;
            right: 10px;
            top: 5px;
            margin: 0;
        }
        &.active {
            i {
                font-weight: 900;
            }
        }
    }
    .view-single {
        font-size: 12px;
        font-weight: 700;
        padding: 0 12px;
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
</style>
