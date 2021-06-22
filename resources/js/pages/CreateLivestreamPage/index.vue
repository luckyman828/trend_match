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
        ...mapGetters('liveUpdates', {
            liveUpdateIsConnected: 'getIsConnected',
        }),
        status() {
            if (this.loadingData) return 'loading'
            if (this.filesStatus == 'error') return 'error'
            if (this.filesStatus == 'loading' || !this.currentFile || !this.liveUpdateIsConnected) return 'loading'
            return 'success'
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('products', ['fetchProducts']),
        ...mapActions('selections', ['fetchSelections', 'createSelectionTree']),
        ...mapActions('videoPresentation', ['fetchFileVideo']),
        ...mapActions('presentation', ['fetchPresentationDetails']),
        ...mapActions('selectionProducts', ['fetchSelectionProducts']),
        ...mapActions('videoComments', ['fetchVideoComments']),
        ...mapMutations('videoPlayer', ['SET_VIDEO_TYPE']),
        ...mapMutations('videoPresentation', ['SET_CURRENT_VIDEO']),
        ...mapMutations('selections', ['SET_CURRENT_SELECTIONS']),
        async fetchData() {
            this.loadingData = true
            // Fetch the current file and the products
            const fileId = this.$route.params.fileId
            this.fetchProducts({ fileId })
            const file = await this.fetchFile(fileId)
            const selections = await this.fetchSelections({ fileId })
            await this.createSelectionTree(selections)

            const presentationId = this.$route.params.presentationId
            if (presentationId && file.video_count > 0) {
                const presentation = await this.fetchPresentationDetails(presentationId)
                await this.fetchSelectionProducts(presentation.selections[0])
                this.SET_CURRENT_SELECTIONS([presentation.selections[0]])

                const video = await this.fetchFileVideo(fileId)
                this.SET_CURRENT_VIDEO(video)
                this.fetchVideoComments({ video })
            } else {
                this.SET_CURRENT_VIDEO(null)
            }

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
