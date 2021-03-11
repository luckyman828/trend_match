<template>
    <PageLoader
        :status="status"
        loadingMsg="loading selection"
        errorMsg="error loading selection"
        :errorCallback="() => fetchData()"
    >
        <SelectionPage />
        <Navbar />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SelectionPage from './SelectionPage'
import Navbar from './Navbar'
import PageLoader from '../../../components/common/PageLoader'

export default {
    name: 'buy.SelectionPageLoader',
    components: {
        SelectionPage,
        Navbar,
        PageLoader,
    },
    data: function() {
        return {
            loadingData: true,
        }
    },
    computed: {
        ...mapGetters('products', {
            products: 'getProducts',
        }),
        status() {
            if (this.loadingData) {
                return 'loading'
            }
            return 'success'
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('buyProducts', ['fetchProducts']),
        ...mapActions('selections', ['fetchSelection']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTIONS']),
        async initProducts() {
            this.products.map(product => {
                const productRowHeight = 216
                const variantRowHeight = 178
                const dist = 20
                Vue.set(product, 'expanded', false)
                Object.defineProperty(product, 'size', {
                    get: function() {
                        return product.expanded
                            ? productRowHeight + product.variants.length * variantRowHeight + dist
                            : productRowHeight + dist
                    },
                })
            })
        },
        async fetchData() {
            this.loadingData = true

            // Fetch current selection
            const selectionId = this.$route.params.selectionId
            const selection = await this.fetchSelection({ selectionId })
            this.SET_CURRENT_SELECTIONS([selection])

            // Fetch the current file and the products
            const fileId = selection.file_id

            // This works because vuex actions are always promises
            let promisesToResolve = [await this.fetchFile(fileId), await this.fetchProducts(selection.id)]

            await this.initProducts()

            // Use promise.all to resolve all the promises simultaneously
            await Promise.all(promisesToResolve)

            this.loadingData = false
        },
    },
    created() {
        this.fetchData()
    },
}
</script>

<style scoped lang="scss">
::v-deep {
    .page-wrapper {
        padding-top: 8px;
    }
}
</style>
