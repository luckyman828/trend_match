<template>
    <div class="edit-file-component">

        <ThePageHeader :title="`Editing: ${file.name}`"/>

        <ProductsTable :sortKey="sortKey" :sortAsc="sortAsc"
        :file="file" :products="productsFiltered"
        @onSort="onSort"/>

        <ProductFlyin :show="singleVisible"
        @closeSingle="setSingleVisisble(false)" @onSort="onSort"/>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import ProductsTable from './ProductsTable'
import EditFileHeader from './EditFileHeader'
import ProductFlyin from './ProductFlyin'
import ThePageHeader from '../../components/layout/ThePageHeader'
// Mixins
import sortArray from '../../mixins/sortArray'

export default{
    name: 'editFilePage',
    components: {
        ProductsTable,
        ProductFlyin,
        ThePageHeader,
    },
    mixins: [
        sortArray
    ],
    data: function () { return {
        sortKey: 'datasource_id',
        sortAsc: true,
    }},
    computed: {
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('products', ['products', 'productsFiltered', 'singleVisible']),
        file() {
            return this.currentFile
        },
    },
    methods: {
        ...mapMutations('products', ['setSingleVisisble']),
        onSort(method, key) {
            if (method && key) {
                if (this.sortKey !== key) {
                    this.sortAsc = method
                    this.sortKey = key
                } else {
                    this.sortAsc = !this.sortAsc
                }
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
