<template>
    <div class="play-home">
        <h1>I am the home of play</h1>
        <VideoGrid />
    </div>
</template>

<script>
import VideoGrid from './VideoGrid/'

export default {
    name: 'playHome',
    components: { VideoGrid },
}
</script>

<style lang="scss" scoped>
.play-home {
    padding: 16px;
}
</style>
