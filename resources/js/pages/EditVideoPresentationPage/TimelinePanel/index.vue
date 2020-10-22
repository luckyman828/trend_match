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
                        <div
                            class="timeline"
                            ref="timeline"
                            :style="timelineStyle"
                            @mousedown.self="onTimelineMousedown"
                            @mouseup.self="onTimelineMouseup"
                        >
                            <div class="timeline-cursor" ref="timelineCursor" :style="cursorStyle">
                                <div class="cursor-time">{{ cursorTimestamp | timestampify }}</div>
                            </div>
                            <TimelineItem
                                v-for="(timing, index) in videoTimings"
                                :class="[
                                    { dragged: isDragging && draggedTiming && draggedTiming.id == timing.id },
                                    {
                                        error:
                                            isDragging &&
                                            draggedTiming &&
                                            draggedTiming.id == timing.id &&
                                            !newDragPosValid,
                                    },
                                ]"
                                :key="timing.id"
                                :timing="timing"
                                :index="index"
                                :dragActive="isDragging && draggedTiming && draggedTiming.id == timing.id"
                                @mousedown.native="onDragStart($event, timing)"
                            />
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
            timelineEl: 'getTimelineEl',
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
        onTimelineMousedown(e) {
            this.timelineClickOrigin = true
        },
        onTimelineMouseup(e) {
            if (this.timelineClickOrigin) {
                this.setCursorPosition(e)
            }
            this.timelineClickOrigin = false
        },
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
        onDragStart(e, timing) {
            // Check that we have not clicked the cap drag handles
            if (e.target.classList.contains('drag-cap-handle')) return
            // Save a reference to the dragged timing
            this.draggedEl = document.getElementById(`timeline-item-${timing.id}`)
            // this.draggedElEndX =
            this.draggedTiming = timing
            // Add a dragstart threshold
            this.dragStartPos = { x: e.clientX, y: e.clientY }
            // Remove old drag listeners
            this.removeDragListeners()
            // Add new
            this.addDragListeners()
        },
        onDragMove(e) {
            // Check if we have moved the mouse further can our threshold
            if (!this.isDragging) {
                const dragThreshold = 10
                const deltaX = Math.abs(this.dragStartPos.x - e.clientX)
                const deltaY = Math.abs(this.dragStartPos.y - e.clientY)
                const movedDist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
                if (movedDist >= dragThreshold) {
                    this.isDragging = true
                    const elRect = this.draggedEl.getBoundingClientRect()
                    this.draggedElStartX = elRect.left + (e.clientX - elRect.left)
                    this.draggedElWidth = elRect.width
                    this.draggedElEndDist = elRect.right - e.clientX
                }
                return
            }

            // Get the timestamp that our new mousePos corresponds to
            // We will use the new timestamp to limit the movement of the dragged element
            // And to check the validity of the new pos

            // Get original mouseclick position data to get the actual end and start of our element
            const distToEnd = this.draggedElEndDist
            const distToStart = this.draggedElWidth - distToEnd

            // Get a reference to the dragged timing
            const timing = this.draggedTiming

            // Get the desired start and end
            const desiredDuration = timing.duration
            let desiredStart = this.getTimestampFromMouseX(e.clientX - distToStart)
            let desiredEnd = desiredStart + desiredDuration

            // Now we have our desired end and start. Position the timing accordingly.
            // This code is used simply to display the new position. We will use the newEnd and newStart to check the validity of the new position
            const startX = this.draggedElStartX
            const deltaX = e.clientX - startX

            // Get the start and end caps of our drag
            const timelineRect = this.timelineEl.getBoundingClientRect()
            const timelineEnd = timelineRect.right
            const timelineStart = timelineRect.left
            const timelineWidth = timelineRect.width

            const deltaXMax = timelineEnd - distToEnd - startX
            const deltaXMin = timelineStart - startX + distToStart
            let deltaXToMove = Math.min(Math.max(deltaX, deltaXMin), deltaXMax)

            // Snap to cursor if within treshold
            const snapThreshold = this.snapThreshold
            const cursorTimestamp = this.cursorTimestamp
            const cursorX = this.$refs.timelineCursor.getBoundingClientRect().left
            // Snap start
            if (desiredStart > cursorTimestamp - snapThreshold && desiredStart < cursorTimestamp + snapThreshold) {
                desiredStart = cursorTimestamp
                desiredEnd = desiredStart + desiredDuration
                deltaXToMove = cursorX - startX + distToStart
            }
            // Snap end
            if (desiredEnd > cursorTimestamp - snapThreshold && desiredEnd < cursorTimestamp + snapThreshold) {
                desiredEnd = cursorTimestamp
                desiredStart = desiredEnd - desiredDuration
                deltaXToMove = cursorX - startX - distToEnd
            }

            // Snap to other timings or report conflicts
            // Check if we have a timing conflict
            // Check for any conflicting timings
            let newPosValid = true

            const conflictThreshold = this.snapThreshold
            const timingConflictList = this.getPosConflicts([timing.id], desiredStart, desiredEnd, conflictThreshold)

            if (timingConflictList.length > 0) {
                const timingConflict = timingConflictList[0]
                // Check if we are within our snap threshold. If so, simply snap. Else report an error
                const snapToEnd =
                    desiredStart < timingConflict.end + conflictThreshold &&
                    desiredStart > timingConflict.end - conflictThreshold
                const snapToStart =
                    desiredEnd > timingConflict.start - conflictThreshold &&
                    desiredEnd < timingConflict.start + conflictThreshold

                if (!snapToEnd && !snapToStart) {
                    newPosValid = false
                } else {
                    const conflictEl = timingConflict && document.getElementById(`timeline-item-${timingConflict.id}`)
                    const conflictRect = conflictEl.getBoundingClientRect()
                    const conflictStartX = timingConflict && conflictRect.left
                    const conflictEndX = timingConflict && conflictRect.right
                    if (snapToEnd) {
                        deltaXToMove = conflictEndX - startX + distToStart
                    } else {
                        deltaXToMove = conflictStartX - startX - distToEnd
                    }

                    // Check if there is still any issues after we have snapped
                    const newStart = this.getTimestampFromMouseX(e.clientX - distToStart)
                    const newEnd = newStart + desiredDuration
                    const newConflicts = this.getPosConflicts([timing.id, timingConflict.id], newStart, newEnd, 0)
                    if (newConflicts.length > 0) newPosValid = false
                }
            }
            this.newDragPosValid = newPosValid

            deltaXToMove = Math.min(Math.max(deltaXToMove, deltaXMin), deltaXMax)

            // Set the transform of the dragged element
            this.draggedEl.style.transform = `translateX(${deltaXToMove}px)`
        },
        getPosConflicts(idsToIgnore = [], desiredStart, desiredEnd, threshold = 0) {
            const conflicts = this.videoTimings.filter(
                x =>
                    !idsToIgnore.includes(x.id) &&
                    ((desiredStart < x.end + threshold && desiredEnd > x.start) ||
                        (desiredEnd > x.start - threshold && desiredStart < x.end))
            )
            return conflicts
        },
        onDragEnd(e) {
            if (this.newDragPosValid) this.saveNewPosition()
            // Remove the transform from the dragged element
            this.draggedEl.style.transform = ''
            // Reset our drag variables
            this.isDragging = false
            this.draggedEl = null
            this.draggedTiming = null
            this.draggedStartPos = null
            this.removeDragListeners()
        },
        saveNewPosition() {
            const elLeftX = this.draggedEl.getBoundingClientRect().left
            const newStart = this.getTimestampFromMouseX(elLeftX)

            // Set the new start and end of the dragged timing
            const timing = this.draggedTiming
            const desiredDuration = timing.duration
            timing.start = Math.max(0, newStart)
            timing.end = Math.min(this.videoDuration, timing.start + desiredDuration)

            // Sort timings by start time after change
            this.videoTimings.sort((a, b) => {
                return a.start > b.start ? 1 : -1
            })

            // Save the change to the API
            this.updateCurrentVideo()
        },
        getTimestampFromMouseX(mouseX) {
            // Get timestamp that corresponds to the drag position
            const railRect = this.$refs.rail.getBoundingClientRect()
            const timelineRail = this.timelineRail
            const railPadding = 16

            // Get the adjusted X position on the timeline
            const adjustedX = mouseX - railRect.left + timelineRail.scrollLeft - railPadding

            // Get the percentage of the total video duration
            const durationPerc = adjustedX / (railRect.width - 2 * railPadding) / this.zoom
            const mouseTimestamp = this.videoDuration * durationPerc
            return mouseTimestamp
        },
        addDragListeners() {
            document.addEventListener('mouseup', this.onDragEnd)
            document.addEventListener('mousemove', this.onDragMove)
            document.body.addEventListener('mouseleave', this.onDragEnd)
        },
        removeDragListeners() {
            document.removeEventListener('mouseup', this.onDragEnd)
            document.removeEventListener('mousemove', this.onDragMove)
            document.body.removeEventListener('mouseleave', this.onDragEnd)
        },
        setCursorPosition(e) {
            // Set cursor position as a timestamp
            const railRect = this.$refs.rail.getBoundingClientRect()
            const railPadding = 16
            const scrollX = this.$refs.rail.scrollLeft
            const adjustedX = e.clientX - railRect.left + scrollX - railPadding
            const percX = ((adjustedX / (railRect.width - 2 * railPadding)) * 100) / this.zoom
            const timestamp = this.videoDuration * (percX / 100)
            this.seekTo(timestamp)
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
