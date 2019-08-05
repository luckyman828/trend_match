<template>
    <div class="collection">
        <h1>Collection</h1>
        <div class="card">
            <table>
            <tr class="header-row">
                <th>Select</th>
                <th>ID</th>
                <th>Collection</th>
                <th>Created</th>
                <th>Deadline</th>
                <th>Status</th>
                <th></th>
                <th>Action</th>
                <th></th>
                <th>View</th>
            </tr>
            <template v-if="!loadingCollections">
                <tr class="product-row"
                v-for="(collection, index) in collections" :key="collection.id">
                    <td><input type="checkbox" @change="onSelect(index)"></td>
                    <td><span>{{collection.id}}</span></td>
                    <td><span>{{collection.title}}</span></td>
                    <td><span>{{collection.start_time}}</span></td>
                    <td><span>{{collection.end_time}}</span></td>
                    <td><span>Stage {{collection.phase}}</span></td>
                    <td><span>To be calculated</span></td>
                    <td><span class="button">Action</span></td>
                    <td><span class="button">Action</span></td>
                    <td><span class="button" @click="onViewSingle(collection.id)">View</span></td>
                </tr>
            </template>
        </table>
        <template v-if="loadingCollections">
            <Loader/>
        </template>
        </div>
    </div>
</template>

<script>
import store from '../../store'
import { mapActions, mapGetters } from 'vuex'
import Loader from '../Loader'
import Collection from '../../store/models/Collection'

export default {
    name: 'collection',
    store,
    components: {
        Loader
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
    },

}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    table {
        margin-left: -16px;
        margin-right: -16px;
        width: calc(100% + 32px);
    }
    tr:hover {
        background: $light1;
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
    th:first-child {
        padding-left: 40px;
        text-transform: uppercase;
    }
    tr.header-row {
        background: $light2;
        color: $dark2;
        font-weight: 700;
        font-size: 12px;
        height: 45px;
    }
    tr.product-row {
        border-bottom: solid 1px $light2;
    }
    th {
        &.title {
            width: 50%;
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
    }
    td {
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
    input[type=checkbox] {
        display: block;
        margin: auto;
        height: 20px;
        width: 25px;
    }
</style>
