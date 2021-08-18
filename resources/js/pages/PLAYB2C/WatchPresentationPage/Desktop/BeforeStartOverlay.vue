<template>
    <div class="before-start-overlay" :style="video.thumbnail && `background-image: url(${video.thumbnail})`">
        <div class="overlay"></div>

        <BaseLoader msg="Starting..!" v-if="desiredStatus == 'playing'" />
        <button v-else class="xxl circle bg-blur" @click="play">
            <i class="fas fa-play"></i>
        </button>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'beforeStartOverlay',
    props: ['video'],
    computed: {
        ...mapGetters('player', {
            desiredStatus: 'getDesiredStatus',
        }),
    },
    methods: {
        ...mapActions('player', ['play']),
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.before-start-overlay {
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
        border: none;
        width: 72px;
        height: 72px;
        position: relative;
        overflow: hidden;
        i {
            color: white;
            margin-left: 6px;
        }
        // &::before {
        //     content: '';
        //     display: block;
        //     background: rgba(black, 0.6);
        //     backdrop-filter: blur(5px);
        //     position: absolute;
        //     left: 0;
        //     top: 0;
        //     height: 100%;
        //     width: 100%;
        // }
    }
}
</style>
