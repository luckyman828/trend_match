<template>
    <div class="timeline-item" :style="style">
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
            zoom: 'getTimelineZoom',
            playerIframe: 'getIframe',
            videoDuration: 'getDuration',
        }),
        product() {
            return this.timing.product
        },
        style() {
            const width = (this.timing.duration / this.videoDuration) * 100 * this.zoom
            const start = (this.timing.start / this.videoDuration) * 100 * this.zoom
            const end = (1 - this.timing.end / this.videoDuration) * 100 * this.zoom
            return {
                left: `${start}%`,
                right: `${end}%`,
                // marginLeft: `${left}%`,
                // width: `${width}%`,
                // minWidth: `${width}%`,
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
            const offset = this.dragMode == 'end' ? -4 : 4
            const mouseX = e.clientX - playerRect.left + offset

            // Find the percent X we are along the timeline
            const xPercent = mouseX / playerWidth

            // Get the corresponding timestamp
            const timestamp = this.videoDuration * xPercent

            this.timing[this.dragMode] = timestamp
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
    position: absolute;
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
