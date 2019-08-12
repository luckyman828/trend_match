<template>
    <div class="collection">
        <h1>Collection</h1>
        <div class="underline"></div>
        <CollectionTopBar :itemsToFilter="collections" :title="'Catalogues'"/>
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
    }},
    computed: {
        ...mapGetters('entities/collections', ['loadingCollections']),
        collections () {
            return Collection.query().all()
        },
    },
    methods: {
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
        }
    },
    created() {
        this.fetchCollections()
        this.fetchTeams()
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
