<template>
    <PageLoader>
        <div class="play-home">
            <h1>Library</h1>
            <VideoGrid />
        </div>
    </PageLoader>
</template>

<script>
import VideoGrid from './VideoGrid/'
import PageLoader from '../../../components/common/PageLoader'

export default {
    name: 'playHome',
    components: { VideoGrid, PageLoader },
}
</script>

<style lang="scss" scoped>
.play-home {
}
</style>
