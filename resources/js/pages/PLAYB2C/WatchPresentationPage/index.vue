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
        ...mapMutations('player', ['SET_DESIRED_QUALITY']),
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

            // Set the desired quality to the highest available on the video
            this.SET_DESIRED_QUALITY('HD1080P')

            this.loadingData = false
        },

        // // CODE TO RESPOND TO EVENTS FROM THE PARENT WINDOW
        postMessageHandler(event) {
            // Test that the origin matches
            const acceptedOrigin = 'https://kollektteststore.myshopify.com'

            if (!event.origin == acceptedOrigin) return
            // console.log('VUE, message recieved', event)
            const msgData = event.data
            if (msgData.action == 'updateBasketItems') {
                console.log('update basket items', msgData)
                msgData.items.map(item => {
                    const basketItem = this.$store.getters['basket/getBasketItem'](item)
                    console.log('the basket item', basketItem)
                    if (!basketItem) return
                    this.$store.commit('basket/SET_ITEM_QTY', { item: basketItem, quantity: item.quantity })
                })
            }
        },
        addPostMessageListeners() {
            window.addEventListener('message', this.postMessageHandler)
        },
        removePostMessageListeners() {
            window.removeEventListener('message', this.postMessageHandler)
        },
    },
    created() {
        this.fetchData()
        this.addPostMessageListeners()
    },
    destroyed() {
        this.removePostMessageListeners()
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
