<template>
    <div class="timeline-controls">
        <div class="main">
            <div class="left">
                <div class="button-list">
                    <button class="invisible white circle ghost-hover" @click="togglePlaying">
                        <i class="fas" :class="desiredStatus == 'playing' ? 'fa-pause' : 'fa-play'"></i>
                    </button>
                    <button class="invisible white circle  ghost-hover" @click="togglePlayerMuted()">
                        <i class="fas" :class="isMuted ? 'fa-volume-mute' : 'fa-volume'"></i>
                    </button>
                </div>

                <div class="time" style="margin-left: 40px;">
                    <span>{{ timestamp | timestampify }} / {{ duration | timestampify }}</span>
                </div>
            </div>
            <div class="right">
                <button class="invisible ghost-hover white" @click="onToggleZoom">
                    <span>Zoom: {{ zoom }}x</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    name: 'timelineControls',
    computed: {
        ...mapGetters('videoPlayer', {
            isMuted: 'getIsMuted',
            timestamp: 'getTimestamp',
            duration: 'getDuration',
            desiredStatus: 'getDesiredStatus',
        }),
        ...mapGetters('videoPresentation', {
            zoom: 'getTimelineZoom',
            timings: 'getVideoTimings',
            zoomLevels: 'getZoomLevels',
        }),
    },
    methods: {
        ...mapActions('videoPlayer', ['togglePlayerMuted', 'togglePlaying']),
        ...mapMutations('videoPresentation', ['SET_TIMELINE_ZOOM']),
        onToggleZoom() {
            const zoomLevels = this.zoomLevels
            const index = zoomLevels.findIndex(x => x == this.zoom)
            let newIndex = index + 1
            if (newIndex >= zoomLevels.length) newIndex = 0
            this.SET_TIMELINE_ZOOM(zoomLevels[newIndex])
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.timeline-controls {
    background: #000000;
    background: $dark;
    height: $heightPreviewPlayerControls;
    width: 100%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    color: white;
    .main {
        display: flex;
        align-items: center;
        padding: 0 20px;
        flex: 1;
        > * {
            display: flex;
            align-items: center;
            &:not(.middle) {
                flex: 1;
            }
        }
        .right {
            justify-content: flex-end;
        }
    }
}
.pill span {
    font-weight: 700;
}
.price-list {
    display: flex;
    justify-content: space-between;
    margin-top: -12px;
    width: 100%;
    .price-list-item {
        margin-left: auto;
    }
    label {
        font-size: 12px;
        font-weight: 500;
        display: block;
        margin-bottom: 4px;
        margin-left: 7px;
    }
    .pill {
        width: 112px;
        text-align: left;
        justify-content: flex-start;
    }
}
</style>
