<template>
    <PageLoader :status="status" theme="dark" :fitPage="true">
        <LiveResultsPage />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import PageLoader from '../../components/common/PageLoader'
import LiveResultsPage from './LiveResultsPage'

export default {
    name: 'resultsPageLoader',
    components: { PageLoader, LiveResultsPage },
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
            if (this.getSelectionsStatus == 'error' || this.filesStatus == 'error') return 'error'
            if (this.getSelectionsStatus == 'loading' || this.filesStatus == 'loading' || this.loadingData)
                return 'loading'
            return 'success'
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('products', ['fetchProducts']),
        ...mapActions('selections', ['fetchSelections']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
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
        const authUserRole = this.$store.getters['workspaces/authUserWorkspaceRole']
        if (authUserRole != 'Admin') {
            this.$router.push({ name: 'files' })
            this.SHOW_SNACKBAR({
                type: 'info',
                msg: 'Access denied to live results.<br>Must be workspace admin.',
                iconClass: 'far fa-info-circle',
            })
            return
        }
        this.fetchData()
    },
}
</script>

<style scoped lang="scss"></style>
