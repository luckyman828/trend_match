<template>
    <div class="collection">
        <h1>Collection</h1>
        <div class="underline"></div>
        <div class="filters">
            <DropdownCheckbox :buttonText="'Collections'" :title="'Filter by collection'" :options="collections" class="dropdown-parent left" v-model="itemFilterIds" :config="{button: 'button'}"/>
            <DropdownRadio :options="teams" :currentOptionId="teamFilterId" class="right" @onSubmit="filterByTeam">
                <span>The first option</span>
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
            return AuthUser.query().with('teams').first()
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
        onSelect(index) {
            // Check if index already exists in array. If it exists remove it, else add it to array
            const selected = this.selected
            const found = selected.findIndex(el => el == index)
            const result = (found >= 0) ? selected.splice(found, 1) : selected.push(index)
        },
        onViewSingle(collectionID) {
            this.$router.push({name: 'catalogue', params: {catalogueId: collectionID}})
        },
        filterByTeam(id) {
            this.teamFilterId = id
        },
        async fetchInitialData() {
            // Get user
            console.log('Getting initial data')
            await this.getAuthUser()
        },
    },
    created() {
        this.fetchInitialData()
        // Fetch data based on the Auth User
        .then( async response => {
            // Only get data for the users assigned room
            const room_id = this.authUser.assigned_room_id
            if (room_id != null) {
                await ( 
                    this.fetchTeams(1234),
                    this.fetchUserTeams()
                )
                if (this.authUser.teams.length > 0)
                    this.teamFilterId = this.authUser.teams[0].id
                this.fetchCollections(room_id)
                this.fetchUsers(1234)
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
    
</style>
