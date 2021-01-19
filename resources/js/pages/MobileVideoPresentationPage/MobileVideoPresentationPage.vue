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
            <!-- <div class="watch-overlay">
                <div class="top-items flex-list md">
                    <button
                        class="dark blur circle"
                        @click="
                            $router.push({
                                name: 'selection',
                                params: { fileId: selection.file_id, selectionId: selection.id },
                            })
                        "
                    >
                        <i class="fal fa-arrow-left"></i>
                    </button>
                    <div class="flex-list flex-v xs">
                        <span class="selection-name">{{ selection.name }}</span>
                        <span class="brand-name">{{ workspace.title }}</span>
                    </div>
                </div>
                <EndedOverlay
                    v-if="playerStatus == 'ended'"
                    @view-cart-ins="
                        $refs.cartSidebar.show = true
                        $refs.cartSidebar.cartView = 'ins'
                    "
                />
                <template v-if="playerStarted">
                    <ProductActionSelector />

                    <CartSidebar :show="showCart" @close="showCart = false" v-slot="slotProps">
                        <button class="pill white" @click="showCart = true">
                            <i class="far fa-heart"></i>
                            <div class="counter circle xs black">{{ slotProps.ins.length }}</div>
                        </button>
                    </CartSidebar>
                    <ProductPreview @click.native="showProductDrawer = true" />
                    
                </template>
            </div> -->
        </VideoPlayer>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VideoPlayer from '../../components/common/VideoPlayer/'
import VideoTimeline from '../../components/common/VideoPlayer/VideoTimeline'
import PlayerControls from '../WatchVideoPresentationPage/PlayerControls'
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
        PlayerControls,
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
        ...mapMutations('videoPresentation', ['ADD_TIMING', 'SET_SIDEBAR_PRODUCT']),
        onStartPlaying() {
            this.togglePlaying()
            this.playerStarted = true
            const interval = 1000
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
        async onNewProduct(productId) {
            // Find the new start
            const newStart = Math.round(this.videoDuration)

            // Stop the current timing if any
            if (this.currentTiming) {
                this.currentTiming.end_at_ms = newStart - 1
            }

            // Add the new timing
            const newTiming = {
                start_at_ms: newStart,
                end_at_ms: Math.ceil(this.videoDuration + 5),
                product_id: productId,
            }
            await this.initTimings([newTiming])
            this.ADD_TIMING({ timing: newTiming, index: null })
        },
        presentationChangeHandler(eventName, args) {
            if (eventName == 'ProductChanged') {
                const productId = args.detail[0].product_id
                this.onNewProduct(productId)
            }
        },
        connectToLiveUpdates() {
            const connection = this.$connection

            // Subscribe to our selections
            connection.invoke('Subscribe', this.selection.id)
            connection.on('OnSelectionPresentationChanged', this.presentationChangeHandler)

            this.isConnectedToLiveUpdates = true
        },
        disconnectLiveUpdates() {
            const connection = this.$connection

            this.$connection.invoke('UnSubscribeAll')
            connection.off('OnSelectionPresentationChanged', this.presentationChangeHandler)

            this.isConnectedToLiveUpdates = false
        },
    },
    created() {
        // Check if we are in a presentation
        if (this.isLive) {
            this.connectToLiveUpdates()
        }
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
@import '~@/_variables.scss';
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
// .player-controls {
//     z-index: 999;
//     bottom: 50%;
//     height: 120px;
// }

// .bottom-items {
//     position: absolute;
//     bottom: 8px;
//     width: 100%;
//     display: flex;
//     justify-content: space-between;
//     align-items: flex-end;
//     left: 0;
//     padding: 12px;
//     background: linear-gradient(0deg, black, transparent);
//     pointer-events: all;
// }
// .watch-overlay {
//     position: absolute;
//     left: 0;
//     top: 0;
//     height: 100%;
//     width: 100%;
//     z-index: 2;
//     overflow: hidden;
//     pointer-events: none;

//     .actions-wrapper {
//         pointer-events: auto;
//         position: absolute;
//         top: 0;
//         left: 0;
//         width: 100%;
//         margin: auto;
//         display: flex;
//         justify-content: center;
//         z-index: 1;
//         .actions {
//             pointer-events: all;
//             transition: transform 0.1s ease-out;
//             transform: translateY(-100%);
//             padding: 32px 0 16px;
//         }
//         &:hover,
//         &.show {
//             .actions {
//                 transform: none;
//             }
//         }
//     }
// }
</style>
