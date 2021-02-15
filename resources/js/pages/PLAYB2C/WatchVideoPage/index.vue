<template>
    <PageLoader :status="status" loadingMsg="Loading video">
        <template v-slot:mobile>
            <MobileWatchVideoPage />
        </template>
        <template v-slot:desktop>
            <DekstopWatchVideoPage />
        </template>
    </PageLoader>
</template>

<script>
import PageLoader from '../../../components/common/PageLoader'
import MobileWatchVideoPage from './Mobile/WatchVideoPage'
import DekstopWatchVideoPage from './Desktop/WatchVideoPage'
import { mapActions, mapMutations } from 'vuex'
export default {
    name: 'watchVideoPageLoader',
    components: {
        PageLoader,
        MobileWatchVideoPage,
        DekstopWatchVideoPage,
    },
    data() {
        return {
            loadingData: '',
        }
    },
    computed: {
        status() {
            return this.loadingData ? 'loading' : 'success'
        },
    },
    methods: {
        ...mapActions('videoPresentation', ['fetchVideo', 'fetchFileVideo']),
        ...mapActions('videoComments', ['fetchVideoComments']),
        ...mapActions('products', ['fetchProducts']),
        ...mapMutations('videoPresentation', ['SET_CURRENT_VIDEO']),
        async fetchData() {
            this.loadingData = true
            // Fetch video
            const videoId = this.$route.params.videoId
            const video = await this.fetchVideo(videoId)
            const fileVideo = await this.fetchFileVideo(video.file.id)
            this.SET_CURRENT_VIDEO(fileVideo)

            // Fetch the file products
            const fileId = video.file.id
            await Promise.all([this.fetchProducts({ fileId }), this.fetchVideoComments({ video })])
            this.loadingData = false
        },
    },
    created() {
        this.fetchData()
    },
}
</script>

<style></style>
