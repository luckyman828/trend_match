<template>
    <div class="timeline-panel">
        <TimelineControls />
        <div class="timeline-area">
            <div class="rail-wrapper">
                <div class="rail" v-horizontal-scroll ref="rail" v-on:wheel.alt="onZoomWheel">
                    <div class="timeline-wrapper">
                        <div class="interval-wrapper">
                            <div class="timeline-interval-markers" :style="timelineStyle">
                                <div
                                    class="interval-mark"
                                    v-for="(interval, index) in timelineIntervals"
                                    :key="index"
                                    :style="intervalMarkStyle"
                                >
                                    <span class="interval-number">{{ interval.timestamp | timestampify }}</span>
                                    <div class="sub-marks" :style="intervalSubmarkStyle"></div>
                                </div>
                                <!-- <div class="interval-sub-markers" :style="intervalSubmarkStyle"></div> -->
                            </div>
                        </div>
                        <div class="timeline" ref="timeline" :style="timelineStyle">
                            <div class="timeline-cursor" ref="timelineCursor" :style="cursorStyle">
                                <div class="cursor-time">{{ cursorTimestamp | timestampify }}</div>
                            </div>
                            <div class="cut-off">
                                <TimelineItem
                                    v-for="(timing, index) in videoTimings"
                                    :key="timing.id"
                                    :timing="timing"
                                    :index="index"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import TimelineItem from './TimelineItem'
import Draggable from 'vuedraggable'
import TimelineControls from './TimelineControls'

export default {
    name: 'timelinePanel',
    components: {
        TimelineItem,
        Draggable,
        TimelineControls,
    },
    data: function() {
        return {
            dragStartPos: null,
            draggedTiming: null,
            draggedEl: null,
            isDragging: false,
            draggedElStartX: null,
            draggedElWidth: null,
            newDragPosValid: true,
            draggedElEndDist: null,
            timelineClickOrigin: false,
        }
    },
    computed: {
        ...mapGetters('videoPresentation', {
            getVideoTimings: 'getVideoTimings',
            zoom: 'getTimelineZoom',
            timelineRail: 'getTimelineRail',
            snapThreshold: 'getSnapThreshold',
            zoomLevels: 'getZoomLevels',
        }),
        ...mapGetters('videoPlayer', {
            playerIframe: 'getIframe',
            videoDuration: 'getDuration',
            playerTimestamp: 'getTimestamp',
        }),
        videoTimings: {
            get() {
                return this.getVideoTimings
            },
            set(value) {
                this.SET_VIDEO_TIMINGS(value)
            },
        },
        cursorTimestamp() {
            return this.playerTimestamp
        },
        cursorStyle() {
            const percX = (this.cursorTimestamp / this.videoDuration) * 100
            return {
                left: `${percX}%`,
            }
        },
        timelineIntervals() {
            // const intervalCount = 12 * this.zoom // Decide how many intervals we want
            // const intervalDuration = this.videoDuration / intervalCount // seconds between start of each line
            // // Make sure the intervalduration is a whole number divisible by four
            // const divisibleByInt = Math.max(4 / this.zoom, 4 / this.zoom)
            // const flooredDuration = Math.floor(intervalDuration / divisibleByInt) * divisibleByInt
            const intervalArray = []
            const desiredCount = 12 * this.zoom
            const minDuration = 1
            const intervalDuration = Math.max(Math.floor(this.videoDuration / desiredCount / 2) * 2, minDuration)
            const intervalCount = Math.floor(this.videoDuration / intervalDuration)
            for (let i = 0; i < intervalCount + 1; i++) {
                intervalArray.push({ timestamp: intervalDuration * i, duration: intervalDuration })
            }
            return intervalArray
        },
        timelineStyle() {
            return {
                width: `${100 * this.zoom}%`,
            }
        },
        intervalMarkStyle() {
            const duration = this.timelineIntervals[0].duration
            const widthPercent = (duration / this.videoDuration) * 100
            const widthToUse = duration > 0 ? widthPercent : 100 / this.timelineIntervals.length

            return {
                width: `${widthToUse}%`,
                minWidth: `${widthToUse}%`,
            }
        },
        intervalSubmarkStyle() {
            const lineThickness = 1
            const distPerc = 25
            const lineColor = '#425e80'
            return {
                background: `repeating-linear-gradient(90deg, transparent, transparent ${distPerc}%, ${lineColor} ${distPerc}%, ${lineColor} calc(${distPerc}% + ${lineThickness}px))`,
            }
        },
    },
    methods: {
        ...mapMutations('videoPresentation', [
            'SET_VIDEO_TIMINGS',
            'ADD_TIMING',
            'SET_TIMELINE_RAIL',
            'SET_TIMELINE_EL',
            'SET_TIMELINE_ZOOM',
        ]),
        ...mapActions('videoPresentation', ['addTiming', 'getTimestampFromMouseEvent', 'updateCurrentVideo']),
        ...mapActions('videoPlayer', ['seekTo']),
        onZoomWheel(e) {
            const zoomLevels = this.zoomLevels
            const zoomIndex = zoomLevels.findIndex(x => x == this.zoom)
            const oldZoom = this.zoom
            const zoomIn = e.deltaY < 0
            if ((zoomIn && zoomIndex >= zoomLevels.length - 1) || (!zoomIn && zoomIndex <= 0)) return
            const newZoom = zoomIn ? zoomLevels[zoomIndex + 1] : zoomLevels[zoomIndex - 1]

            const railEl = this.timelineRail
            const railRect = railEl.getBoundingClientRect()
            const railScrollX = railEl.scrollLeft
            const zoomRatio = newZoom / oldZoom

            const mouseX = e.clientX - railRect.left // the target to keep in the same spot
            const newScrollX = zoomRatio * (railScrollX + mouseX) - mouseX

            this.SET_TIMELINE_ZOOM(newZoom)

            this.$nextTick(() => {
                railEl.scroll(newScrollX, 0)
            })
        },
    },
    mounted() {
        this.SET_TIMELINE_RAIL(this.$refs.rail)
        this.SET_TIMELINE_EL(this.$refs.timeline)
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.timeline-panel {
    grid-area: timeline;
    display: flex;
    flex-direction: column;
    background: $dark;
    overflow: hidden;
    .timeline-area {
        padding: 0 16px;
        height: 100%;
    }
    .rail-wrapper {
        border-radius: 8px 8px 0 0;
        background: $dark100;
        height: 100%;
        padding: 0 0 8px;
    }
    .rail {
        overflow-x: scroll;
        overflow-y: hidden;
        position: relative;
        height: 100%;
        &::-webkit-scrollbar-track {
            background: $dark100;
        }
        &::-webkit-scrollbar-thumb {
            background: white;
            &:hover {
                background: $grey700;
            }
        }
    }
    .timeline-wrapper {
        height: 100%;
        padding: 0 16px;
    }
    .interval-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        height: calc(100% - 8px - 36px);
        margin-top: 36px;
        width: 100%;
        pointer-events: none;
        padding: 0 16px 0;
    }
    .timeline-interval-markers {
        height: 100%;
        width: 100%;
        display: flex;
        overflow: hidden;
        padding-left: 6px;
        margin-left: -6px;
        .interval-mark {
            color: white;
            border-left: solid $grey800 1px;
            height: 100%;
            position: relative;
            font-size: 10px;
            z-index: 1;
            margin-top: 12px;
            &:last-child {
                .interval-number {
                    display: none;
                }
            }
            .interval-number {
                position: absolute;
                left: 0;
                top: -16px;
                transform: translateX(-50%);
            }
            .sub-marks {
                height: calc(100% - 32px);
                width: 100%;
                margin-bottom: 16px;
            }
        }
    }
    .timeline {
        flex: 1;
        position: relative;
        align-items: center;
        height: 100%;
        display: flex;
        padding: 16px 0 0;
        z-index: 1;
        .cut-off {
            overflow: hidden;
            width: 100%;
            display: flex;
            pointer-events: none;
            height: 100%;
            align-items: center;
        }
        &::after {
            content: '';
            display: block;
            position: absolute;
            width: 16px;
            right: -16px;
            height: 1px;
        }
        .timeline-cursor {
            position: absolute;
            height: calc(100% - 8px);
            width: 2px;
            background: $primary;
            left: 0;
            top: 8px;
            transition: 0.05s;
            z-index: 1;
            .cursor-time {
                position: absolute;
                top: 0;
                left: 0;
                transform: translateX(-50%);
                background: $primary;
                color: white;
                line-height: 1;
                font-size: 10px;
                padding: 2px 4px;
            }
        }
        .draggable {
            width: 100%;
            height: 100%;
            display: flex;
            position: relative;
            pointer-events: none;
        }
    }
}
</style>
