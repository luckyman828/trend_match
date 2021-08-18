<template>
    <div class="timeline-controls">
        <div class="main">
            <div class="left">
                <div class="button-list flex-list">
                    <button class="invisible white circle white-hover" @click="togglePlaying">
                        <i class="fas" :class="desiredStatus == 'playing' ? 'fa-pause' : 'fa-play'"></i>
                    </button>
                    <VolumeControl />
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
import VolumeControl from '../../../../components/PLAY/PresentationPlayer/VolumeControl'

export default {
    name: 'timelineControls',
    components: {
        VolumeControl,
    },
    computed: {
        ...mapGetters('player', {
            isMuted: 'getIsMuted',
            timestamp: 'getTimestamp',
            duration: 'getDuration',
            desiredStatus: 'getDesiredStatus',
        }),
        ...mapGetters('playPresentation', {
            zoom: 'getTimelineZoom',
            timings: 'getTimings',
            zoomLevels: 'getZoomLevels',
            timelineRail: 'getTimelineRail',
        }),
    },
    methods: {
        ...mapActions('player', ['togglePlayerMuted', 'togglePlaying']),
        ...mapMutations('playPresentation', ['SET_TIMELINE_ZOOM']),
        onToggleZoom() {
            const zoomLevels = this.zoomLevels
            const index = zoomLevels.findIndex(x => x == this.zoom)
            let newIndex = index + 1
            if (newIndex >= zoomLevels.length) newIndex = 0
            const newZoom = zoomLevels[newIndex]
            const oldZoom = this.zoom

            const railEl = this.timelineRail
            const railScrollX = railEl.scrollLeft
            const zoomRatio = newZoom / oldZoom
            const offsetX = railEl.getBoundingClientRect().width / 2
            // const newScrollX = zoomRatio * railScrollX
            const newScrollX = zoomRatio * (railScrollX + offsetX) - offsetX

            this.SET_TIMELINE_ZOOM(newZoom)

            this.$nextTick(() => {
                railEl.scroll(newScrollX, 0)
            })
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
