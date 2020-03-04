<template>
    <PageLoader :loading="loading">
        <EditFilePage/>
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import EditFilePage from './EditFilePage'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'editFileLoader',
    components: {
        PageLoader,
        EditFilePage
    },
    data: function () { return {
    }},
    computed: {
        ...mapGetters('products', ['productsStatus']),
        ...mapGetters('files', ['currentFile']),
        loading () {
            return (this.productsStatus != 'success' || !this.currentFile)
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('products', ['fetchProducts']),
        
    },
    created() {
        // Fetch the current file and the products
        const fileId = this.$route.params.fileId
        this.fetchFile(fileId)
        this.fetchProducts(fileId)
    },
}
</script>

<style scoped lang="scss">

</style>