<template>
    <div class="collection">
        <h1>Collection</h1>
        <div class="underline"></div>
        <CollectionTopBar :itemsToFilter="collections" :title="'Catalogues'" :teams="teams" :teamFilterId="teamFilterId" @onSelectTeam="filterByTeam"/>
        <CataloguesTable :catalogues="collections" :loading="loadingCollections" @onSelect="onSelect"/>
    </div>
</template>

<script>
import store from '../../store'
import { mapActions, mapGetters } from 'vuex'
import Loader from '../Loader'
import CollectionTopBar from '../CollectionTopBar'
import CataloguesTable from '../CataloguesTable'
import Collection from '../../store/models/Collection'
import Team from '../../store/models/Team'

export default {
    name: 'collection',
    store,
    components: {
        Loader,
        CollectionTopBar,
        CataloguesTable,
    },
    data: function() { return {
        selected: [],
        teamFilterId: '-1',
    }},
    computed: {
        ...mapGetters('entities/collections', ['loadingCollections']),
        collections () {
            return Collection.query().all()
        },
        teams() {
            return Team.query().all()
        },
        authUser() {
            return this.$store.getters.authUser;
        },
    },
    methods: {
        ...mapActions(['getAuthUser']),
        ...mapActions('entities/collections', ['fetchCollections']),
        ...mapActions('entities/teams', ['fetchTeams']),
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
            await this.getAuthUser()
            this.teamFilterId = this.authUser.team_ids
        },
    },
    created() {
        this.fetchInitialData()
        this.fetchCollections()
        this.fetchTeams(1234)
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
    
</style>
