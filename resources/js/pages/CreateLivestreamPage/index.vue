<template>
    <PageLoader
        :status="status"
        loadingMsg="loading file"
        errorMsg="error loading file"
        :fitPage="true"
        :errorCallback="() => fetchData()"
    >
        <CreateLivestreamPage />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import CreateLivestreamPage from './CreateLivestreamPage'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'createLivestreamPageLoader',
    components: {
        PageLoader,
        CreateLivestreamPage,
    },
    data: function() {
        return {
            loadingData: true,
        }
    },
    computed: {
        ...mapGetters('products', ['productsStatus']),
        ...mapGetters('files', ['currentFile', 'filesStatus']),
        status() {
            if (this.loadingData) return 'loading'
            if (this.productsStatus == 'error' || this.filesStatus == 'error') return 'error'
            if (this.productsStatus == 'loading' || this.filesStatus == 'loading' || !this.currentFile) return 'loading'
            return 'success'
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('products', ['fetchProducts']),
        ...mapActions('selections', ['fetchSelections', 'createSelectionTree']),
        ...mapActions('videoPresentation', ['fetchFileVideo']),
        ...mapMutations('videoPlayer', ['SET_VIDEO_TYPE']),
        ...mapMutations('videoPresentation', ['SET_CURRENT_VIDEO']),
        async fetchData() {
            this.loadingData = true
            // Fetch the current file and the products
            const fileId = this.$route.params.fileId
            this.fetchFile(fileId)
            this.fetchProducts({ fileId })
            const selections = await this.fetchSelections({ fileId })
            await this.createSelectionTree(selections)

            this.SET_CURRENT_VIDEO(null)

            this.loadingData = false
        },
    },
    created() {
        this.fetchData()
        this.SET_VIDEO_TYPE('live')
    },
}
</script>

<style scoped lang="scss"></style>
