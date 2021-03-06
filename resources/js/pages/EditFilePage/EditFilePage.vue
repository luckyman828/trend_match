<template>
    <div class="edit-file-component">
        <!-- <ThePageHeader :title="`Editing: ${file.name}`"/> -->
        <h1>Editing: {{ file.name }}</h1>

        <button
            v-if="products.length > 0"
            class="primary md"
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

        <BulkUploadComponent v-if="showBulkUpload" />

        <div class="quick-actions">
            <p>Recommended actions</p>
            <button
                v-if="productsEligibleForVariantImageShift.length > 0"
                class="ghost md dark"
                @click="setVariantWithImageFirst"
                style="margin-right: 8px;"
            >
                <span
                    >Update {{ productsEligibleForVariantImageShift.length }} products: Show variants with image
                    first</span
                >
            </button>
            <button
                v-if="enabledFeatures.includes('bestseller_style_option') && productsEligibleForResync.length > 0"
                class="ghost md dark"
                @click="onResyncBestsellerImages"
                style="margin-right: 8px;"
            >
                <span>Re-sync images: Style option mapped but no image</span>
            </button>
        </div>

        <ProductsTable :sortKey="sortKey" :file="file" :products="productsFiltered" @onSort="onSort" />

        <ProductFlyin :show="singleVisible" @closeSingle="setSingleVisisble(false)" @onSort="onSort" />
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

export default {
    name: 'editFilePage',
    components: {
        ProductsTable,
        ProductFlyin,
        ThePageHeader,
        BulkUploadComponent,
    },
    mixins: [sortArray],
    data: function() {
        return {
            sortKey: 'sequence',
            showBulkUpload: false,
        }
    },
    computed: {
        ...mapGetters('files', ['currentFile']),
        ...mapGetters('products', ['products', 'productsFiltered', 'singleVisible']),
        ...mapGetters('workspaces', {
            enabledFeatures: 'getFeatureFlags',
        }),
        file() {
            return this.currentFile
        },
        productsEligibleForVariantImageShift() {
            return this.products.filter(x => this.checkProductEligibleForVariantShift(x))
        },
        productsEligibleForResync() {
            return this.products.filter(
                product =>
                    !!product.variants.find(variant => {
                        if (!variant.pictures.find(picture => !!picture.url) && variant.style_option_id) {
                            return true
                        }
                    })
            )
        },
    },
    methods: {
        ...mapActions('products', ['updateManyProducts']),
        ...mapMutations('products', ['setSingleVisisble', 'SET_LAST_SORT']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        onSort(method, key) {
            this.sortKey = key
            this.sortArray(this.products, method, key)
            // Save a reference to our last sort
            this.SET_LAST_SORT({ method, key })
        },
        setVariantWithImageFirst() {
            // Loop through all products, move the variants with images first and save them
            const productsToUpdate = []
            this.productsEligibleForVariantImageShift.map(product => {
                productsToUpdate.push(product)
                product.variants.sort((a, b) => {
                    if (!!a.pictures.find(x => !!x.url) && !b.pictures.find(x => !!x.url)) return -1
                    if (!!b.pictures.find(x => !!x.url) && !a.pictures.find(x => !!x.url)) return 1
                })
            })
            this.updateManyProducts({ file: this.currentFile, products: productsToUpdate })
        },
        checkProductEligibleForVariantShift(product) {
            // Exclude products with no addtional variants to shift around
            if (product.variants.length < 2) return false
            // Check if the product has a variant with no image bu the next variants do have an image
            const noImageIndex = product.variants.findIndex(x => !x.pictures.find(picture => !!picture.url))
            if (noImageIndex < 0) return false
            // Return true if there is a variant after the found one, that does have an image
            const nextVariants = product.variants.slice(noImageIndex + 1)
            return !!nextVariants.find(x => x.pictures.find(picture => !!picture.url))
        },
        onResyncBestsellerImages() {
            const products = this.productsEligibleForResync
            products.map(product =>
                product.variants.map(variant => {
                    if (
                        variant.style_option_id &&
                        typeof variant.style_option_id == 'string' &&
                        variant.style_option_id.search('REF') >= 0
                    ) {
                        variant.style_option_id = variant.style_option_id.slice(4)
                    }
                })
            )
            this.updateManyProducts({ products, file: this.currentFile })
        },
    },
    created() {
        // Initially sort the products
        this.onSort(true, this.sortKey)
    },
}
</script>

<style scoped lang="scss">
.quick-actions {
    border-bottom: $borderDivider;
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
