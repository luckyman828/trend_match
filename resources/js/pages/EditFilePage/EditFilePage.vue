<template>
    <div class="edit-file-component">
        <EditFileHeader :file="file"/>

        <ProductsTable :sortKey="sortKey" :sortAsc="sortAsc"
        :file="file" :products="productsFiltered"
        @onSort="onSort"/>

        <ProductFlyin :show="singleVisible"
        @closeSingle="setSingleVisisble(false)"/>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import ProductsTable from './ProductsTable'
import EditFileHeader from './EditFileHeader'
import ProductFlyin from './ProductFlyin'
// Mixins
import sortArray from '../../mixins/sortArray'

export default{
    name: 'editFilePage',
    components: {
        EditFileHeader,
        ProductsTable,
        ProductFlyin,
    },
    mixins: [
        sortArray
    ],
    data: function () { return {
        sortKey: 'datasource_id',
        sortAsc: true,
    }},
    computed: {
        ...mapGetters('entities/products', ['products', 'productsFiltered', 'singleVisible']),
        ...mapGetters('entities/collections', ['loadingCollections', 'files', 'currentFile']),
        ...mapGetters('persist', ['currentWorkspaceId', 'currentWorkspace', 'authUser']),
        file() {
            return this.currentFile
        },
    },
    methods: {
        ...mapMutations('entities/products', ['setSingleVisisble']),
        onSort(method, key) {
            if (this.sortKey !== key) {
                this.sortAsc = method
                this.sortKey = key
            } else {
                this.sortAsc = !this.sortAsc
            }
            this.sortProducts()
        },
        sortProducts() {
            this.sortArray(this.products, this.sortAsc, this.sortKey)
        }
    },
    created() {
        // Initially sort the products
        this.sortProducts()
    },
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';
</style>
