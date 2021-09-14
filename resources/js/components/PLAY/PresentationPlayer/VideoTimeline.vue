<template>
    <div class="timeline" :class="{ 'drag-active': isDragging }">
        <div
            ref="targetArea"
            class="target-area"
            @click="onClickToTimestamp"
            v-touch:moved="onDragStart"
            v-touch:moving="onTouchDragMove"
            v-touch:end="onDragEnd"
            v-touch:start="onTouchStart"
        />
        <div class="timeline-wrapper" ref="timeline">
            <div class="rail" :style="railStyle">
                <div class="knob"></div>
            </div>
        </div>
        <TimelineItemList v-if="timings && productsReady" :timings="timings" class="timing-list" />
    </div>
</template>

<script>
import { offset } from '@popperjs/core'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import TimelineItemList from './TimelineItemList'

export default {
    name: 'videoTimeline',
    components: {
        TimelineItemList,
    },
    data: function() {
        return {
            dragTime: 0,
            stopDragTimeout: null,
            isMounted: false,
            wasClick: false,
        }
    },
    computed: {
        ...mapGetters('player', {
            duration: 'getDuration',
            timestamp: 'getTimestamp',
            player: 'getPlayer',
            playerContainer: 'getContainerEl',
            isDragging: 'getTimelineKnobIsBeingDragged',
        }),
        ...mapGetters('playPresentation', {
            timings: 'getTimings',
        }),
        ...mapGetters('products', {
            productsStatus: 'productsStatus',
        }),
        watchedPercentage() {
            const timeToUse = this.isDragging ? this.dragTime : this.timestamp
            const percentage = Math.max(Math.min((timeToUse / this.duration) * 100, 100), 0)
            const rounded = Math.round(percentage * 1e2) / 1e2
            return rounded
        },
        railStyle() {
            if (!this.isMounted) return
            // const elRect = this.$el.getBoundingClientRect()
            // return `width: calc(${(elRect.width / 100) * this.watchedPercentage}px + 0px);`
            return `width: ${this.watchedPercentage}%;`
        },
        productsReady() {
            return this.productsStatus == 'success'
        },
    },
    methods: {
        ...mapActions('player', ['seekTo']),
        ...mapMutations('player', ['SET_IS_DRAGGING']),
        addDragListeners() {
            document.addEventListener('mouseup', this.onDragEnd)
            document.body.addEventListener('mouseleave', this.onDragEnd)
            document.addEventListener('mousemove', this.onDragMove)
        },
        removeDragListeners() {
            document.removeEventListener('mouseup', this.onDragEnd)
            document.removeEventListener('mousemove', this.onDragMove)
            document.body.removeEventListener('mouseleave', this.onDragEnd)
        },
        onClickToTimestamp(e) {
            this.wasClick = true
            this.getDragTime(e)
            this.seekTo(this.dragTime)
            this.dragTime = null
        },
        onDragStart(e) {
            if (this.wasClick) {
                this.wasClick = false
                return
            }
            // alert('drag start')
            // Remove any previous drag listener - just in case
            this.removeDragListeners()
            this.SET_IS_DRAGGING(true)
            // clearTimeout(this.stopDragTimeout)
            this.getDragTime(e)
            this.addDragListeners()
        },
        onTouchStart(e) {
            if (!e.touches) return
            this.getDragTime(e.touches[0])
        },
        onDragMove(e) {
            this.getDragTime(e)
        },
        onTouchDragMove(e) {
            if (!e.touches) return
            this.getDragTime(e.touches[0])
        },
        onDragEnd() {
            if (this.dragTime == null) {
                return
            }
            this.seekTo(this.dragTime)
            this.removeDragListeners()

            this.SET_IS_DRAGGING(false)
            this.dragTime = null
        },
        getDragTime(mouseEvent) {
            const playerRect = this.$refs.timeline.getBoundingClientRect()
            const mouseX = mouseEvent.clientX - playerRect.left

            // Add an offset to allow the user to reach the extremes of each side on mobile
            let offsetX = 0
            if (this.$store.getters['responsive/getIsMobile']) {
                offsetX = ((mouseX - playerRect.width / 2) / playerRect.width / 2) * 200
            }

            const xPercentage = Math.max(Math.min((mouseX + offsetX) / playerRect.width, 1), 0)
            this.dragTime = this.duration * xPercentage
        },
        touchStartHandler(e) {
            e.preventDefault()
        },
    },
    mounted() {
        this.$refs.targetArea.addEventListener('touchstart', this.touchStartHandler, { passive: false })
        this.isMounted = true
    },
    destroyed() {
        if (this.$refs.targetArea) this.$refs.targetArea.removeEventListener('touchstart', this.touchStartHandler)
    },
}
</script>

<style lang="scss" scoped>
.timeline {
    position: relative;
    .timing-list {
        transition: 0.1s ease-out;
    }
    .target-area {
        position: absolute;
        top: 0;
        left: 0;
        height: 40px;
        width: 100%;
        width: 200%;
        transform: translate(-25%, -50%);
        z-index: 4;
    }
    @include mobile {
        bottom: 12px;
        transition: bottom $videoPauseTransition;
        .paused &,
        &.drag-active {
            // bottom: 16px;
            // .rail {
            //     height: 8px;
            // }
            // .knob {
            //     transform: translate(50%, -50%) scale(3);
            // }
        }
    }
}
.timeline-wrapper {
    width: 100%;
    background: #bbbbbb;
    cursor: pointer;
    position: relative;
    z-index: 3;
    border-radius: 50px;
    transition: transform $videoPauseTransition;
    .drag-active & {
        .rail,
        .knob {
            transition: none;
            cursor: grabbing;
        }
    }
    @include mobile {
        background: rgba(white, 25%);
    }
    .rail {
        cursor: pointer;
        height: $heightVideoTimeline;
        position: relative;
        margin-right: 14px;
        background: $primary;
        transition: width 0.05s, height $videoPauseTransition, transform $videoPauseTransition;
        border-radius: 50px;
        @include mobile {
            height: 4px;
            background: white;
        }
    }
    .knob {
        pointer-events: none;
        cursor: pointer;
        transition: 0.1s;
        height: 14px;
        width: 14px;
        border-radius: 50px;
        background: white;
        position: absolute;
        top: 50%;
        right: 0;
        transition: transform $videoPauseTransition;
        transform: translate(50%, -50%);
        // Make not draggable
        user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        @include mobile {
            height: 8px;
            width: 8px;
            background: $primary;
        }
    }
}
</style>
