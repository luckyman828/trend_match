<template>
    <PageLoader
        :status="status"
        loadingMsg="loading file"
        errorMsg="error loading file"
        :fitPage="true"
        :errorCallback="() => fetchData()"
    >
        <EditPresentationPage />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import EditPresentationPage from './EditPresentationPage'
import PageLoader from '../../../components/common/PageLoader'

export default {
    name: 'editPresentationPageLoader',
    components: {
        PageLoader,
        EditPresentationPage,
    },
    data: function() {
        return { dataReady: false }
    },
    computed: {
        ...mapGetters('files', ['currentFile', 'filesStatus']),
        loading() {
            return !this.currentFile
        },
        status() {
            if (!this.dataReady) return 'loading'
            if (this.filesStatus == 'loading' || !this.currentFile) return 'loading'
            return 'success'
        },
    },
    methods: {
        ...mapActions('files', ['fetchFile']),
        ...mapActions('videoPresentation', ['fetchFileVideo', 'fetchVideo']),
        ...mapActions('videos', ['fetchVideoUrls']),
        ...mapMutations('videoPresentation', ['SET_CURRENT_VIDEO']),
        async fetchData() {
            // Fetch the current file and the products
            const presentationId = this.$route.params.presentationId
            const presentation = await this.fetchFile(presentationId)
            let video = null
            if (presentation.video_count > 0) {
                video = await this.fetchFileVideo(presentationId)
            }
            this.SET_CURRENT_VIDEO(video)
            await this.fetchVideoUrls(video)
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
