<template>
    <PageLoader :loading="loading">
        <EditFilePage/>
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import EditFilePage from './EditFilePage'
import PageLoader from '../../components/common/PageLoader'
import Collection from '../../store/models/Collection'

export default {
    name: 'editFileLoader',
    components: {
        PageLoader,
        EditFilePage
    },
    data: function () { return {
        loadingFile: true,
    }},
    computed: {
        ...mapGetters('entities/products', ['products', 'loadingProducts']),
        ...mapGetters('persist', ['currentWorkspaceId', 'currentFileId', 'authUser']),
        loading () {
            return (this.products != null && !this.loadingFile) ? false : true
        },
    },
    methods: {
        ...mapActions('entities/collections', ['fetchCollections', 'setCurrentFile']),
        ...mapMutations('entities/selections', ['setCurrentSelectionId']),
        ...mapActions('entities/products', ['fetchProducts']),
        ...mapActions('persist', ['setCurrentFileId']),
        async initRequiresWorkspace() {
            if (Collection.all().length <= 0) {
                await this.fetchCollections(this.currentWorkspaceId)
                // Set the current file
                const fileToSet = Collection.find(this.currentFileId)
                this.setCurrentFile(fileToSet)
            }
        },
        async initRequiresFileId() {
            await (
                this.fetchProducts(this.currentFileId)
            )
            this.loadingFile = false
        },
    },
    created() {
        // Save a reference to the currently loaded file in the store, so we know if we need to refetch the products
        const routeFileId = this.$route.params.fileId
        if (this.currentFileId != routeFileId || this.filesUpdated) {
            this.setCurrentFileId(routeFileId)
            this.initRequiresFileId()
        } else {
            this.loadingFile = false
        }
        const routeSelectionId = this.$route.params.selectionId
        this.setCurrentSelectionId(routeSelectionId)

        // If we already have a workspace id, fetch the data we are missing
        if (this.currentWorkspaceId != null)
            this.initRequiresWorkspace()
        // Else, wait till a workspace id is set, and then fetch the data
        this.unsubWorkspace = this.$store.subscribe((mutation, state) => {
            if(mutation.type == 'persist/setCurrentWorkspace') {
                this.initRequiresWorkspace()
            } 
        })

    },
    destroyed() {
        this.unsubWorkspace()
    }
}
</script>

<style scoped lang="scss">

</style>