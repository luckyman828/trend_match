<template>
    <div class="collection">
        <h1>Collection</h1>
        <div class="underline"></div>
        <div class="filters">
            <DropdownCheckbox :title="'Filter by collection'" :options="collections" class="dropdown-parent left" v-model="itemFilterIds">
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
            <DropdownRadio :options="teams" :currentOptionId="teamFilterId" :defaultOption="{id: 0, title: 'GLOBAL'}" class="dropdown-parent right" v-model="teamFilterId">
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
import App from '../../App.vue';

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
        teamFilterId: '-1',
        loadingOverwrite: false,
    }},
    computed: {
        ...mapGetters('entities/collections', ['loadingCollections']),
        collections () {
            return Collection.query().all()
        },
        users() {
            return User.query().with('teams').all()
        },
        authUser() {
            // return this.$store.getters.authUser;
            return AuthUser.query().with('teams').with('workspaces').first()
        },
        currentWorkspaceId() {
            if (this.authUser.workspaces != null)
                return this.authUser.workspaces[0].id
        },
        teams() {
            return Team.query().with('users').all()
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
        onSelect(index) {
            // Check if index already exists in array. If it exists remove it, else add it to array
            const selected = this.selected
            const found = selected.findIndex(el => el == index)
            const result = (found >= 0) ? selected.splice(found, 1) : selected.push(index)
        },
        onViewSingle(collectionID) {
            this.$router.push({name: 'catalogue', params: {catalogueId: collectionID}})
        },
        // filterByTeam(id) {
        //     this.teamFilterId = id
        // },
        async fetchInitialData() {
            // Get user
            console.log('Getting initial data')
            await Promise.all([
                this.getAuthUser(),
                this.fetchWorkspaceUsers(),
                this.fetchWorkspaces(),
            ]) 
        },
    },
    created() {
        this.fetchInitialData()
        // Fetch data based on the Auth User
        .then( async response => {
            // Only get data for the current workspace
            if (this.currentWorkspaceId) {
                await (
                    this.fetchTeams(this.currentWorkspaceId),
                    this.fetchUserTeams(this.currentWorkspaceId)
                )
                if (this.authUser.role_id >= 3)
                    this.teamFilterId = 0
                else if (this.authUser.teams.length > 0)
                    this.teamFilterId = this.authUser.teams[0].id
                this.fetchCollections(this.currentWorkspaceId)
                this.fetchUsers(this.currentWorkspaceId)
            } else {
                this.loadingOverwrite = true
            }
        })
    },

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
