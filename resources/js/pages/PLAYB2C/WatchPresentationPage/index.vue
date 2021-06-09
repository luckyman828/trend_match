<template>
    <PageLoader v-if="videoStatus != '404'" :status="status" loadingMsg="Loading video">
        <template v-slot:mobile>
            <MobileWatchPresentationPage />
        </template>
        <template v-slot:desktop>
            <DekstopWatchPresentationPage />
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
import MobileWatchPresentationPage from './Mobile/WatchPresentationPage'
import DekstopWatchPresentationPage from './Desktop/WatchPresentationPage'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'play.watchPresentationPageLoader',
    components: {
        PageLoader,
        MobileWatchPresentationPage,
        DekstopWatchPresentationPage,
    },
    data() {
        return {
            loadingData: '',
        }
    },
    computed: {
        ...mapGetters('playPresentation', {
            video: 'getVideo',
            videoStatus: 'getStatus',
        }),
        status() {
            return this.videoStatus == '404' ? 'error' : this.loadingData ? 'loading' : 'success'
        },
    },
    methods: {
        ...mapActions('playPresentation', ['fetchPresentation']),
        ...mapActions('videoComments', ['fetchVideoComments']),
        ...mapActions('productGroups', ['fetchFileProductGroups']),
        ...mapActions('products', ['fetchProducts']),
        ...mapActions('videos', ['fetchVideoUrls']),
        async fetchData() {
            this.loadingData = true
            // Fetch presentation details
            const presentationId = this.$route.params.presentationId
            await this.fetchPresentation(presentationId)
            const video = this.video

            await Promise.all([
                this.fetchProducts({ fileId: presentationId }),
                this.fetchFileProductGroups(presentationId),
                this.fetchVideoComments({ video }),
                this.fetchVideoUrls(video),
            ])
            this.loadingData = false
        },

        // // CODE TO RESPOND TO EVENTS FROM THE PARENT WINDOW
        // postMessageHandler(event) {
        //     console.log('VUE, message recieved', event)
        //     // Test that the origin matches
        //     if (!event.origin == 'https://kollektteststore.myshopify.com') return
        //     const msgData = event.data
        //     if (msgData.action == 'updateBasketItem') {
        //         this.$store.commit('basket/UPDATE_BASKET_ITEM', msgData.item)
        //     }
        // },
        // addPostMessageListeners() {
        //     window.addEventListener('message', this.postMessageHandler)
        // },
        // removePostMessageListeners() {
        //     window.removeEventListener('message', this.postMessageHandler)
        // },
    },
    created() {
        this.fetchData()
        // this.addPostMessageListeners()
    },
    destroyed() {
        // this.removePostMessageListeners()
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
