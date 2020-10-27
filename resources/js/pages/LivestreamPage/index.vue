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
        ...mapActions('selections', ['fetchSelections']),
        ...mapActions('videoPresentation', ['fetchFileVideo']),
        ...mapMutations('videoPlayer', ['SET_VIDEO_TYPE']),
        ...mapMutations('videoPresentation', ['SET_CURRENT_VIDEO']),
        async fetchData() {
            this.loadingData = true
            // Fetch the current file and the products
            const fileId = this.$route.params.fileId
            this.fetchFile(fileId)
            this.fetchProducts({ fileId })
            this.fetchSelections({ fileId })

            // const fileVideo = await this.fetchFileVideo(fileId)
            // this.SET_CURRENT_VIDEO(fileVideo)
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
