<template>
    <div class="timeline-item" :style="style" :id="`timeline-item-${timing.id}`">
        <div class="controls">
            <button class="red" @click="onRemoveTiming">
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
                class="drag-left"
                @mousedown="onDragStart($event, 'start')"
                @mousemove="onMouseMove($event, 'left')"
                @mouseleave="onMouseLeave($event, 'left')"
            ></div>
            <div
                class="drag-right"
                @mousedown="onDragStart($event, 'end')"
                @mousemove="onMouseMove($event, 'right')"
                @mouseleave="onMouseLeave($event, 'right')"
            ></div>
        </div>
        <div class="inner">
            <span class="name">
                {{ product.title }}
            </span>
            <div class="img-wrapper">
                <BaseVariantImage :variant="product.variants[0]" size="sm" />
            </div>
            <span class="time">
                <BaseEditableSpan
                    :value="timing.startObj.minutes"
                    pattern="^([0-9]|[0-5][0-9])$"
                    maxlength="2"
                    :selectOnFocus="true"
                    >{{ timing.startObj.minutes | rounded }}</BaseEditableSpan
                >
                <span>:</span>
                <BaseEditableSpan
                    :value="timing.startObj.seconds"
                    pattern="^([0-9]|[0-5][0-9])$"
                    maxlength="2"
                    :selectOnFocus="true"
                    >{{ timing.startObj.seconds | rounded }}</BaseEditableSpan
                >
                <span> - </span>
                <BaseEditableSpan
                    :value="timing.endObj.minutes"
                    pattern="^([0-9]|[0-5][0-9])$"
                    maxlength="2"
                    :selectOnFocus="true"
                    >{{ timing.endObj.minutes | rounded }}</BaseEditableSpan
                >
                <span>:</span>
                <BaseEditableSpan
                    :value="timing.endObj.seconds"
                    pattern="^([0-9]|[0-5][0-9])$"
                    maxlength="2"
                    :selectOnFocus="true"
                    >{{ timing.endObj.seconds | rounded }}</BaseEditableSpan
                >
            </span>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'timelineItem',
    props: ['timing', 'index'],
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
        }),
        ...mapGetters('videoPresentation', {
            zoom: 'getTimelineZoom',
            rail: 'getTimelineRail',
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
    },
    methods: {
        ...mapActions('videoPresentation', ['removeTiming']),
        onRemoveTiming() {
            this.removeTiming(this.index)
        },
        onMouseMove(e, direction) {
            const cursor = this.$refs[`cursor-${direction}`]
            const offset = direction == 'right' ? -12 : 0
            cursor.style.display = 'Block'
            cursor.style.left = `${e.clientX + offset}px`
            cursor.style.top = `${e.clientY}px`
        },
        onMouseLeave(e, direction) {
            const cursor = this.$refs[`cursor-${direction}`]
            cursor.style.display = 'None'
        },
        onDragStart(e, dragMode) {
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
            const snapThreshold = 4 // In seconds

            if (this.dragMode == 'end') {
                const maxCap = this.timing.nextTiming ? this.timing.nextTiming.start : this.videoDuration
                // Cap the end at the start of the next element
                let newEnd = Math.min(Math.max(timestamp, minDuration, this.timing.start + minDuration), maxCap)
                // If we are close to another timing. Snap to its start
                const next = this.timing.nextTiming
                if (next && newEnd + snapThreshold > next.start) {
                    newEnd = next.start
                }
                // Check if the new end is close to the cursor. If so snap to it
                if (newEnd < this.cursorTimestamp + snapThreshold && newEnd > this.cursorTimestamp - snapThreshold) {
                    newEnd = this.cursorTimestamp
                }
                this.timing.end = newEnd
                // this.timing.start = Math.max(Math.min(this.timing.start, timestamp - minDuration), 0)
            } else {
                const minCap = this.timing.prevTiming ? this.timing.prevTiming.end : 0
                let newStart = Math.max(Math.min(timestamp, this.timing.end - minDuration), minCap)
                // If we are close to another timing. Snap to its end
                const prev = this.timing.prevTiming
                if (prev && newStart - snapThreshold < prev.end) {
                    newStart = prev.end
                }
                // Check if the new start is close to the cursor. If so snap to it
                if (
                    newStart < this.cursorTimestamp + snapThreshold &&
                    newStart > this.cursorTimestamp - snapThreshold
                ) {
                    newStart = this.cursorTimestamp
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
    height: 100%;
    background: white;
    border-radius: $borderRadiusEl;
    border: $borderElHard;
    box-shadow: $shadowEl;
    overflow: hidden;
    padding: 8px 12px;
    pointer-events: all;
    position: relative; // DON'T CHANGE !! - We need it to be relative for draggable to work

    // Make not draggable
    user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    .controls {
        position: absolute;
        top: 4px;
        right: 4px;
        opacity: 0;
        transition: 0.1 ease-out;
    }
    &:hover {
        .controls {
            opacity: 1;
        }
    }
    .inner {
        width: 100%;
        min-width: 100vw;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    .img-wrapper {
        margin: 4px 0;
        flex: 1;
        overflow: hidden;
        img {
            height: 100%;
            width: 100%;
            object-fit: contain;
            object-position: left;
        }
    }
    .name {
        font-size: 12px;
        font-weight: 500;
    }
    .time {
        font-size: 10px;
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
