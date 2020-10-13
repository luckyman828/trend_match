<template>
    <div class="video-presentation-page">
        <div class="video-presentation-wrapper">
            <VideoPlayer :providerVideoId="currentVideo.providerVideoId" :provider="currentVideo.provider">
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
    },
    created() {
        this.createTestData()
    },
}
</script>

<style lang="scss" scoped>
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
</style>
