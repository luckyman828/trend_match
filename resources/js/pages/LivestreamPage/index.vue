<template>
    <PageLoader
        :status="status"
        loadingMsg="loading file"
        errorMsg="error loading file"
        :fitPage="true"
        :errorCallback="() => fetchData()"
    >
        <LivestreamPage />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import LivestreamPage from './LivestreamPage'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'livestreamPage',
    components: {
        PageLoader,
        LivestreamPage,
    },
    data: function() {
        return {}
    },
    computed: {
        ...mapGetters('products', ['productsStatus']),
        ...mapGetters('files', ['currentFile', 'filesStatus']),
        loading() {
            return this.productsStatus != 'success' || !this.currentFile
        },
        status() {
            if (this.productsStatus == 'error' || this.filesStatus == 'error') return 'error'
            if (this.productsStatus == 'loading' || this.filesStatus == 'loading' || !this.currentFile) return 'loading'
            return 'success'
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('products', ['fetchProducts']),
        fetchData() {
            // Fetch the current file and the products
            const fileId = this.$route.params.fileId
            this.fetchFile(fileId)
            this.fetchProducts({ fileId })
        },
    },
    created() {
        this.fetchData()
    },
}
</script>

<style scoped lang="scss"></style>
