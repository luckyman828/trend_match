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
                <div class="watch-overlay">
                    <div class="actions" v-if="!isPlaying">
                        <router-link class="button pill ghost white" :to="{ name: 'selection' }">
                            <i class="far fa-arrow-left"></i>
                            <span>Back to selection</span>
                        </router-link>
                    </div>
                    <ProductDetailsSidebar />
                    <CartSidebar />
                    <PauseOverlay />
                </div>
            </VideoPlayer>
            <PlayerControls />
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
            playerStarted: false,
        }
    },
    computed: {
        ...mapGetters('videoPresentation', {
            currentVideo: 'getCurrentVideo',
        }),
        ...mapGetters('videoPlayer', {
            isPlaying: 'getIsPlaying',
        }),
    },
    methods: {
        ...mapActions('videoPresentation', ['addTiming']),
        ...mapActions('videoPlayer', ['togglePlaying']),
        createTestData() {
            const products = this.$store.state.products.products
            const limit = 10
            for (let i = 0; i < limit; i++) {
                const product = products[i]
                const duration = 10
                const newTiming = {
                    start: duration * i,
                    end: duration * (i + 1),
                    product,
                }
                this.addTiming({ newTiming })
            }
        },
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
    created() {
        this.createTestData()
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
    background: rgba($dark100, 0.8);
    color: white;
    pointer-events: all;
    cursor: pointer;
    h3 {
        color: white;
    }
    // button {
    // }
}
</style>
