<template>
    <div class="ended-overlay">
        <div class="inner flex-list flex-v md">
            <h3>Thanks for watching</h3>
            <button class="primary lg full-width" @click="$emit('view-cart-ins')">
                <i class="far fa-heart"></i>
                <span>View saved styles</span>
            </button>
            <button class="white lg ghost full-width" @click="onReplayVideo">
                <i class="far fa-play"></i>
                <span>Replay video</span>
            </button>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'endedOverlay',
    methods: {
        ...mapActions('videoPlayer', ['togglePlaying', 'seekTo']),
        onReplayVideo() {
            this.seekTo(0)
            this.togglePlaying()
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.ended-overlay {
    position: absolute;
    left: 0;
    top: 0;
    background: #1c293b;
    width: 100%;
    height: calc(100vh - #{$heightPlayerControls});
    padding-bottom: $heightPauseOverlay;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
    .inner {
        width: 300px;
        text-align: center;
        pointer-events: all;
    }
    h3 {
        color: white;
    }
}
</style>
