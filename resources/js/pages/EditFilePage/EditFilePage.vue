<template>
    <div class="edit-file-component">

        <!-- <ThePageHeader :title="`Editing: ${file.name}`"/> -->
        <h1>Editing: {{file.name}}</h1>

        <button class="primary md"
            style="margin-bottom: 20px"
            @click="showBulkUpload = !showBulkUpload"
        >
            <template v-if="!showBulkUpload">
                <i class="far fa-upload"></i>
                <span>Bulk upload images</span>
            </template>
            <template v-else>
                <i class="far fa-check"></i>
                <span>Finish bulk uploading</span>
            </template>
        </button>

        <BulkUploadComponent v-if="showBulkUpload"/>

        <div class="quick-actions" v-if="productsEligibleForVariantImageShift.length > 0">
            <p>Recommended actions</p>
            <button v-if="productsEligibleForVariantImageShift.length > 0" class="ghost md dark" 
            @click="setVariantWithImageFirst" style="margin-right: 8px;">
                <span>Update {{productsEligibleForVariantImageShift.length}} products: Show variants with image first</span>
            </button>
        </div>

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
import BulkUploadComponent from './BulkUploadComponent'
import ThePageHeader from '../../components/layout/ThePageHeader'
// Mixins
import sortArray from '../../mixins/sortArray'

export default{
    name: 'editFilePage',
    components: {
        ProductsTable,
        ProductFlyin,
        ThePageHeader,
        BulkUploadComponent,
    },
    mixins: [
        sortArray
    ],
    data: function () { return {
        sortKey: 'datasource_id',
        showBulkUpload: false,
    }},
    computed: {
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('products', ['products', 'productsFiltered', 'singleVisible']),
        file() {
            return this.currentFile
        },
        productsEligibleForVariantImageShift() {
            return this.products.filter(x => {
                if (x.variants.length < 2) return false
                const noImageIndex = x.variants.findIndex(x => !x.image)
                return noImageIndex >= 0 && x.variants.slice(noImageIndex+1).find(x => !!x.image)
            })
        }
    },
    methods: {
        ...mapActions('products', ['updateProduct']),
        ...mapMutations('products', ['setSingleVisisble', 'SET_LAST_SORT']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        onSort(method, key) {
            this.sortKey = key
            this.sortArray(this.products, method, key)
            // Save a reference to our last sort
            this.SET_LAST_SORT({method, key})
        },
        setVariantWithImageFirst() {
            const productsToUpdateCount = this.productsEligibleForVariantImageShift.length
            // Loop through all products, move the variants with images first and save them
            this.products.forEach(product => {
                if (product.variants.length > 1) {
                    product.variants.sort((a,b) => {
                        if (!!a.image && !b.image) return -1
                        if (!!b.image && !a.image) return 1
                    })
                    this.updateProduct(product)
                }
            })
            this.SHOW_SNACKBAR({
                msg: `${productsToUpdateCount} Product${productsToUpdateCount > 1 ? 's' : ''} updated`,
                iconClass: 'fa-check',
                type: 'success'
            })
        }
    },
    created() {
        // Initially sort the products
        this.onSort(true, this.sortKey)
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
    .quick-actions {
        border-bottom: solid 2px $light2;
        padding-bottom: 16px;
        margin-bottom: 16px;
        p {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
        }
        .button {
            &:not(:last-child) {
                margin-right: 12px;
            }
        }
    }
</style>
