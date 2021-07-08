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
import basket from '../../../store/modules/playb2c/basket'
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
        ...mapActions('playPresentation', ['fetchPresentationVideo']),
        // ...mapActions('productGroups', ['fetchFileProductGroups']),
        // ...mapActions('videoComments', ['fetchVideoComments']),
        ...mapActions('videos', ['fetchVideoUrls']),
        ...mapMutations('player', ['SET_DESIRED_QUALITY', 'SET_FULLSCREEN_MODE_ACTIVE']),
        async fetchData() {
            this.loadingData = true
            // Fetch presentation details
            const presentationId = this.$route.params.presentationId
            const video = await this.fetchPresentationVideo(presentationId)

            await Promise.all([
                // this.fetchProducts({ fileId: presentationId }),
                // this.fetchFileProductGroups(presentationId),
                // this.fetchVideoComments({ video }),
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
            const msgData = event.data
            console.log('VUE, message recieved', msgData)

            if (msgData.action == 'syncBasket') {
                console.log('sync basket', msgData)
                msgData.items.map(item => {
                    const basketItem = this.$store.getters['basket/getBasket'].find(
                        basketItem =>
                            basketItem.variant.ref_id == item.ref_id && basketItem.sizeDetail.size == item.size
                    )
                    if (basketItem) {
                        this.$store.commit('basket/SET_ITEM_QTY', { item: basketItem, quantity: item.quantity })
                    } else {
                        // If the basket item is not already in our basket, see if the item exists in our presentation, then add it if it is
                        let variant
                        let sizeDetail
                        const product = this.$store.getters['products/getProducts'].find(product => {
                            variant = product.variants.find(variant => {
                                sizeDetail = variant.ean_sizes.find(size => size.ref_id == item.ref_id)
                                return !!sizeDetail
                            })
                            return !!variant
                        })
                        console.log(
                            'syncing basket. The item',
                            item,
                            'the variant',
                            variant,
                            'the detail',
                            sizeDetail,
                            'local products',
                            this.$store.getters['products/getProducts']
                        )
                        if (variant && sizeDetail) {
                            this.$store.commit('basket/ADD_ITEM', { variant, sizeDetail, quantity: item.quantity })
                        }
                    }
                })
            }

            if (msgData.action == 'updateBasketItems') {
                msgData.items.map(item => {
                    const basketItem = this.$store.getters['basket/getBasketItem'](item)
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
