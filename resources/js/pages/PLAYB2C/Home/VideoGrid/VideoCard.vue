<template>
    <div
        class="video-card flex-list flex-v min"
        @click="$router.push({ name: 'play.watch', params: { videoId: video.id } })"
    >
        <div class="img-wrapper">
            <img :src="video.thumbnail" />
        </div>
        <div class="details">
            <div class="name">{{ video.name }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'videoCard',
    props: ['video'],
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.video-card {
    overflow: hidden;
    .img-wrapper {
        overflow: hidden;
        flex: 1;
        background: $grey300;
        img {
            overflow: hidden;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .details {
        padding: 12px 16px 20px;
    }
}
</style>
