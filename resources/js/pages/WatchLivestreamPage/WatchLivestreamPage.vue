<template>
    <div class="video-presentation-page">
        <div class="video-presentation-wrapper">
            <VideoPlayer :providerVideoId="videoId" :provider="provider" :autoplay="false">
                <div class="play-overlay" v-if="!playerStarted" @click="onStartPlaying">
                    <h3>Welcome to the live presentation</h3>
                    <button class="xl white">
                        <i class="far fa-play"></i>
                        <span>Join livestream</span>
                    </button>
                </div>
                <div class="watch-overlay">
                    <div class="actions" v-if="!isPlaying">
                        <router-link class="button pill ghost white" :to="{ name: 'selection' }">
                            <i class="far fa-arrow-left"></i>
                            <span>View results / Back to selection</span>
                        </router-link>
                    </div>
                    <EndedOverlay
                        v-if="playerStatus == 'ended'"
                        @view-cart-ins="
                            $refs.cartSidebar.show = true
                            $refs.cartSidebar.cartView = 'ins'
                        "
                    />
                    <ProductDetailsSidebar v-if="playerStarted" />
                    <CartSidebar v-if="playerStarted" ref="cartSidebar" />
                    <PauseOverlay />
                    <PlayerControls />
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
            videoDuration: 'getDuration',
            currentTiming: 'getCurrentTiming',
        }),
        ...mapGetters('selections', {
            selection: 'getCurrentSelection',
        }),
    },
    methods: {
        ...mapActions('videoPlayer', ['togglePlaying']),
        ...mapActions('videoPresentation', ['initTimings']),
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

            // Keep the current timing, current
            const interval = 100
            setInterval(() => {
                const newTimestamp = this.videoDuration + interval / 1000
                const currentTiming = this.currentTiming
                if (currentTiming) {
                    currentTiming.end = Math.ceil(newTimestamp + 5)
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
            console.log('selection presentation change', eventName, args)
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
        },
        disconnectSignalR() {
            const connection = this.$connection

            this.$connection.invoke('UnSubscribeAll')
            connection.off('OnSelectionPresentationChanged', this.presentationChangeHandler)
        },
    },
    created() {
        this.connectToLiveUpdates()
    },
    destroyed() {
        this.disconnectSignalR()
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
    z-index: 1;
    overflow: hidden;
    pointer-events: none;
    .actions {
        pointer-events: all;
        position: absolute;
        top: 16px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
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
