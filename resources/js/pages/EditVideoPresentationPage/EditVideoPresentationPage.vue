<template>
    <div class="edit-video-presentation">
        <SearchProductsPanel />
        <VideoPlayer :providerVideoId="providerVideoId" :provider="provider" :autoplay="true">
            <VideoPreview />
        </VideoPlayer>

        <TimelinePanel v-if="timingsReady" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SearchProductsPanel from './SearchProductsPanel/'
import VideoPreview from './VideoPreview/'
import VideoPlayer from '../../components/common/VideoPlayer/'
import TimelinePanel from './TimelinePanel/'

export default {
    name: 'editVideoPresentationPage',
    components: {
        SearchProductsPanel,
        VideoPreview,
        TimelinePanel,
        VideoPlayer,
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
}
</style>
