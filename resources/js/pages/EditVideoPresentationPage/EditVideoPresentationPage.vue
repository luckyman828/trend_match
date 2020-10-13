<template>
    <div class="edit-video-presentation">
        <SearchProductsPanel />
        <VideoPlayer :providerVideoId="currentVideo.providerVideoId" :provider="currentVideo.provider">
            <VideoPreview />
        </VideoPlayer>

        <TimelinePanel />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    computed: {
        ...mapGetters('videoPresentation', {
            currentVideo: 'getCurrentVideo',
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
