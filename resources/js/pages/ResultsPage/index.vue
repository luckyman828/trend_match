<template>
    <PageLoader :status="status" theme="dark" :fitPage="true">
        <ResultsPage />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import PageLoader from '../../components/common/PageLoader'
import ResultsPage from './ResultsPage'

export default {
    name: 'resultsPageLoader',
    components: { PageLoader, ResultsPage },
    data: function() {
        return {
            loadingData: true,
        }
    },
    computed: {
        ...mapGetters('products', ['productsStatus']),
        ...mapGetters('selections', ['getSelectionsStatus']),
        ...mapGetters('files', ['filesStatus']),
        status() {
            if (this.productsStatus == 'error' || this.getSelectionsStatus == 'error' || this.filesStatus == 'error')
                return 'error'
            if (
                this.productsStatus == 'loading' ||
                this.getSelectionsStatus == 'loading' ||
                this.filesStatus == 'loading' ||
                this.loadingData
            )
                return 'loading'
            return 'success'
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('products', ['fetchProducts']),
        ...mapActions('selections', ['fetchSelections']),
        async fetchData() {
            this.loadingData = true
            // Fetch the current file and the products
            const fileId = this.$route.params.fileId
            const file = this.fetchFile(fileId)

            // This works because vuex actions are always promises
            let promisesToResolve = [await this.fetchSelections({ fileId }), await this.fetchProducts({ fileId })]

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
@import '~@/_variables.scss';
</style>
