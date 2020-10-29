<template>
    <div class="video-presentation-page" :class="[{ started: playerStarted }, { playing: isPlaying }]">
        <div class="video-presentation-wrapper">
            <VideoPlayer :providerVideoId="videoId" :provider="provider" :autoplay="false">
                <div class="play-overlay" v-if="!playerStarted">
                    <h3>Welcome to the video presentation</h3>
                    <button class="xl white" @click="onStartPlaying">
                        <i class="far fa-play"></i>
                        <span>Play in full-screen</span>
                    </button>
                </div>
                <div class="watch-overlay">
                    <div class="actions-wrapper" :class="{ show: !isPlaying }">
                        <div class="actions">
                            <router-link class="button pill ghost white" :to="{ name: 'selection' }">
                                <i class="far fa-arrow-left"></i>
                                <span>View results / Back to selection</span>
                            </router-link>
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
                        <ProductDetailsSidebar />
                        <CartSidebar ref="cartSidebar" />
                        <PauseOverlay />
                        <PlayerControls />
                    </template>
                </div>
            </VideoPlayer>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import VideoPlayer from '../../components/common/VideoPlayer/'
import PlayerControls from './PlayerControls'
import ProductDetailsSidebar from './ProductDetailsSidebar'
import CartSidebar from './CartSidebar/'
import PauseOverlay from './PauseOverlay/'
import EndedOverlay from './EndedOverlay'

export default {
    name: 'watchVideoPresentationPage',
    components: {
        VideoPlayer,
        PlayerControls,
        ProductDetailsSidebar,
        CartSidebar,
        PauseOverlay,
        EndedOverlay,
    },
    data: function() {
        return {
            playerStarted: false,
            isConnectedToLiveUpdates: false,
        }
    },
    computed: {
        ...mapGetters('videoPresentation', {
            videoTimings: 'getVideoTimings',
        }),
        ...mapGetters('videoPlayer', {
            isPlaying: 'getIsPlaying',
            videoId: 'getProviderVideoId',
            provider: 'getProvider',
            playerStatus: 'getStatus',
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
        ...mapMutations('videoPresentation', ['ADD_TIMING']),
        onEnterFullscreen() {
            const elem = document.documentElement
            if (elem.requestFullscreen) {
                elem.requestFullscreen()
            } else if (elem.mozRequestFullScreen) {
                /* Firefox */
                elem.mozRequestFullScreen()
            } else if (elem.webkitRequestFullscreen) {
                /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen()
            } else if (elem.msRequestFullscreen) {
                /* IE/Edge */
                elem.msRequestFullscreen()
            }
        },
        onStartPlaying() {
            this.togglePlaying()
            this.onEnterFullscreen()
            this.playerStarted = true
            const interval = 1000
            const playerStartedTester = setInterval(() => {
                if (!this.isPlaying) {
                    this.togglePlaying()
                } else {
                    clearInterval(playerStartedTester)
                }
            }, interval)
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
    },
    destroyed() {
        if (this.isConnectedToLiveUpdates) {
            this.disconnectLiveUpdates()
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.video-presentation-page {
    height: 100%;
    .video-presentation-wrapper {
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    &:not(.started) {
        ::v-deep {
            .timeline {
                display: none;
            }
        }
    }
    ::v-deep {
        .timeline {
            bottom: $heightPlayerControls;
        }
    }
}
.watch-overlay {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
    .actions-wrapper {
        pointer-events: auto;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        margin: auto;
        display: flex;
        justify-content: center;
        z-index: 1;
        .actions {
            pointer-events: all;
            transition: transform 0.1s ease-out;
            transform: translateY(-100%);
            padding: 32px 0 16px;
        }
        &:hover,
        &.show {
            .actions {
                transform: none;
            }
        }
    }
}
.play-overlay {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
    overflow: hidden;
    pointer-events: none;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    display: flex;
    background: rgba(black, 0.85);
    color: white;
    pointer-events: all;
    h3 {
        color: white;
    }
    button {
        // cursor: pointer;
        margin-bottom: 92px;
        transition: 0.1s ease-out;
        &:hover {
            opacity: 0.9;
        }
    }
}
</style>
