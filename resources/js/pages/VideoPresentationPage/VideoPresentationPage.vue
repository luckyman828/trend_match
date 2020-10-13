<template>
    <div class="video-presentation-page">
        <div class="video-presentation-wrapper">
            <VideoPlayer
                :providerVideoId="currentVideo.providerVideoId"
                :provider="currentVideo.provider"
                :autoplay="false"
            >
                <div class="play-overlay" v-if="!playerStarted" @click="onStartPlaying">
                    <h3>Welcome to the video presentation</h3>
                    <button class="xl white">
                        <i class="far fa-play"></i>
                        <span>Play in full-screen</span>
                    </button>
                </div>
                <div class="watch-overlay" v-if="timingsReady">
                    <div class="actions" v-if="!isPlaying">
                        <router-link class="button pill ghost white" :to="{ name: 'selection' }">
                            <i class="far fa-arrow-left"></i>
                            <span>Back to selection</span>
                        </router-link>
                    </div>
                    <ProductDetailsSidebar v-if="playerStarted" />
                    <CartSidebar v-if="playerStarted" />
                    <PauseOverlay />
                    <PlayerControls />
                </div>
            </VideoPlayer>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VideoPlayer from '../../components/common/VideoPlayer/'
import PlayerControls from './PlayerControls'
import ProductDetailsSidebar from './ProductDetailsSidebar'
import CartSidebar from './CartSidebar/'
import PauseOverlay from './PauseOverlay/'

export default {
    name: 'watchVideoPresentationPage',
    components: {
        VideoPlayer,
        PlayerControls,
        ProductDetailsSidebar,
        CartSidebar,
        PauseOverlay,
    },
    data: function() {
        return {
            timingsReady: false,
            playerStarted: false,
        }
    },
    computed: {
        ...mapGetters('videoPresentation', {
            currentVideo: 'getCurrentVideo',
            videoTimings: 'getVideoTimings',
        }),
        ...mapGetters('videoPlayer', {
            isPlaying: 'getIsPlaying',
        }),
    },
    methods: {
        ...mapActions('videoPresentation', ['addTiming', 'initTimings']),
        ...mapActions('videoPlayer', ['togglePlaying']),
        // createTestData() {
        //     const products = this.$store.state.products.products
        //     const limit = 10
        //     for (let i = 0; i < limit; i++) {
        //         const product = products[i]
        //         const duration = 10
        //         const newTiming = {
        //             start: duration * i,
        //             end: duration * (i + 1),
        //             product,
        //         }
        //         this.addTiming({ newTiming })
        //     }
        // },
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
        },
    },
    async created() {
        await this.initTimings(this.videoTimings)
        this.timingsReady = true
        // this.createTestData()
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
