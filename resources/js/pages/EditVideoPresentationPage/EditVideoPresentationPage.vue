<template>
    <div class="edit-video-presentation">
        <SearchProductsPanel />
        <VideoPreview />
        <TimelinePanel />
    </div>
</template>

<script>
import SearchProductsPanel from './SearchProductsPanel/'
import VideoPreview from './VideoPreview/'
import TimelinePanel from './TimelinePanel/'

export default {
    name: 'editVideoPresentationPage',
    components: {
        SearchProductsPanel,
        VideoPreview,
        TimelinePanel,
    },
}
</script>

<style scoped lang="scss">
.edit-video-presentation {
    display: grid;
    grid-template-columns: 300px auto;
    grid-template-rows: auto 200px;
    grid-template-areas:
        'sidebar main'
        'sidebar timeline';
}
</style>
