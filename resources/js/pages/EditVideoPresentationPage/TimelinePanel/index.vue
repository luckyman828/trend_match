<template>
    <div class="timeline-panel">
        <TimelineControls />
        <div class="rail" v-horizontal-scroll ref="rail" v-on:wheel.alt="onZoomWheel">
            <div class="timeline" ref="timeline" :style="timelineStyle" @click.self="setCursorPosition">
                <div class="timeline-cursor" ref="timelineCursor" :style="cursorStyle" />
                <TimelineItem
                    v-for="(timing, index) in videoTimings"
                    :class="[
                        { dragged: draggedTiming && draggedTiming.id == timing.id },
                        { error: draggedTiming && draggedTiming.id == timing.id && !newDragPosValid },
                    ]"
                    :key="timing.id"
                    :timing="timing"
                    :index="index"
                    @mousedown.native="onDragStart($event, timing)"
                />
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
        cursorStyle() {
            const percX = (this.playerTimestamp / this.videoDuration) * 100
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
        ...mapMutations('videoPresentation', [
            'SET_VIDEO_TIMINGS',
            'ADD_TIMING',
            'SET_TIMELINE_RAIL',
            'SET_TIMELINE_EL',
            'SET_TIMELINE_ZOOM',
        ]),
        ...mapActions('videoPresentation', ['addTiming', 'getTimestampFromMouseEvent']),
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
            const desiredStart = this.getTimestampFromMouseX(e.clientX - distToStart)
            const desiredEnd = desiredStart + desiredDuration

            // Now we have our desired end and start. Position the timing accordingly.
            // This code is used simply to display the new position. We will use the newEnd and newStart to check the validity of the new position
            const startX = this.draggedElStartX
            const deltaX = e.clientX - startX

            // Get the start and end caps of our drag
            const timelineEnd = this.timelineEl.getBoundingClientRect().right
            const timelineStart = this.timelineEl.getBoundingClientRect().left

            const deltaXMax = timelineEnd - distToEnd - startX
            const deltaXMin = timelineStart - startX + distToStart
            let deltaXToMove = Math.min(Math.max(deltaX, deltaXMin), deltaXMax)

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
        },
        getTimestampFromMouseX(mouseX) {
            // Get timestamp that corresponds to the drag position
            const playerRect = this.playerIframe.getBoundingClientRect()
            const timelineRail = this.timelineRail

            // Get the adjusted X position on the timeline
            const adjustedX = mouseX - playerRect.left + timelineRail.scrollLeft

            // Get the percentage of the total video duration
            const durationPerc = adjustedX / playerRect.width / this.zoom
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
            const playerRect = this.playerIframe.getBoundingClientRect()
            const scrollX = this.$refs.rail.scrollLeft
            const adjustedX = e.clientX - playerRect.left + scrollX
            const percX = ((adjustedX / playerRect.width) * 100) / this.zoom
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
    .rail {
        overflow-x: scroll;
        height: 100%;
    }
    .timeline {
        flex: 1;
        border-top: $borderModule;
        box-shadow: $shadowModule;
        position: relative;
        padding: 16px 0 20px;
        height: 100%;
        display: flex;
        .timeline-cursor {
            position: absolute;
            height: 100%;
            width: 2px;
            background: $primary;
            left: 0;
            top: 0;
            transition: 0.05s;
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
