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
        <VideoPlayer :providerVideoId="videoId" :provider="provider" :autoplay="true">
            <VideoPreview />
            <ChatOverlay v-if="!!currentVideo" />
        </VideoPlayer>

        <TimelinePanel />
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SearchItemsPanel from '../../components/common/SearchItemsPanel/'
import VideoPreview from './VideoPreview/'
import VideoPlayer from '../../components/common/VideoPlayer/'
import TimelinePanel from './TimelinePanel/'
import ProductSearchListItem from './ProductSearchListItem'
import ChatOverlay from '../WatchVideoPresentationPage/ChatOverlay'

export default {
    name: 'createLivestreamPage',
    components: {
        SearchItemsPanel,
        VideoPreview,
        TimelinePanel,
        VideoPlayer,
        ProductSearchListItem,
        ChatOverlay,
    },
    computed: {
        ...mapGetters('videoPlayer', {
            provider: 'getProvider',
            videoId: 'getProviderVideoId',
        }),
        ...mapGetters('videoPresentation', {
            currentVideo: 'getCurrentVideo',
        }),
        ...mapGetters('products', {
            products: 'getProducts',
        }),
    },
    methods: {
        ...mapActions('videoPresentation', ['updateCurrentVideo']),
        ...mapMutations('videoPlayer', ['SET_VIDEO_TYPE']),
    },
    destroyed() {
        this.SET_VIDEO_TYPE('static')
        // Update the current video if any
        if (this.currentVideo) {
            this.updateCurrentVideo()
        }
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
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
    .chat-overlay {
        bottom: 16px;
    }
}
</style>
