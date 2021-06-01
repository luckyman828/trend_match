<template>
    <div class="edit-video-presentation">
        <ProductSearchPanel />
        <div
            class="video-area"
            :style="{ backgroundImage: presentation.thumbnail && `url(${presentation.thumbnail})` }"
        >
            <VideoPlayer v-if="video && video.urls" :video="video" :autoplay="false" quality="SD360P" />
            <div class="placeholder bg-blur" v-else>
                <div class="message flex-list flex-v center-h center-h bg-blur">
                    <div class="color-white ft-16 ft-bd">Timeline and preview is unavailable while uploading</div>
                    <div class="color-white ft-12 ft-md">
                        Create looks or favorite styles while your video is being uploaded.
                    </div>
                </div>
            </div>
        </div>

        <TimelinePanel v-if="timingsReady" />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ProductSearchPanel from './ProductSearchPanel/'
import VideoPlayer from '../../../components/PLAY/VideoPlayer'
import TimelinePanel from './TimelinePanel/'

export default {
    name: 'play.EditPresentationPage',
    components: {
        ProductSearchPanel,
        TimelinePanel,
        VideoPlayer,
    },
    data: function() {
        return {}
    },
    computed: {
        ...mapGetters('playPresentation', {
            video: 'getVideo',
            videoTimings: 'getTimings',
            presentation: 'getPresentation',
            timingsReady: 'getTimingsReady',
        }),
        ...mapGetters('products', {
            products: 'getProducts',
            productStatus: 'getStatus',
        }),
        timingAndProductsReady() {
            return this.productStatus == 'success' && this.timingsReady
        },
    },
    watch: {
        timingAndProductsReady(isReady) {
            if (isReady) this.onTimingsReady()
        },
    },
    methods: {
        ...mapActions('playPresentation', ['updatePresentation']),
        ...mapMutations('playPresentation', ['REMOVE_TIMING']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        onTimingsReady() {
            // Remove timings that no longer have a matching product
            if (this.videoTimings && this.videoTimings.length > 0) {
                let removedCount = 0
                for (let i = this.videoTimings.length - 1; i >= 0; i--) {
                    const timing = this.videoTimings[i]
                    if (!timing.product) {
                        this.REMOVE_TIMING(i)
                        removedCount++
                    }
                }
                if (removedCount > 0) {
                    this.SHOW_SNACKBAR({
                        msg: `Removed ${removedCount} timing${
                            removedCount > 1 ? 's' : ''
                        }, whose product no longer exists.`,
                        iconClass: 'fa-info',
                        type: 'info',
                        duration: 10000, // 10 seconds
                    })
                    this.updatePresentation()
                }
            }
        },
    },
    created() {
        if (this.timingAndProductsReady) this.onTimingsReady()
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.edit-video-presentation {
    display: grid;
    grid-template-columns: 352px auto;
    grid-template-rows: auto 300px;
    grid-template-areas:
        'sidebar main'
        'sidebar timeline';
    height: 100%;
    .search-products-panel {
        height: calc(100vh - #{$navbarHeight});
        grid-area: sidebar;
    }
    .video-area {
        grid-area: main;
        background-size: cover;
        background-position: center;
        .bg-blur::before {
            backdrop-filter: blur(25px);
            background: rgba(white, 15%);
        }
    }
    .placeholder {
        height: 100%;
        width: 100%;
        background: rgba(black, 75%);
        display: flex;
        justify-content: center;
        align-items: center;
        .message {
            padding: 24px 32px;
            z-index: 1;
            border-radius: $borderRadiusMd;
        }
    }
}
</style>
