<template>
    <div class="player-overlay" :class="playerStatus">
        <div class="over-player flex-list center-h center-v" @click="onTogglePlay">
            <button class="play-button circle white xl mobile-only"><i class="fas fa-play"></i></button>
        </div>
        <div class="custom-overlay">
            <slot />
        </div>
        <VideoTimeline v-if="!hideTimeline && playerReady && videoType != 'live'" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VideoTimeline from './VideoTimeline'

export default {
    name: 'playerOverlay',
    components: {
        VideoTimeline,
    },
    props: ['playerReady', 'hideTimeline'],
    computed: {
        ...mapGetters('videoPlayer', {
            // playerStatus: 'getStatus',
            playerStatus: 'getDesiredStatus',
            player: 'getPlayer',
            iframe: 'getIframe',
            isPlaying: 'getIsPlaying',
            videoType: 'getVideoType',
        }),
    },
    methods: {
        ...mapActions('videoPlayer', ['togglePlaying']),
        async onTogglePlay() {
            if (this.videoType == 'live') return
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
        // z-index: 2;
    }
    &.paused {
        .over-player {
            background: rgba(black, 0.2);
        }
    }
    &.playing {
        .over-player {
            .play-button {
                display: none;
            }
        }
    }
}
</style>
