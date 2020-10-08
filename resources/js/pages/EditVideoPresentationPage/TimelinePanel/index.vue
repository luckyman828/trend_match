<template>
    <div class="timeline-panel">
        <TimelineControls />
        <div class="rail" v-horizontal-scroll ref="rail">
            <div class="timeline" ref="timeline" :style="timelineStyle" @click="setCursorPosition">
                <div class="timeline-cursor" ref="timelineCursor" :style="cursorStyle" />
                <Draggable
                    class="draggable"
                    v-model="videoTimings"
                    handle=".inner"
                    tag="div"
                    :forceFallback="true"
                    group="videoTimings"
                    draggable=".timeline-item"
                    fallbackClass="sortable-drag"
                    :fallbackTolerance="10"
                    @add="onAdd"
                    @sort="onSort"
                >
                    <TimelineItem
                        v-for="(productTiming, index) in videoTimings"
                        :key="productTiming.id"
                        :timing="productTiming"
                        :index="index"
                    />
                </Draggable>
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
    computed: {
        ...mapGetters('videoPresentation', {
            getVideoTimings: 'getVideoTimings',
            timingClone: 'getTimingClone',
            cursorPosition: 'getCursorPosition',
            zoom: 'getTimelineZoom',
        }),
        ...mapGetters('videoPlayer', {
            playerIframe: 'getIframe',
            videoDuration: 'getDuration',
        }),
        videoTimings: {
            get() {
                return this.getVideoTimings
            },
            set(value) {
                this.SET_VIDEO_TIMINGS(value)
            },
        },
        cursorStyle() {
            const percX = (this.cursorPosition / this.videoDuration) * 100
            return {
                left: `${percX}%`,
            }
        },
        timelineStyle() {
            const interval = 4 // seconds between start of each line
            const lineThickness = 2
            const distPerc = (interval / this.videoDuration) * 100
            const lineColor = '#445f7b'
            return {
                background: `repeating-linear-gradient(90deg, transparent, transparent ${distPerc}%, ${lineColor} ${distPerc}px, ${lineColor} calc(${distPerc}% + ${lineThickness}px))`,
                width: `${100 * this.zoom}%`,
            }
        },
    },
    methods: {
        ...mapMutations('videoPresentation', ['SET_VIDEO_TIMINGS', 'ADD_TIMING', 'SET_CURSOR_POSITION']),
        ...mapActions('videoPresentation', ['addTiming']),
        onAdd(e) {
            const newIndex = e.newIndex
            const newTiming = this.timingClone
            this.addTiming({ newTiming, index: newIndex })
        },
        onSort(e) {
            const triggeredByTimingAdd = e.from.classList.contains('product-result')
            if (triggeredByTimingAdd) return
            const newIndex = Math.min(e.newIndex, this.videoTimings.length - 1)
            const oldIndex = e.oldIndex
            const movedTiming = this.videoTimings[newIndex]
            console.log('on sort', movedTiming, oldIndex, newIndex)

            if (newIndex > oldIndex) {
                const timingsBefore = this.videoTimings.slice(oldIndex, newIndex)
                timingsBefore.map(timing => {
                    timing.start -= movedTiming.duration
                })
            }

            if (newIndex < oldIndex) {
                const timingsAfter = this.videoTimings.slice(newIndex)
                timingsAfter.map(timing => {
                    timing.start += movedTiming.duration
                })
            }

            if (newIndex > 0) {
                movedTiming.start = this.videoTimings[newIndex - 1].end
            } else {
                movedTiming.start = 0
            }
        },
        setCursorPosition(e) {
            // Set cursor position as a timestamp
            const playerRect = this.playerIframe.getBoundingClientRect()
            const scrollX = this.$refs.rail.scrollLeft
            const adjustedX = e.clientX - playerRect.left + scrollX
            console.log('set cursor pos', this.$refs.rail)
            const percX = ((adjustedX / playerRect.width) * 100) / this.zoom
            const timestamp = this.videoDuration * (percX / 100)
            this.SET_CURSOR_POSITION(timestamp)
        },
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
    .rail {
        overflow-x: auto;
        height: 100%;
    }
    .timeline {
        flex: 1;
        border-top: $borderModule;
        box-shadow: $shadowModule;
        position: relative;
        padding: 16px 0 24px;
        height: 100%;
        .timeline-cursor {
            position: absolute;
            height: 100%;
            width: 2px;
            background: $primary;
            left: 0;
            top: 0;
        }
        .draggable {
            width: 100%;
            height: 100%;
            display: flex;
            position: relative;
        }
    }
}
</style>
