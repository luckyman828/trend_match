<template>
    <div
        class="before-start-overlay"
        :style="presentation.thumbnail && `background-image: url(${presentation.thumbnail})`"
    >
        <div class="overlay"></div>
        <button class="xxl circle bg-blur" @click="onPlay">
            <i class="fas fa-play"></i>
        </button>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'beforeStartOverlay',
    computed: {
        ...mapGetters('playPresentation', {
            presentation: 'getPresentation',
        }),
    },
    methods: {
        ...mapActions('player', ['play']),
        onPlay() {
            this.play()
        },
    },
}
</script>

<style lang="scss" scoped>
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
