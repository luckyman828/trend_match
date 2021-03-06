<template>
    <div
        class="video-presentation-page"
        :class="[
            { started: playerStarted },
            { playing: isPlaying },
            playerStatus,
            { 'recently-started': recentlyStarted },
        ]"
    >
        <VideoPlayer :providerVideoId="videoId" :provider="provider" :autoplay="false">
            <BeforeStartScreen v-if="!playerStarted" :video="video" @start="onStartPlaying" />

            <VideoTitle :video="video" :selection="selection" v-if="selection" />

            <template v-if="playerStarted">
                <VideoTimeline />
                <!-- <VolumeControl class="volume-control" /> -->
                <ProductActions @show-chat="showChatInput = true" />
                <ChatInput v-if="showChatInput" @close="showChatInput = false" />
                <ChatArea />
                <ProductPreview />
                <ProductDetailsDrawer
                    :show="!!sidebarProduct"
                    :product="sidebarProduct"
                    @close="SET_SIDEBAR_PRODUCT(null)"
                />
                <CartDrawer />
            </template>
        </VideoPlayer>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VideoPlayer from '../../components/common/VideoPlayer/'
import VideoTimeline from '../../components/common/VideoPlayer/VideoTimeline'
import ProductDetailsDrawer from './ProductDetailsDrawer'
import ProductPreview from './ProductPreview'
import ProductActions from './ProductActions'
import VideoTitle from './VideoTitle'
import ChatInput from './ChatInput'
import ChatArea from './ChatArea'
import BeforeStartScreen from './BeforeStartScreen'
import CartDrawer from './CartDrawer/'
import VolumeControl from '../../components/common/VideoPlayer/VolumeControl.vue'

export default {
    name: 'mobileVideoPresentationPage',
    components: {
        VideoPlayer,
        VideoTitle,
        VideoTimeline,
        ProductDetailsDrawer,
        ProductPreview,
        ProductActions,
        CartDrawer,
        BeforeStartScreen,
        ChatInput,
        ChatArea,
        VolumeControl,
    },
    data: function() {
        return {
            playerStarted: false,
            isConnectedToLiveUpdates: false,
            showControls: true,
            showCart: false,
            showChatInput: false,
            playerStartedTester: null,
            recentlyStarted: false,
        }
    },
    computed: {
        ...mapGetters('videoPresentation', {
            videoTimings: 'getVideoTimings',
            video: 'getCurrentVideo',
            sidebarProduct: 'getSidebarProduct',
        }),
        ...mapGetters('videoPlayer', {
            isPlaying: 'getIsPlaying',
            videoId: 'getProviderVideoId',
            provider: 'getProvider',
            playerStatus: 'getStatus',
            desiredStatus: 'getDesiredStatus',
            videoType: 'getVideoType',
            videoDuration: 'getDuration',
            isLive: 'getIsLive',
        }),
        ...mapGetters('selections', {
            selection: 'getCurrentSelection',
        }),
        ...mapGetters('presentation', {
            presentedProductId: 'getCurrentProductId',
        }),
        ...mapGetters('products', {
            products: 'products',
        }),
    },
    watch: {
        playerStatus(newVal) {
            if (newVal == 'playing' && this.isLive && this.videoTimings.length > 0) {
                // Wait a little, so we have fetched the correct duration in case of a livestream
                setTimeout(() => {
                    // Check if a product is currently being presented. If so, make sure we make it our current
                    const lastTiming = this.videoTimings[this.videoTimings.length - 1]
                    if (lastTiming.product_id == this.presentedProductId) {
                        lastTiming.end_at_ms = Math.ceil(this.videoDuration + 5000)
                    }
                }, 200)
            }
        },
    },
    methods: {
        ...mapActions('videoPresentation', ['initTimings']),
        ...mapActions('videoPlayer', ['togglePlaying']),
        ...mapMutations('videoPlayer', ['SET_DESIRED_STATUS']),
        ...mapMutations('videoPresentation', ['ADD_TIMING', 'SET_SIDEBAR_PRODUCT']),
        onStartPlaying() {
            this.togglePlaying()
            this.playerStarted = true
            const interval = 1000
            this.SET_DESIRED_STATUS('playing')
            this.playerStartedTester = setInterval(() => {
                if (!this.isPlaying && this.desiredStatus == 'playing') {
                    this.togglePlaying()
                } else {
                    clearInterval(this.playerStartedTester)
                }
            }, interval)

            // Add a class to the player to tell that it has recently been started
            this.recentlyStarted = true
            setTimeout(() => {
                this.recentlyStarted = false
            }, 4000)
        },
        presentationChangeHandler(eventName, args) {},
        async videoTimingsUpdatedHandler(videoId, videoTimings) {
            if (this.video.id != videoId) return

            // Replace the last 2 timings with the new timings
            const newTimings = videoTimings.slice(videoTimings.length - 2)
            await this.initTimings(newTimings)
            this.videoTimings.splice(this.videoTimings.length - 1, 1, ...newTimings)
        },
        connectToLiveUpdates() {
            const connection = this.$connection

            // Subscribe to our selections
            connection.invoke('Subscribe', this.selection.id)
            connection.on('OnSelectionPresentationChanged', this.presentationChangeHandler)
            connection.on('OnVideoTimingsUpdated', this.videoTimingsUpdatedHandler)

            this.isConnectedToLiveUpdates = true
        },
        disconnectLiveUpdates() {
            const connection = this.$connection

            this.$connection.invoke('UnSubscribeAll')
            connection.off('OnSelectionPresentationChanged', this.presentationChangeHandler)
            connection.off('OnVideoTimingsUpdated', this.videoTimingsUpdatedHandler)

            this.isConnectedToLiveUpdates = false
        },
    },
    created() {
        // Check if we are in a presentation
        // if (this.isLive) {
        this.connectToLiveUpdates()
        // }
        // Make the page full screen
        document.body.classList.add('fit-height')
    },
    destroyed() {
        if (this.isConnectedToLiveUpdates) {
            this.disconnectLiveUpdates()
        }
        if (this.playerStartedTester) clearInterval(this.playerStartedTester)
    },
}
</script>

<style lang="scss" scoped>
.video-presentation-page {
    position: fixed;
    bottom: 0px;
    right: 0px;
    width: 100%;
    height: 100%;
    overscroll-behavior: none;
    z-index: 2147483646;
    .timeline {
        position: fixed;
        // bottom: 6px;
        left: 16px;
        width: calc(100% - 2 * 16px);
    }
}
</style>
