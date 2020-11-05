<template>
    <div class="video-viewer">
        <iframe
            :src="`/#/file/${$route.params.fileId}/selection/${$route.params.selectionId}/video/watch/mobile`"
            frameborder="0"
            allowfullscreen="”true”"
            style="height: 100%; width: 100%;"
        ></iframe>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'videoViewer',
}
</script>

<style scoped lang="scss">
.video-viewer {
    height: 100%;
    width: 100%;
}
</style>
