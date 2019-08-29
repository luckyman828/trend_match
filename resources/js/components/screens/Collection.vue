<template>
    <div class="collection">
        <h1>Collection</h1>
        <div class="underline"></div>
        <div class="filters">
            <DropdownCheckbox :title="'Filter by collection'" :options="uniqueCollections" class="dropdown-parent left" v-model="itemFilterIds">
                <template v-slot:button="slotProps">
                    <div class="dropdown-button item-filter-button" @click="slotProps.toggle">
                        <span>Collection</span>
                        <i class="far fa-chevron-down"></i>
                        <span v-if="itemFilterIds.length > 0" class="bubble">
                            {{itemFilterIds.length}}
                        </span>
                    </div>
                    <span v-if="itemFilterIds.length > 0" class="clear button invisible primary" @click="slotProps.clear(); itemFilterIds=[]">Clear filter</span>
                </template>
            </DropdownCheckbox>
            <DropdownRadio :options="teams" :currentOptionId="currentTeamId" :defaultOption="defaultTeam" class="dropdown-parent right" @submit="setCurrentTeam">
                <template v-slot:button="slotProps">
                    <div class="dropdown-button" @click="slotProps.toggle">
                        <img src="/assets/Path5699.svg">
                        <span>{{slotProps.currentOption.title}}</span>
                        <i class="far fa-chevron-down"></i>
                    </div>
                </template>
            </DropdownRadio>
        </div>
        <CataloguesTable :isLoading="isLoading" :authUser="authUser" :catalogues="collections" :loading="loadingCollections" :selected="selected" @onSelect="onSelect"/>
    </div>
</template>

<script>
import store from '../../store'
import { mapActions, mapGetters } from 'vuex'
import Loader from '../Loader'
import CataloguesTable from '../CataloguesTable'
import DropdownRadio from '../DropdownRadio'
import DropdownCheckbox from '../DropdownCheckbox'
import Collection from '../../store/models/Collection'
import Team from '../../store/models/Team'
import User from '../../store/models/User'
import UserTeam from '../../store/models/UserTeam';
import AuthUser from '../../store/models/AuthUser';

export default {
    name: 'collection',
    store,
    components: {
        Loader,
        CataloguesTable,
        DropdownCheckbox,
        DropdownRadio,
    },
    data: function() { return {
        selected: [],
        itemFilterIds: [],
        // teamFilterId: '-1',
        loadingOverwrite: false,
        unsub: '',
    }},
    computed: {
        ...mapGetters('entities/collections', ['loadingCollections']),
        ...mapGetters('persist', ['currentTeamId', 'currentWorkspaceId', 'userPermissionLevel']),
        defaultTeam() {
            if (this.userPermissionLevel >= 3)
                return {id: 0, title: 'Global'}
            else return null
        },
        collections () {
            return Collection.query().all()
        },
        uniqueCollections() {
            const inputData = this.collections
            let uniqueData = []
            inputData.forEach(data => {
                const filterKey = data.title
                const found = (uniqueData.includes(filterKey))
                if (!found)
                    uniqueData.push(filterKey)
            })
            return uniqueData
        },
        users() {
            return User.query().with('teams').all()
        },
        authUser() {
            // return this.$store.getters.authUser;
            return AuthUser.query().with('teams').with('workspaces').first()
        },
        teams() {
            // Manually find the teams and the users belonging to each team.
            // This is only necessary because I cannot make the Vuex ORM realtionship work 
            // If you can make it work, please be my guest
            const teams = Team.query().with('users').with('invites').all()
            const users = this.users
            // Loop through the users and sort them between the teams
            users.forEach(user => {
                // First check that the user has a team and that the team has an id
                if (user.teams[0] != null) {
                    if ('id' in user.teams[0]) {
                        // If we have a team with an id
                        // Set the users role
                        user.teams.forEach(userTeam => {
                            // Loop through each of the users teams and add the user
                            // Find the corresponding team
                            const foundTeam = teams.find(team => team.id == userTeam.id)
                            // Check that the user doesnt already exist in this team
                            if ( !foundTeam.users.includes(user) )
                                // Push the user to the team if the user is not already a member
                                foundTeam.users.push(user)
                        })
                    }
                }
            })
            if (!this.isLoading) {
                if (this.authUser.role_id >= 3)
                    return teams
                else {
                    // Get the users teams
                    let userTeams = []
                    teams.forEach(team => {
                        if (this.authUser.teams.find(x => x.id == team.id))
                            userTeams.push(team)
                    })
                    return userTeams
                }
                
            }
            return []
        },
        isLoading () {
            let loading = false
            if (!this.loadingOverwrite)
                if (this.loadingCollections || this.authUser == null)
                    loading = true
            return loading
        }
    },
    methods: {
        ...mapActions('entities/authUser', ['getAuthUser']),
        ...mapActions('entities/collections', ['fetchCollections']),
        ...mapActions('entities/teams', ['fetchTeams']),
        ...mapActions('entities/users', ['fetchUsers']),
        ...mapActions('entities/userTeams', ['fetchUserTeams']),
        ...mapActions('entities/workspaces', ['fetchWorkspaces']),
        ...mapActions('entities/workspaceUsers', ['fetchWorkspaceUsers']),
        ...mapActions('persist', ['setCurrentTeam']),
        onSelect(index) {
            // Check if index already exists in array. If it exists remove it, else add it to array
            const selected = this.selected
            const found = selected.findIndex(el => el == index)
            const result = (found >= 0) ? selected.splice(found, 1) : selected.push(index)
        },
        onViewSingle(collectionID) {
            this.$router.push({name: 'catalogue', params: {catalogueId: collectionID}})
        },
        initRequiresWorkspace() {
            if (Collection.all().length <= 0)
                this.fetchCollections(this.currentWorkspaceId)
            if (User.all().length <= 0)
                this.fetchUsers(this.currentWorkspaceId)

            // Temp hotfix for team id not being set
            if (this.authUser.role_id >= 3)
                this.setCurrentTeam(0)
            else if (this.authUser.teams.length > 0)
                this.setCurrentTeam(this.authUser.teams[0].id)
        }
    },
    created() {
        // If we already have a workspace id, fetch the data we are missing
        if (this.currentWorkspaceId != null)
            this.initRequiresWorkspace()
        // Else, wait till a workspace id is set, and then fetch the data
        this.unsub = this.$store.subscribe((mutation, state) => {
            if(mutation.type == 'persist/setCurrentWorkspace') {
                this.initRequiresWorkspace()
            } 
        })
    },
    destroyed() {
        this.unsub()
    }

}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    h1 {
        margin-bottom: 16px;
    }
    .underline {
        width: 100%;
        border-bottom: solid 2px $light2;
        margin-bottom: 20px;
    }
    .filters {
        display: flex;
        justify-content: space-between;
    }
    .item-filter-button {
        min-width: 120px;
        background: $light2;
    }
    
</style>
