<template>
    <PageLoader v-if="videoStatus != '404'" :status="status" loadingMsg="Loading video">
        <template v-slot:mobile>
            <MobileWatchVideoPage />
        </template>
        <template v-slot:desktop>
            <DekstopWatchVideoPage />
        </template>
    </PageLoader>
    <div class="error-wrapper flex-list center-v center-h flex-v" v-else>
        <img src="/images/undraw_void_3ggu.svg" alt="not found image" />
        <p>
            Video with ID: <strong>{{ $route.params.videoId }}</strong
            >, not found
        </p>
    </div>
</template>

<script>
import PageLoader from '../../../components/common/PageLoader'
import MobileWatchVideoPage from './Mobile/WatchVideoPage'
import DekstopWatchVideoPage from './Desktop/WatchVideoPage'
import { mapActions, mapGetters, mapMutations } from 'vuex'
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
        ...mapGetters('videoPresentation', {
            videoStatus: 'getStatus',
        }),
        status() {
            return this.videoStatus == '404' ? 'error' : this.loadingData ? 'loading' : 'success'
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
            if (!video) return
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

<style scoped lang="scss">
.error-wrapper {
    height: 100%;
    img {
        width: 80%;
        max-width: 320px;
        margin-bottom: 20px;
    }
}
</style>
