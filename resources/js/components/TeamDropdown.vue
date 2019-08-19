<template>
  <div class="team-dropdown dropdown" v-if="authUser != null">
        <button class="btn btn-secondary dropdown-toggle global d-flex justify-content-between" type="button" id="dropdownMenuButton" 
        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span><img src="/assets/Path5699.svg" alt /></span> {{currentTeam.title}} <img src="/assets/Path26.svg" alt />
        </button>

        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
        <p class="dropdown-item current-item active"> {{currentTeam.title}} </p>
        <p class="dropdown-item" @click="onSelectTeam(0)" v-if="authUser.role_id > 2">Global</p>
        <p :class="{active: currentTeam.id == team.id}" class="dropdown-item" v-for="team in availableTeams" :key="team.id" @click="onSelectTeam(team.id)">{{team.title}}</p>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AuthUser from '../store/models/AuthUser';

export default {
    name: 'teamDropDown',
    props: [
        'teams',
        'teamFilterId'
    ],
    computed: {
        currentTeam() {
          if (this.teamFilterId > 0 && this.teams.length > 0)
            return this.teams.find(el => el.id == this.teamFilterId)
            else return {title: 'Fetching..'}
        },
        authUser() {
            return AuthUser.query().with('teams').first()
        },
        availableTeams() {
            const authUser = this.authUser
            let availableTeams = this.teams
            if (authUser) {
                if (authUser.role_id < 3)
                    availableTeams = authUser.teams
                return availableTeams
            }
            
        },
    },
    methods: {
        ...mapActions('entities/authUser', ['getAuthUser']),
        onSelectTeam(id) {
          this.$emit('onSelectTeam', id)
        }
    },
    created() {
        // this.getAuthUser()
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .dropdown-menu {
        min-width: 150px;
        padding-top: 0;
        p.dropdown-item {
            display: block;
            margin: 0;
            padding: 12px 16px;
            cursor: pointer;
        }
        .current-item {
            background: $light;
            border-bottom: solid 1px $light2;
        }
    }
    .global {
        height: 32px;
        width: 150px;
        color: #1b1c1d;
        background-color: #ffffff;
        border: 1px solid #dfdfdf;
        font-size: 14px;
        font-weight: bold;
        margin-left: auto;
        img {
            margin-top: 6px;
        }
        span {
            margin-left: -8px;
            margin-top: -3px;
            background-color: #3b86ff;
            width: 24px;
            height: 24px;
            border-radius: 25%;
            img {
                margin-top: 0px;
            }
        }
    }

    .dropdown-toggle::after {
        display: none;
    }

    .dropdown-menu:hover {
        display: block;
    }

    .dropdown-menu {
        overflow-y: auto;
        max-height: 285px;
        box-shadow: 0 2px 10px rgba(0,0,0,.05);

        input[type="text"] {
            border: 0px;
            border-bottom: 1px solid #a8a8a8;
            color: #a8a8a8;
            padding: 5px 0;
            width: 100%;
        }
        input[type="text"]::-webkit-input-placeholder {
            color: #a8a8a8;
            text-align: center;
        }

        p {
            display: inline;
            font-size: 12px;
            color: #1b1c1d;
        }

        .container {
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
    }

</style>