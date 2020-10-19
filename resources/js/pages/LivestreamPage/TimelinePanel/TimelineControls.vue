<template>
    <div class="timeline-controls">
        <div class="main">
            <div class="left">
                <div class="button-list">
                    <button class="invisible white circle ghost-hover" @click="toggleRecording">
                        <i class="fas fa-circle" :class="isRecording ? 'red' : ''"></i>
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
    data: function() {
        return {
            desiredStatus: 'ready',
            isRecording: false,
            intervalTimer: null,
        }
    },
    computed: {
        ...mapGetters('videoPlayer', {
            isMuted: 'getIsMuted',
            timestamp: 'getTimestamp',
            duration: 'getDuration',
            currentTiming: 'getCurrentTiming',
        }),
        ...mapGetters('videoPresentation', {
            zoom: 'getTimelineZoom',
            timings: 'getVideoTimings',
            zoomLevels: 'getZoomLevels',
            timelineRail: 'getTimelineRail',
        }),
    },
    methods: {
        ...mapActions('videoPlayer', ['togglePlayerMuted', 'togglePlaying']),
        ...mapMutations('videoPresentation', ['SET_TIMELINE_ZOOM']),
        ...mapMutations('videoPlayer', ['SET_PLAYER_DURATION', 'SET_CURRENT_PLAYER_TIMESTAMP']),
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
        toggleRecording() {
            if (this.isRecording) {
                this.onStopRecording()
            } else {
                this.onStartRecording()
            }
        },
        onStartRecording() {
            this.isRecording = true
            const interval = 100
            this.intervalTimer = setInterval(() => {
                const newTimestamp = this.duration + interval / 1000
                this.SET_PLAYER_DURATION(newTimestamp)
                const currentTiming = this.currentTiming
                if (currentTiming) {
                    currentTiming.end = newTimestamp + 0.001
                }
                this.SET_CURRENT_PLAYER_TIMESTAMP(newTimestamp)
            }, interval)
        },
        onStopRecording() {
            this.isRecording = false
            clearInterval(this.intervalTimer)
            // Set the end of the current timing if any
            if (this.currentTiming) {
                this.currentTiming.end = this.duration + 0.001
            }
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
