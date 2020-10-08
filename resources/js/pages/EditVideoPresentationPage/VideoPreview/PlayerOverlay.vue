<template>
    <div class="player-overlay" :class="{ paused: playerStatus == 'paused' }">
        <div class="over-player" @click="onTogglePlay" />
        <VideoTimeline />
        <!-- <PlayerControls /> -->
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PlayerControls from './PlayerControls'
import VideoTimeline from './VideoTimeline'

export default {
    name: 'playerOverlay',
    components: {
        PlayerControls,
        VideoTimeline,
    },
    computed: {
        ...mapGetters('videoPlayer', {
            playerStatus: 'getStatus',
            player: 'getPlayer',
            iframe: 'getIframe',
            isPlaying: 'getIsPlaying',
        }),
    },
    methods: {
        ...mapActions('videoPlayer', ['togglePlaying']),
        async onTogglePlay() {
            this.togglePlaying()
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.player-overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    // overflow: hidden;
    .over-player {
        flex: 1;
    }
    &.paused {
        .over-player {
            z-index: -1;
            background: rgba(black, 0.4);
        }
    }
}
</style>
