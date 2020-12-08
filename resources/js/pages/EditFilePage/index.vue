<template>
    <PageLoader
        :status="status"
        loadingMsg="loading file"
        errorMsg="error loading file"
        :errorCallback="() => fetchData()"
    >
        <EditFilePage />
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
        EditFilePage,
    },
    data: function() {
        return { loading: false }
    },
    computed: {
        ...mapGetters('products', ['productsStatus']),
        ...mapGetters('files', ['currentFile', 'filesStatus']),
        ...mapGetters('workspaces', ['currentWorkspace', 'authUserWorkspaceRole']),
        status() {
            if (this.loading) return 'loading'
            if (this.productsStatus == 'error' || this.filesStatus == 'error') return 'error'
            if (this.productsStatus == 'loading' || this.filesStatus == 'loading' || !this.currentFile) return 'loading'
            return 'success'
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('products', ['fetchProducts']),
        ...mapActions('workspaces', ['fetchWorkspaceDatabases']),
        async fetchData() {
            this.loading = true
            // Fetch the current file and the products
            const fileId = this.$route.params.fileId
            await Promise.all([
                this.fetchFile(fileId),
                this.fetchProducts({ fileId }),
                this.fetchWorkspaceDatabases(this.currentWorkspace),
            ])
            this.loading = false
        },
    },
    created() {
        this.fetchData()
    },
}
</script>

<style scoped lang="scss"></style>
