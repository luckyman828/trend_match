<template>
    <div class="edit-file-component">

        <ThePageHeader :title="`Editing: ${file.name}`"/>

        <ProductsTable :sortKey="sortKey"
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
            this.sortKey = key
            this.sortArray(this.products, method, key)
        },
    },
    created() {
        // Initially sort the products
        this.onSort(true, this.sortKey)
    },
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';
</style>
