<template>
    <div class="edit-file-component">

        <ThePageHeader :title="`Editing: ${file.name}`"/>

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
        ...mapMutations('products', ['setSingleVisisble']),
        onSort(method, key) {
            this.sortKey = key
            this.sortArray(this.products, method, key)
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
            alert(`Success! ${productsToUpdateCount} Products updated`)
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
