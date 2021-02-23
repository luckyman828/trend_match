<template>
    <div class="video-grid">
        <VideoCard class="video-card" />
        <div class="new-video video-card"></div>
    </div>
</template>

<script>
import VideoCard from './VideoCard'

export default {
    name: 'videoGrid',
    components: { VideoCard },
}
</script>

<style scoped lang="scss">
.video-grid {
    display: flex;
    flex-wrap: wrap;
    .video-card {
    }
}
</style>
