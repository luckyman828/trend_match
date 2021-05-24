<template>
    <PageLoader
        :status="status"
        loadingMsg="loading file"
        errorMsg="error loading file"
        :fitPage="true"
        :errorCallback="() => fetchData()"
    >
        <Navbar />
        <EditPresentationPage />
    </PageLoader>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import EditPresentationPage from './EditPresentationPage'
import Navbar from './Navbar'
import PageLoader from '../../../components/common/PageLoader'

export default {
    name: 'play.editPresentationPageLoader',
    components: {
        PageLoader,
        EditPresentationPage,
        Navbar,
    },
    data: function() {
        return { dataReady: false }
    },
    computed: {
        ...mapGetters('playPresentation', {
            video: 'getVideo',
            presentation: 'getPresentation',
        }),
        status() {
            if (!this.dataReady) return 'loading'
            return 'success'
        },
        videoStatus() {
            console.log('get video status', this.presentation, this.presentation && this.presentation.video)
            return (
                this.presentation && this.presentation.uploadChannel && this.presentation.uploadChannel.progress.status
            )
        },
    },
    watch: {
        videoStatus(newStatus, oldStatus) {
            console.log('video status changes', newStatus, oldStatus, this.video)
            if (!this.video && newStatus == 'Available') {
                // Start process to check if the video is ready
                this.initVideo()
            }
        },
    },
    methods: {
        ...mapActions('playPresentation', ['fetchPresentation', 'fetchPresentationVideo']),
        ...mapActions('products', ['fetchProducts']),
        ...mapActions('videos', ['fetchVideoUrls', 'checkVideoStatus', 'startVideoStatusCheckJob']),
        async fetchData() {
            this.dataReady = false

            const presentationId = this.$route.params.presentationId
            await Promise.all([
                await this.fetchPresentation(presentationId),
                await this.fetchProducts({ fileId: presentationId }),
            ])
            const video = this.video
            if (video) {
                const status = await this.checkVideoStatus(this.video)
                if (status == 'Available') {
                    await this.fetchVideoUrls(video)
                } else {
                    this.startVideoStatusCheckJob(this.video)
                }
            }

            this.dataReady = true
        },
        async initVideo() {
            await this.fetchPresentationVideo(this.presentation.id)
            await this.fetchVideoUrls(this.video)
        },
    },
    created() {
        this.fetchData()
    },
}
</script>

<style scoped lang="scss"></style>
