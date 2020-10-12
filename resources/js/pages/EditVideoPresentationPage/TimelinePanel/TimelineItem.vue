<template>
    <div
        class="timeline-item"
        :style="style"
        :id="`timeline-item-${timing.id}`"
        :class="[{ current: isCurrent }, { 'drag-caps': isDragging }]"
        tabindex="0"
    >
        <div class="controls">
            <button class="pill red sm" @click="onRemoveTiming">
                <span>Delete</span>
                <i class="far fa-trash"></i>
            </button>
        </div>
        <div class="edge-drag-controls">
            <img
                src="/assets/cursors/arrow-to-right-regular.svg"
                ref="cursor-right"
                class="cursor-icon-right cursor-icon"
            />
            <img
                src="/assets/cursors/arrow-to-left-regular.svg"
                ref="cursor-left"
                class="cursor-icon-left cursor-icon"
            />
            <div
                class="drag-left drag-cap-handle"
                @mousedown="onDragCapStart($event, 'start')"
                @mousemove="onMouseMoveCap($event, 'left')"
                @mouseleave="onMouseLeaveCap($event, 'left')"
            ></div>
            <div
                class="drag-right drag-cap-handle"
                @mousedown="onDragCapStart($event, 'end')"
                @mousemove="onMouseMoveCap($event, 'right')"
                @mouseleave="onMouseLeaveCap($event, 'right')"
            ></div>
        </div>
        <div class="inner">
            <div class="img-wrapper">
                <div class="img-sizer">
                    <BaseVariantImage :variant="product.variants[0]" size="sm" />
                </div>
            </div>
            <div class="details">
                <span class="name">
                    {{ product.title }}
                </span>
                <div class="time">
                    <span class="start">{{ timing.start | timestampify }}</span>
                    <span class="end">{{ timing.end | timestampify }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'timelineItem',
    props: ['timing', 'index', 'dragActive', 'isDragged'],
    data: function() {
        return {
            isDragging: false,
            dragMode: null,
        }
    },
    computed: {
        ...mapGetters('videoPlayer', {
            playerIframe: 'getIframe',
            videoDuration: 'getDuration',
            cursorTimestamp: 'getTimestamp',
            currentTiming: 'getCurrentTiming',
        }),
        ...mapGetters('videoPresentation', {
            zoom: 'getTimelineZoom',
            rail: 'getTimelineRail',
            snapThreshold: 'getSnapThreshold',
        }),
        product() {
            return this.timing.product
        },
        style() {
            const width = (this.timing.duration / this.videoDuration) * 100
            const start = (this.timing.start / this.videoDuration) * 100
            const end = (1 - this.timing.end / this.videoDuration) * 100
            const prevEnd = this.timing.prevTiming ? (this.timing.prevTiming.end / this.videoDuration) * 100 : 0
            return {
                // left: `${start}%`,
                // right: `${end}%`,
                width: `${width}%`,
                minWidth: `${width}%`,
                maxWidth: `${width}%`,
                marginLeft: `${start - prevEnd}%`,
            }
        },
        isCurrent() {
            return this.currentTiming && this.currentTiming.id == this.timing.id
        },
    },
    methods: {
        ...mapActions('videoPresentation', ['removeTiming']),
        onRemoveTiming() {
            this.removeTiming(this.index)
        },
        onMouseMoveCap(e, direction) {
            if (this.$el.classList.contains('dragged')) return
            const cursor = this.$refs[`cursor-${direction}`]
            const offset = direction == 'right' ? -12 : 0
            cursor.style.display = 'Block'
            cursor.style.left = `${e.clientX + offset}px`
            cursor.style.top = `${e.clientY}px`
        },
        onMouseLeaveCap(e, direction) {
            if (this.$el.classList.contains('dragged')) return
            const cursor = this.$refs[`cursor-${direction}`]
            cursor.style.display = 'None'
        },
        onDragCapStart(e, dragMode) {
            // Remove any previous drag listener - just in case
            this.removeDragListeners()
            this.isDragging = true
            this.dragMode = dragMode
            this.addDragListeners()
        },
        onDragMove(e) {
            const playerRect = this.playerIframe.getBoundingClientRect()
            const elRect = this.$el.getBoundingClientRect()

            const width = elRect.width
            const left = elRect.left

            const playerWidth = playerRect.width
            const offset = this.dragMode == 'end' ? 12 : -12
            const scrollX = this.rail.scrollLeft
            const mouseX = e.clientX - playerRect.left + offset + scrollX

            // Find the percent X we are along the timeline
            const xPercent = mouseX / playerWidth / this.zoom

            // Get the corresponding timestamp
            const timestamp = this.videoDuration * xPercent

            // Make sure the start is before the end
            const minDuration = 2
            const snapThreshold = this.snapThreshold // In seconds

            if (this.dragMode == 'end') {
                const maxCap = this.timing.nextTiming ? this.timing.nextTiming.start : this.videoDuration
                // Cap the end at the start of the next element
                let newEnd = Math.min(Math.max(timestamp, minDuration, this.timing.start + minDuration), maxCap)
                // Check if the new end is close to the cursor. If so snap to it
                if (newEnd < this.cursorTimestamp + snapThreshold && newEnd > this.cursorTimestamp - snapThreshold) {
                    newEnd = this.cursorTimestamp
                }
                // If we are close to another timing. Snap to its start
                const next = this.timing.nextTiming
                if (next && newEnd + snapThreshold > next.start) {
                    newEnd = next.start
                }
                this.timing.end = newEnd
                // this.timing.start = Math.max(Math.min(this.timing.start, timestamp - minDuration), 0)
            } else {
                const minCap = this.timing.prevTiming ? this.timing.prevTiming.end : 0
                let newStart = Math.max(Math.min(timestamp, this.timing.end - minDuration), minCap)
                // Check if the new start is close to the cursor. If so snap to it
                if (
                    newStart < this.cursorTimestamp + snapThreshold &&
                    newStart > this.cursorTimestamp - snapThreshold
                ) {
                    newStart = this.cursorTimestamp
                }
                // If we are close to another timing. Snap to its end
                const prev = this.timing.prevTiming
                if (prev && newStart - snapThreshold < prev.end) {
                    newStart = prev.end
                }
                this.timing.start = newStart
                // this.timing.end = Math.min(Math.max(this.timing.end, timestamp + minDuration), this.videoDuration)
            }
        },
        onDragEnd() {
            this.removeDragListeners()
            this.isDragging = false

            // Save the new duration / start
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
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.timeline-item {
    background: white;
    border: solid 2px white;
    border-radius: $borderRadiusEl;
    box-shadow: 0 3px 6px rgba(black, 0.2);
    padding: 6px;
    pointer-events: all;
    position: relative; // DON'T CHANGE !! - We need it to be relative for draggable to work
    transition: width 0.05s ease-out;

    // Make not draggable
    user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    .controls {
        position: absolute;
        top: -14px;
        right: 4px;
        display: none;
        transition: 0.1s ease-out;
        z-index: 2;
    }
    &:focus {
        background: $primary;
        color: white;
        border-color: $primary;
        &:not(.dragged):not(.drag-caps) {
            .controls {
                display: block;
            }
        }
    }
    &.current {
        border-color: $primary;
    }
    &.dragged {
        background: $yellow;
        z-index: 1;
    }
    &.error {
        opacity: 0.8;
        background: $red;
    }
    .inner {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        white-space: nowrap;
    }
    .img-wrapper {
        overflow: hidden;
        width: 48px;
        min-width: 48px;
        border: $borderEl;
        border-radius: 50px;
        .img-sizer {
            height: 0;
            padding-top: 100%;
            position: relative;
            img {
                height: 100%;
                width: 100%;
                object-fit: cover;
                position: absolute;
                left: 0;
                top: 0;
                // Make not draggable
                user-drag: none;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-drag: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }
        }
    }
    .details {
        display: flex;
        flex-direction: column;
        margin-left: 4px;
        justify-content: space-between;
        .name {
            font-size: 14px;
            font-weight: 500;
        }
        .time {
            font-size: 12px;
            .end {
                margin-left: 8px;
            }
        }
    }
    .edge-drag-controls {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 1;
        pointer-events: none;
        .cursor-icon {
            display: none;
            height: 20px;
            width: 20px;
            pointer-events: none;
            position: fixed;
            z-index: 2;
        }
        .drag-left,
        .drag-right {
            position: absolute;
            height: 100%;
            width: 16px;
            pointer-events: all;
            &:hover {
                cursor: none;
                background: rgba(0, 0, 0, 0.2);
            }
        }
        .drag-left {
            left: 0;
        }
        .drag-right {
            right: 0;
        }
    }
}
</style>
