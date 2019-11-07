<template>
    <ScreenLoader :loading="loading">
        <EditFile/>
    </ScreenLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import EditFile from '../EditFile'
import ScreenLoader from './ScreenLoader'
import Collection from '../../../store/models/Collection'
import User from '../../../store/models/User'
import Product from '../../../store/models/Product'

export default {
    name: 'editFileLoader',
    components: {
        File,
        ScreenLoader,
        EditFile
    },
    data: function () { return {
        loadingFile: true,
    }},
    computed: {
        ...mapGetters('entities/collections', ['filesUpdated', 'loadingCollections']),
        ...mapGetters('entities/products', ['productsRaw']),
        ...mapGetters('persist', ['currentWorkspaceId', 'currentFileId', 'authUser']),
        products() {
            return this.productsRaw
        },
        loading () {
            return (this.products != null && !this.loadingFile && !this.loadingCollections) ? false : true
        },
    },
    methods: {
        ...mapActions('entities/collections', ['fetchCollections']),
        ...mapMutations('entities/collections', ['setFilesUpdated']),
        ...mapMutations('entities/products', ['setProductScope']),
        ...mapActions('entities/products', ['fetchProducts']),
        ...mapActions('persist', ['setCurrentFileId']),
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
        this.setProductScope('productsRaw')
        this.setFilesUpdated(true)
        if (this.currentFileId != routeFileId || this.filesUpdated) {
            this.setCurrentFileId(routeFileId)
            this.initRequiresFileId()
        } else {
            this.loadingFile = false
        }
    },
}
</script>

<style scoped lang="scss">

</style>