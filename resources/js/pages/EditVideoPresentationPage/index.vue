<template>
    <PageLoader
        :status="status"
        loadingMsg="loading file"
        errorMsg="error loading file"
        :fitPage="true"
        :errorCallback="() => fetchData()"
    >
        <EditVideoPresentationPage />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import EditVideoPresentationPage from './EditVideoPresentationPage'
import PageLoader from '../../components/common/PageLoader'

export default {
    name: 'editVideoPresentationLoader',
    components: {
        PageLoader,
        EditVideoPresentationPage,
    },
    data: function() {
        return { dataReady: false }
    },
    computed: {
        ...mapGetters('products', ['productsStatus']),
        ...mapGetters('files', ['currentFile', 'filesStatus']),
        loading() {
            return this.productsStatus != 'success' || !this.currentFile
        },
        status() {
            if (!this.dataReady) return 'loading'
            if (this.productsStatus == 'error' || this.filesStatus == 'error') return 'error'
            if (this.productsStatus == 'loading' || this.filesStatus == 'loading' || !this.currentFile) return 'loading'
            return 'success'
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('products', ['fetchProducts']),
        ...mapActions('videoPresentation', ['fetchFileVideo', 'fetchVideo']),
        ...mapMutations('videoPresentation', ['SET_CURRENT_VIDEO']),
        async fetchData() {
            // Fetch the current file and the products
            const fileId = this.$route.params.fileId
            this.fetchProducts({ fileId })
            const file = await this.fetchFile(fileId)
            let video = null
            if (file.video_count > 0) {
                video = await this.fetchFileVideo(fileId)
                // video = await this.fetchVideo(fileVideo.video.id)
            }
            this.SET_CURRENT_VIDEO(video)
            this.dataReady = true
        },
    },
    created() {
        this.fetchData()
    },
    destroyed() {
        this.SET_CURRENT_VIDEO(null)
    },
}
</script>

<style scoped lang="scss"></style>
