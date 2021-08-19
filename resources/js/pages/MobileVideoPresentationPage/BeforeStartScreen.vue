<template>
    <div class="before-start" :style="video.thumbnail && `background-image: url(${video.thumbnail})`">
        <div class="overlay"></div>
        <button class="xxl circle bg-blur" @click="$emit('start')">
            <i class="far fa-play"></i>
        </button>
    </div>
</template>

<script>
export default {
    name: 'beforeStartScreen',
    props: ['video'],
}
</script>

<style lang="scss" scoped>
.before-start {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    pointer-events: none;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    display: flex;
    background: rgba(black, 0.55);
    color: white;
    pointer-events: all;
    background-size: cover;
    background-position: center;
    .overlay {
        display: block;
        z-index: 0;
        background: rgba(black, 0.5);
    }
    h3 {
        color: white;
    }
    button {
        // background: rgba(black, 0.8);
        // backdrop-filter: blur(5px);
        border: none;
        width: 72px;
        height: 72px;
        i {
            color: white;
            margin-left: 6px;
        }
    }
}
</style>
