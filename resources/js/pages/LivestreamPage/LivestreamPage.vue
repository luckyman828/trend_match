<template>
    <div class="edit-video-presentation">
        <SearchProductsPanel />
        <VideoPlayer :providerVideoId="currentVideo.providerVideoId" :provider="currentVideo.provider" :autoplay="true">
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
    name: 'livestreamPage',
    components: {
        SearchProductsPanel,
        VideoPreview,
        TimelinePanel,
        VideoPlayer,
    },
    data: function() {
        return {
            timingsReady: false,
        }
    },
    computed: {
        ...mapGetters('videoPresentation', {
            currentVideo: 'getCurrentVideo',
            videoTimings: 'getVideoTimings',
        }),
    },
    methods: {
        ...mapActions('videoPresentation', ['initTimings']),
    },
    async created() {
        await this.initTimings(this.videoTimings)
        this.timingsReady = true
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
