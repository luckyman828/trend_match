<template>
    <div class="edit-video-presentation">
        <SearchItemsPanel
            class="search-products-panel"
            :items="products"
            :searchKey="['datasource_id', 'title', 'eans']"
            :item-size="144"
            v-slot="slotProps"
        >
            <ProductSearchListItem :product="slotProps.item" />
        </SearchItemsPanel>
        <VideoPlayer :providerVideoId="providerVideoId" :provider="provider" :autoplay="true">
            <VideoPreview />
        </VideoPlayer>

        <TimelinePanel v-if="timingsReady" />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SearchItemsPanel from '../../components/common/SearchItemsPanel/'
import VideoPreview from './VideoPreview/'
import VideoPlayer from '../../components/common/VideoPlayer/'
import TimelinePanel from './TimelinePanel/'
import ProductSearchListItem from './ProductSearchListItem'

export default {
    name: 'editVideoPresentationPage',
    components: {
        SearchItemsPanel,
        VideoPreview,
        TimelinePanel,
        VideoPlayer,
        ProductSearchListItem,
    },
    data: function() {
        return {
            timingsReady: true,
        }
    },
    computed: {
        ...mapGetters('videoPresentation', {
            currentVideo: 'getCurrentVideo',
            videoTimings: 'getVideoTimings',
        }),
        ...mapGetters('videoPlayer', {
            provider: 'getProvider',
            providerVideoId: 'getProviderVideoId',
        }),
        ...mapGetters('products', {
            products: 'getProducts',
        }),
    },
    methods: {
        ...mapActions('videoPresentation', ['updateCurrentVideo']),
        ...mapMutations('videoPresentation', ['REMOVE_TIMING']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
    },
    created() {
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
                this.updateCurrentVideo()
            }
        }
    },
}
</script>

<style scoped lang="scss">
.edit-video-presentation {
    display: grid;
    grid-template-columns: 300px auto;
    grid-template-rows: auto calc(#{$heightEditVideoTimeline} + #{$heightPreviewPlayerControls});
    grid-template-areas:
        'sidebar main'
        'sidebar timeline';
    .search-products-panel {
        height: calc(100vh - #{$navbarHeight});
        grid-area: sidebar;
    }
}
</style>
